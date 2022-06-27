import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixEventConstraints1656348034029 implements MigrationInterface {
  name = 'fixEventConstraints1656348034029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_children_event" DROP CONSTRAINT "FK_5b0c2dba3019d5bf6156f612ee7"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_children_event" DROP CONSTRAINT "FK_bbe444be73444c9428fef8f5c4a"`
    );
    await queryRunner.query(
      `ALTER TABLE "event_children_event" ADD CONSTRAINT "FK_bbe444be73444c9428fef8f5c4a" FOREIGN KEY ("event_id_1") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "event_children_event" ADD CONSTRAINT "FK_5b0c2dba3019d5bf6156f612ee7" FOREIGN KEY ("event_id_2") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`
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
      `ALTER TABLE "event_children_event" ADD CONSTRAINT "FK_bbe444be73444c9428fef8f5c4a" FOREIGN KEY ("event_id_1") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "event_children_event" ADD CONSTRAINT "FK_5b0c2dba3019d5bf6156f612ee7" FOREIGN KEY ("event_id_2") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
