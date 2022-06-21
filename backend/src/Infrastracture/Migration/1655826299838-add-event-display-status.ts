import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEventDisplayStatus1655826299838 implements MigrationInterface {
  name = 'addEventDisplayStatus1655826299838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" ADD "display_status" nvarchar(255) CONSTRAINT CHK_7190f9b7d0232632ff358e1399_ENUM CHECK(display_status IN ('shown','hidden','collapsed')) NOT NULL CONSTRAINT "DF_4f5917e96152dceba9bc5d257cf" DEFAULT 'shown'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "DF_4f5917e96152dceba9bc5d257cf"`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "display_status"`);
  }
}
