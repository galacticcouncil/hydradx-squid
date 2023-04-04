import type {Result, Option} from './support'

export interface AssetState {
    hubReserve: bigint
    shares: bigint
    protocolShares: bigint
    cap: bigint
    tradable: Tradability
}

export interface Tradability {
    bits: number
}
