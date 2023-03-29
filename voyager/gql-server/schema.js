export const typeDefs = `#graphql
    "used for Voyager entry point"
    scalar BigInt
    scalar BigDecimal
    scalar DateTime

    type Query {
        assets: [Asset!]!
        accounts: [Account!]!
        pairs: [Pair!]!
        omnipool: Omnipool!
    }

    type Account {
        id: String!
        positions: [Position!]!
    }

    type Asset {
        id: ID!
        name: String!
        symbol: String!
        decimals: Int!
        totalSupply: BigInt!
        tradeVolume: BigDecimal!
        tradeVolumeUSD: BigDecimal!
        liquidity: BigDecimal!
        priceUSD: BigDecimal!
        volumeUSD: BigDecimal!
        omnipoolAssetDetails: [OmnipoolAssetDetail!]
    }

    type OmnipoolAssetDetail {
        hubReserve: BigInt
        shares: BigInt
        protocolShares: BigInt
        cap: BigInt
        tradable: Boolean
    }

    type Pair {
        id: ID!
        asset0: Asset!
        asset1: Asset!
        reserve0: BigDecimal!
        reserve1: BigDecimal!
        reserveUSD: BigDecimal!
        totalSupply: BigDecimal!
        price0: BigDecimal!
        price1: BigDecimal!
        volumeAsset0: BigDecimal!
        volumeAsset1: BigDecimal!
        volumeUSD: BigDecimal!
    }

    type Buy {
        id: ID!
        timestamp: DateTime!
        pair: Pair!
        buyer: Account!
        assetBought: Asset!
        buyAmount: BigInt!
        assetSold: Asset!
        boughtAmount: BigInt!
        amountUSD: BigDecimal!
    }

    type Sell {
        id: ID!
        timestamp: DateTime!
        pair: Pair!
        seller: Account!
        assetSold: Asset!
        soldAmount: BigInt!
        assetBought: Asset!
        boughtAmount: BigInt!
        amountUSD: BigDecimal!
    }

    type Omnipool {
        id: ID!
        numAssets: Int!
        assets: [Asset!]!
        balances: [BigInt!]!
        positions: [Position!]!
        assetFee: BigInt!
        protocolFee: BigInt!
        buys: [Buy!]!
        sells: [Sell!]!
    }

    type Position {
        id: ID!
        assetId: ID!
        amount: BigInt!
        shares: BigInt!
        amountAsset0: BigInt!
        amountAsset1: BigInt!
        isPOL: Boolean!
    }
`;