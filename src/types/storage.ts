import assert from 'assert'
import {Block, BlockContext, Chain, ChainContext, Option, Result, StorageBase} from './support'
import * as v115 from './v115'

export class OmnipoolAssetsStorage extends StorageBase {
    protected getPrefix() {
        return 'Omnipool'
    }

    protected getName() {
        return 'Assets'
    }

    /**
     *  State of an asset in the omnipool
     */
    get isV115(): boolean {
        return this.getTypeHash() === 'e9d175ccf43f4534de030cc68b59361b729e5bc590b17200ab03088a09a1bd29'
    }

    /**
     *  State of an asset in the omnipool
     */
    get asV115(): OmnipoolAssetsStorageV115 {
        assert(this.isV115)
        return this as any
    }
}

/**
 *  State of an asset in the omnipool
 */
export interface OmnipoolAssetsStorageV115 {
    get(key: number): Promise<(v115.AssetState | undefined)>
    getAll(): Promise<v115.AssetState[]>
    getMany(keys: number[]): Promise<(v115.AssetState | undefined)[]>
    getKeys(): Promise<number[]>
    getKeys(key: number): Promise<number[]>
    getKeysPaged(pageSize: number): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, key: number): AsyncIterable<number[]>
    getPairs(): Promise<[k: number, v: v115.AssetState][]>
    getPairs(key: number): Promise<[k: number, v: v115.AssetState][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: number, v: v115.AssetState][]>
    getPairsPaged(pageSize: number, key: number): AsyncIterable<[k: number, v: v115.AssetState][]>
}
