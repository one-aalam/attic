import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddActiveFieldToUsers1581671597781 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "active",
            type: "BOOLEAN",
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("user", "active");
    }

}
