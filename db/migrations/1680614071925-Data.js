module.exports = class Data1680614071925 {
    name = 'Data1680614071925'

    async up(db) {
        await db.query(`CREATE TABLE "block_header" ("id" character varying NOT NULL, "hash" text NOT NULL, "para_chain_block_height" numeric NOT NULL, CONSTRAINT "PK_52d3dd404f7843f6dbc507ffcbc" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "asset" ("id" character varying NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "omnipool_asset" ("id" character varying NOT NULL, "asset" integer NOT NULL, "block" integer NOT NULL, "hub_reserve" numeric, CONSTRAINT "PK_6e3b9f3836fa6616f083b5ea75b" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "block_header"`)
        await db.query(`DROP TABLE "asset"`)
        await db.query(`DROP TABLE "omnipool_asset"`)
    }
}
