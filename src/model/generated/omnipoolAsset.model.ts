import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {BlockHeader} from "./blockHeader.model"

@Entity_()
export class OmnipoolAsset {
    constructor(props?: Partial<OmnipoolAsset>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @Index_()
    @ManyToOne_(() => BlockHeader, {nullable: true})
    block!: BlockHeader | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    hubReserve!: bigint | undefined | null
}
