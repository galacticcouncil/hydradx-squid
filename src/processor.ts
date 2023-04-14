import { lookupArchive } from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"
import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { In } from "typeorm"
import { OmnipoolAsset } from "./model"
import { OmnipoolTokenAddedEvent } from "./types/events"
import { OmnipoolAssetsStorage } from "./types/storage"
import { AssetState } from "./types/v115"


const processor = new SubstrateBatchProcessor()
  .setDataSource({
    // Lookup archive by the network name in the Subsquid registry
    archive: lookupArchive('hydradx', { release: 'FireSquid' }),
    // Use archive created by archive/docker-compose.yml
    //archive: 'http://localhost:8888/graphql',
    chain: 'wss://rpc.hydradx.cloud'
  })
  // Omnipool was initialized at block 1_708_101
  .setBlockRange({ from: 1_708_101, to: 1_708_201})
  .includeAllBlocks({ from: 1_708_101, to: 1_708_201})

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), async ctx => {

  let omnipoolAssets: OmnipoolAsset[] = []

  for (const block of ctx.blocks) {
    if (block.header.height % 100 == 0) {
      console.log("block: ", block.header.height)
    }
    
    let oa = await getAssetsAndReserves(ctx, block.header.height)
    omnipoolAssets.push(...oa)
  }

  await ctx.store.insert(omnipoolAssets)
})

async function getAssetHubReserves(ctx: Ctx, block: number, assetId: number) {
  let storage = new OmnipoolAssetsStorage(ctx, block as any)
  return storage
}

async function getAssetsAndReserves(ctx: Ctx, block: number) {
  let storage = new OmnipoolAssetsStorage(ctx, block as any)
  let omnipoolAssets: OmnipoolAsset[] = []
  let pairs = await storage.asV115.getPairs()
  for (let k in pairs) {
    omnipoolAssets.push(new OmnipoolAsset({
      id: `${pairs[k][0]}-${block}`,
      assetId: pairs[k][0],
      block: block,
      hubReserve: pairs[k][1].hubReserve
      }))
  }
  return omnipoolAssets
}