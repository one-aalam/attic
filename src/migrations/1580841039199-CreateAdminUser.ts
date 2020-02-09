import {MigrationInterface, QueryRunner} from "typeorm";
import * as userService from 'services/user.service'

export class CreateAdminUser1580841039199 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const user = await userService.create({
            username: 'admin',
            password: 'admin',
            email: 'admin@localhost',
            roles: ['USER_ADMIIN']
        });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
