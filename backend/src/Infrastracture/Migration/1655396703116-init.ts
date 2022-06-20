import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1655396703116 implements MigrationInterface {
  name = 'init1655396703116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "schema" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(128) NOT NULL, "campaign_id" int NOT NULL, "fields" ntext NOT NULL, CONSTRAINT "PK_4560fb648e43aaca39514a74f5c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "characters_metadata" ("id" int NOT NULL IDENTITY(1,1), "event_id" int NOT NULL, "value" nvarchar(255) NOT NULL, "type" nvarchar(255) CONSTRAINT CHK_762120412d443f9cbac8ef8da4_ENUM CHECK(type IN ('id','string')) NOT NULL, "sequence_number" int NOT NULL, CONSTRAINT "PK_a37ab45d1d6ecf8c7bca2ef74fd" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "description_metadata" ("id" int NOT NULL IDENTITY(1,1), "event_id" int NOT NULL, "value" nvarchar(255) NOT NULL, "type" nvarchar(255) CONSTRAINT CHK_d980a6bc5da9888fb95d5cc540_ENUM CHECK(type IN ('id','string')) NOT NULL, "sequence_number" int NOT NULL, CONSTRAINT "PK_493099974a91c04a9f41c048f48" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "place_metadata" ("id" int NOT NULL IDENTITY(1,1), "event_id" int NOT NULL, "value" nvarchar(255) NOT NULL, "type" nvarchar(255) CONSTRAINT CHK_538ed83b9e6a490adce903ab0e_ENUM CHECK(type IN ('id','string')) NOT NULL, "sequence_number" int NOT NULL, CONSTRAINT "PK_4c1fd31c641bcfe1c03369b6dc2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(128) NOT NULL, "type" nvarchar(255) CONSTRAINT CHK_dc1530d07152e61483ada370ac_ENUM CHECK(type IN ('normal','fight')) NOT NULL, "status" nvarchar(255) CONSTRAINT CHK_61c95bdc7e1964a50bda3e240e_ENUM CHECK(status IN ('done','omitted','none')) NOT NULL, "session_id" int NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(128), "campaign_id" int NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_bf57d260f46519649f6ebc6a55b" DEFAULT getdate(), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "username" nvarchar(64) NOT NULL, "password_hash" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "image" varbinary(max), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `
    );
    await queryRunner.query(
      `CREATE TABLE "campaign" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(128) NOT NULL, "image" varbinary(max), "created_at" datetime2 NOT NULL CONSTRAINT "DF_5142ffc8d7958cd2e4e67ecd820" DEFAULT getdate(), "user_id" int NOT NULL, CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "schema_instance_metadata" ("id" int NOT NULL IDENTITY(1,1), "object_id" int NOT NULL, "type" nvarchar(255) CONSTRAINT CHK_2df37da5e4d4aeb1f8c9d97cda_ENUM CHECK(type IN ('id','string')) NOT NULL, "value" nvarchar(255) NOT NULL, "sequence_number" int NOT NULL, "field_name" nvarchar(255) NOT NULL, CONSTRAINT "PK_cfcaba6cd494c6e0a8d68144342" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "schema_instance" ("id" int NOT NULL IDENTITY(1,1), "schema_id" int NOT NULL, "title" nvarchar(128) NOT NULL, "image" varbinary(max), CONSTRAINT "PK_27c7ae0810b3b0a587cd294b943" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "event_children_event" ("event_id_1" int NOT NULL, "event_id_2" int NOT NULL, CONSTRAINT "PK_620e1df4cbaeddc45900be558c7" PRIMARY KEY ("event_id_1", "event_id_2"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bbe444be73444c9428fef8f5c4" ON "event_children_event" ("event_id_1") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5b0c2dba3019d5bf6156f612ee" ON "event_children_event" ("event_id_2") `
    );
    await queryRunner.query(
      `ALTER TABLE "schema" ADD CONSTRAINT "FK_a566fbdd3bc726f61573bb84b5d" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "characters_metadata" ADD CONSTRAINT "FK_4f24f131ee5b56768a8ecf08de0" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "description_metadata" ADD CONSTRAINT "FK_e23d62b65aefec741272cd59a76" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "place_metadata" ADD CONSTRAINT "FK_f6fb7f1ab5f39cb9f9902aa1a28" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_218ab4056fa09023ca72952c670" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_e08a12c27bb64d120af9f8e3a68" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "campaign" ADD CONSTRAINT "FK_9fe77978fc1aff6b180cfce5e77" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "schema_instance_metadata" ADD CONSTRAINT "FK_4d002afffcd07da0a331c965ca7" FOREIGN KEY ("object_id") REFERENCES "schema_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "schema_instance" ADD CONSTRAINT "FK_58b12a5ff58dedcb2c0234f1c10" FOREIGN KEY ("schema_id") REFERENCES "schema"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event_children_event" ADD CONSTRAINT "FK_bbe444be73444c9428fef8f5c4a" FOREIGN KEY ("event_id_1") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "event_children_event" ADD CONSTRAINT "FK_5b0c2dba3019d5bf6156f612ee7" FOREIGN KEY ("event_id_2") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_children_event" DROP CONSTRAINT "FK_5b0c2dba3019d5bf6156f612ee7"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_children_event" DROP CONSTRAINT "FK_bbe444be73444c9428fef8f5c4a"`
    );
    await queryRunner.query(
      `ALTER TABLE "schema_instance" DROP CONSTRAINT "FK_58b12a5ff58dedcb2c0234f1c10"`
    );
    await queryRunner.query(
      `ALTER TABLE "schema_instance_metadata" DROP CONSTRAINT "FK_4d002afffcd07da0a331c965ca7"`
    );
    await queryRunner.query(
      `ALTER TABLE "campaign" DROP CONSTRAINT "FK_9fe77978fc1aff6b180cfce5e77"`
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_e08a12c27bb64d120af9f8e3a68"`
    );
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_218ab4056fa09023ca72952c670"`);
    await queryRunner.query(
      `ALTER TABLE "place_metadata" DROP CONSTRAINT "FK_f6fb7f1ab5f39cb9f9902aa1a28"`
    );
    await queryRunner.query(
      `ALTER TABLE "description_metadata" DROP CONSTRAINT "FK_e23d62b65aefec741272cd59a76"`
    );
    await queryRunner.query(
      `ALTER TABLE "characters_metadata" DROP CONSTRAINT "FK_4f24f131ee5b56768a8ecf08de0"`
    );
    await queryRunner.query(
      `ALTER TABLE "schema" DROP CONSTRAINT "FK_a566fbdd3bc726f61573bb84b5d"`
    );
    await queryRunner.query(
      `DROP INDEX "IDX_5b0c2dba3019d5bf6156f612ee" ON "event_children_event"`
    );
    await queryRunner.query(
      `DROP INDEX "IDX_bbe444be73444c9428fef8f5c4" ON "event_children_event"`
    );
    await queryRunner.query(`DROP TABLE "event_children_event"`);
    await queryRunner.query(`DROP TABLE "schema_instance"`);
    await queryRunner.query(`DROP TABLE "schema_instance_metadata"`);
    await queryRunner.query(`DROP TABLE "campaign"`);
    await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user"`);
    await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "place_metadata"`);
    await queryRunner.query(`DROP TABLE "description_metadata"`);
    await queryRunner.query(`DROP TABLE "characters_metadata"`);
    await queryRunner.query(`DROP TABLE "schema"`);
  }
}
