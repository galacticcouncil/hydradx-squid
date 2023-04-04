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
    //archive: lookupArchive("kusama", {release: "FireSquid"})

    // Use archive created by archive/docker-compose.yml
    archive: lookupArchive('hydradx', { release: 'FireSquid' })
  })
// .setBlockRange({ from: 1_000_000, to: 2_100_000})
// .includeAllBlocks({ from: 1_000_000, to: 2_100_000});


type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), async ctx => {

  const assets = await ctx.store.find(Asset)
  let omnipoolAssets: OmnipoolAsset[] = []

  for (const block of ctx.blocks) {
    let storage = new OmnipoolAssetsStorage(ctx, block.header)
    //let assetId = 2;
    let assetReserve = (await storage.asV115);
    ctx.log.info(`HubReserve at block ${block.header.height} is ${assetReserve.toString()}`)
  }
})