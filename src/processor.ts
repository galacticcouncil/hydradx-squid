import { lookupArchive } from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"
import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { In } from "typeorm"
import { OmnipoolAsset } from "./model"
import { OmnipoolTokenAddedEvent } from "./types/events"
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
  .setBlockRange({ from: 1_708_101, to: 1_709_101})
  .includeAllBlocks({ from: 1_708_101, to: 1_709_101})
  // .addEvent('Omnipool.TokenAdded', {
  //   data: {
  //     event: {
  //       args: true,
  //     },
  //   },
  // })

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), async ctx => {

  let omnipoolAssets: OmnipoolAsset[] = []
  let assetIds = await getAssets(ctx, ctx.blocks[0].header.height)
  console.log("assetIds: ", assetIds)

  for (const block of ctx.blocks) {
    console.log("block: ", block.header.height % 100 == 0)

    // for (let item of block.items) {
    //   if (item.name == 'Omnipool.TokenAdded') {
    //     let e = new OmnipoolTokenAddedEvent(ctx, item.event).asV115
    //     console.log("assetId ", e.assetId)
    //     assetIds.push(e.assetId)
    //   }
    // }

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

function getAssets(ctx: Ctx, block: number) {
  let storage = new OmnipoolAssetsStorage(ctx, block as any)
  return storage.asV115.getKeys()
}