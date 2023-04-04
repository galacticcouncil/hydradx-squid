import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class BlockHeader {
    constructor(props?: Partial<BlockHeader>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    hash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    paraChainBlockHeight!: bigint
}
