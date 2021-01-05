import {
  MigrationInterface, QueryRunner, Table,
} from 'typeorm';

export class CreateSchedulesTable1599620276796 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'schedules',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'id_provider',
          type: 'uuid',
        },
        {
          name: 'id_contractor',
          type: 'uuid',
        },
        {
          name: 'talentId',
          type: 'int',
        },
        {
          name: 'date',
          type: 'timestamp',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedules');
  }
}
