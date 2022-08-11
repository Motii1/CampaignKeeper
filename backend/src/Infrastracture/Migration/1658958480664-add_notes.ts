import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNotes1658958480664 implements MigrationInterface {
  name = 'addNotes1658958480664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "note" ("id" int NOT NULL IDENTITY(1,1), "value" nvarchar(max) NOT NULL, "user_id" int NOT NULL, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "note" ADD CONSTRAINT "FK_654d6da35fcab12c3905725a416" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_654d6da35fcab12c3905725a416"`);
    await queryRunner.query(`DROP TABLE "note"`);
  }
}
