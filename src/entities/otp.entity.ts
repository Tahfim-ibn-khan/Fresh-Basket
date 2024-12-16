import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('otps')
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  otp: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expiry_time: Date;
}
