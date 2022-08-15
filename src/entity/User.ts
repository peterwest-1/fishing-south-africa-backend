import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FishCaught } from "./FishCaught";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Column("text")
  password: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { length: 255, unique: true, nullable: true })
  username?: string;

  @Field(() => Boolean, { description: "True if user has activated/confirmed their account" })
  @Column("bool", { default: false })
  confirmed: boolean;

  @Field(() => Boolean, { description: "Locked out due to Forgot Password" })
  @Column("bool", { default: false })
  forgotPasswordLocked: boolean;

  @OneToMany(() => FishCaught, (fc) => fc.user)
  fishes: FishCaught[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
