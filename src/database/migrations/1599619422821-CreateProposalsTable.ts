import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProposalsTable1599619422821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'proposals',
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
          name: 'tcoin',
          type: 'int',
        },
        {
          name: 'date',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'talentId',
          type: 'int',
        },
        {
          name: 'accepted',
          type: 'varchar',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('proposals');
  }
}
