import { lookupArchive } from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"
import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { In } from "typeorm"
import { Asset, BlockHeader, OmnipoolAsset } from "./model"
import { OmnipoolAssetsStorage } from "./types/storage"


const processor = new SubstrateBatchProcessor()
  .setDataSource({
    // Lookup archive by the network name in the Subsquid registry
    archive: lookupArchive('hydradx', { release: 'FireSquid' }),
    // Use archive created by archive/docker-compose.yml
    //archive: 'http://localhost:8888/graphql',
    chain: 'wss://rpc.hydradx.cloud'
  })
.setBlockRange({ from: 2_099_990, to: 2_100_000})
.includeAllBlocks({ from: 2_099_990, to: 2_100_000})


type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), async ctx => {

  // const assets = await ctx.store.find(Asset)

  let omnipoolAssets: OmnipoolAsset[] = []

  for (const block of ctx.blocks) {
    let storage = new OmnipoolAssetsStorage(ctx, block.header)
    for (const assetId of await storage.asV115.getKeys()) {
      let assetReserve = (await storage.asV115.get(assetId))?.hubReserve;
      //let assetName = (await storage.asV115.get(assetId))?.name;
      //ctx.log.info(`HubReserve for assetId ${assetId} at block ${block.header.height} is ${assetReserve}`)
      omnipoolAssets.push(
        new OmnipoolAsset({
          id: `${assetId}-${block.header.height}`,
          asset: assetId,
          block: block.header.height,//new BlockHeader({id: block.header.hash}),
          hubReserve: assetReserve}))
    }
  }
  ctx.store.save(omnipoolAssets)
})