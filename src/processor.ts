import { lookupArchive } from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import { BatchBlock, BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from "@subsquid/substrate-processor"
import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import { In } from "typeorm"
import { OmnipoolAsset } from "./model"
import { OmnipoolAssetsStorage } from "./types/storage"
import { AssetState } from "./types/v115"
import dotenv from 'dotenv';

dotenv.config();

const archive = process.env.ARCHIVE || lookupArchive('hydradx', { release: 'FireSquid' });
const chain = process.env.CHAIN || 'wss://rpc.hydradx.cloud';
const from = Number(process.env.FROM || '1708101'); // Omnipool was initialized at block 1_708_101 on prod

console.table({ archive, chain, from });

const processor = new SubstrateBatchProcessor()
  .setDataSource({ archive, chain })
  .setBlockRange({ from })
  .includeAllBlocks({ from })

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), async ctx => {

  let omnipoolAssets: OmnipoolAsset[] = []
  const assetReserves = []

  for (let block of ctx.blocks) {
    assetReserves.push(getAssetsAndReserves(ctx, block))
  }

  const results = await Promise.all(assetReserves)
  omnipoolAssets = results.flat()

  await ctx.store.insert(omnipoolAssets)
})

async function getAssetsAndReserves(ctx: Ctx, block: BatchBlock<Item>) {
  let storage = new OmnipoolAssetsStorage(ctx, block.header)
  let omnipoolAssets: OmnipoolAsset[] = []
  let pairs = await storage.asV115.getPairs()
  for (let k in pairs) {
    omnipoolAssets.push(new OmnipoolAsset({
      id: `${pairs[k][0]}-${block.header.height}`,
      assetId: pairs[k][0],
      block: block.header.height,
      hubReserve: pairs[k][1].hubReserve
      }))
  }
  return omnipoolAssets
}