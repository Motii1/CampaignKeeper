import { MigrationInterface, QueryRunner } from 'typeorm';

export class adjustVarcharLength1658945649074 implements MigrationInterface {
  name = 'adjustVarcharLength1658945649074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schema_instance_metadata" ALTER COLUMN "value" NVARCHAR(MAX) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schema_instance_metadata" ALTER COLUMN "value" NVARCHAR(255) NOT NULL`
    );
  }
}
