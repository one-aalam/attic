export type UserRoleType = "ROLE_USER" | "ROLE_ADMIN";

import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { IsEmail, Length } from "class-validator"
import * as bcrypt from 'bcrypt';

@Entity()
class User extends BaseEntity {
  private saltRounds = 10;

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  @Length(4, 20)
  username!: string;

  @Column({ length: 100 })
  @Length(4, 100)
  password!: string;

  @Column({ length: 500, unique: true  })
  @IsEmail()
  email!: string;

  @Column({
    type: "simple-array",
    default: [],
    array: true
  })
  avatarUrl?: string[];

  @Column({
    type: "simple-json",
    default: {},
  })
  profile?: {[key:string]: string};

  @Column({ default: false })
  active!: boolean;

  @Column({ default: '' })
  resetPasswordToken!: string;

  @Column({
    type: "simple-array",
    default: ['ROLE_USER'],
    array: true,
  })
  roles?: string[]; // ROLE_USER, ROLE_ADMIN

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, this.saltRounds);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    console.log(attempt, this.password);
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(): any {
    const { id, username, email, avatarUrl, roles } = this;
    const responseObject: any = {
      id,
      username,
      email,
      avatarUrl,
      roles
    };

    return responseObject;
  }
}

export default User;
