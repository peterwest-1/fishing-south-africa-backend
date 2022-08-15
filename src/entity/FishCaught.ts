import { Field, Float, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class FishCaught extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => ID)
  @Column("uuid")
  userId: string;

  @ManyToOne(() => User, (user) => user.fishes)
  user: User;

  @Field(() => String)
  @Column()
  species: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float", nullable: true })
  weight?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float", nullable: true })
  length?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  notes?: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
