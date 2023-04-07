module.exports = class Data1680616504677 {
    name = 'Data1680616504677'

    async up(db) {
        await db.query(`CREATE TABLE "omnipool_asset" ("id" character varying NOT NULL, "asset_id" integer NOT NULL, "block" integer NOT NULL, "hub_reserve" numeric, CONSTRAINT "PK_6e3b9f3836fa6616f083b5ea75b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_89f92d8b9ed708dc4273f4c873" ON "omnipool_asset" ("block") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "omnipool_asset"`)
        await db.query(`DROP INDEX "public"."IDX_89f92d8b9ed708dc4273f4c873"`)
    }
}
