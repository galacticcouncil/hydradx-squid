import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'

export class OmnipoolTokenAddedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Omnipool.TokenAdded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An asset was added to Omnipool
     */
    get isV115(): boolean {
        return this._chain.getEventHash('Omnipool.TokenAdded') === '90cf837618e00388d93a64856214bf463c660de4797eb313a8fb4d4af67c841c'
    }

    /**
     * An asset was added to Omnipool
     */
    get asV115(): {assetId: number, initialAmount: bigint, initialPrice: bigint} {
        assert(this.isV115)
        return this._chain.decodeEvent(this.event)
    }
}
