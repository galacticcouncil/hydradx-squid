import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Index_(["assetId", "block"], {unique: false})
@Entity_()
export class OmnipoolAsset {
    constructor(props?: Partial<OmnipoolAsset>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    assetId!: number

    @Index_()
    @Column_("int4", {nullable: false})
    block!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    hubReserve!: bigint | undefined | null
}
