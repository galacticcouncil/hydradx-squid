import { lookupArchive } from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"
import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { In } from "typeorm"
import { OmnipoolAsset } from "./model"
import { OmnipoolAssetsStorage } from "./types/storage"


const processor = new SubstrateBatchProcessor()
  .setDataSource({
    // Lookup archive by the network name in the Subsquid registry
    archive: lookupArchive('hydradx', { release: 'FireSquid' }),
    // Use archive created by archive/docker-compose.yml
    //archive: 'http://localhost:8888/graphql',
    chain: 'wss://rpc.hydradx.cloud'
  })
  // Omnipool was initialized at block 1_708_101
  .setBlockRange({ from: 1_708_101})
  .includeAllBlocks({ from: 1_708_101})

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), async ctx => {

  let omnipoolAssets: OmnipoolAsset[] = []

  const lastBlockHeader = ctx.blocks[ctx.blocks.length - 1].header
  let lastBlockStorage = new OmnipoolAssetsStorage(ctx, lastBlockHeader)
  const assetIds = await lastBlockStorage.asV115.getKeys()

  for (const block of ctx.blocks) {
    // console.log("Last block: ", block.header.height)
    for (const asset of assetIds) {
      Promise.all([
        getAssetHubReserve(ctx, block.header.height, asset)
      ]).then(([assetReserve]) => {
        omnipoolAssets.push(
          new OmnipoolAsset({
            id: `${asset}-${block.header.height}`,
            assetId: asset,
            block: block.header.height,
            hubReserve: assetReserve
          }))
      })
    }
  }
  ctx.store.insert(omnipoolAssets)
})

async function getAssetHubReserve(ctx: Ctx, block: number, assetId: number) {
  let storage = new OmnipoolAssetsStorage(ctx, block as any)
  return (await storage.asV115.get(assetId))?.hubReserve
}