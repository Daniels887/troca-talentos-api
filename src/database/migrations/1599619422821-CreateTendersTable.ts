import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTendersTable1599619422821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'tenders',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
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
          name: 'tcoin',
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
    await queryRunner.dropTable('tenders');
  }
}
