import {
  MigrationInterface, QueryRunner, Table, TableForeignKey,
} from 'typeorm';

export class CreateTalentsTable1599620684066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'talents',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'userId',
          type: 'uuid',
        },
        {
          name: 'talent',
          type: 'varchar',
        },
        {
          name: 'banner',
          type: 'varchar',
        },
        {
          name: 'rating',
          type: 'float',
        },
        {
          name: 'description',
          type: 'varchar',
        },
      ],
    }));

    await queryRunner.createForeignKey('talents', new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('talents');
  }
}
