import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column('decimal')
  totalPrice: number;

  @Column({ default: 'pending' }) // Values: pending, paid, delivered
  status: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column()
  deliveryAddress: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  deliveryInstructions: string;

  @Column('jsonb', { nullable: true, default: () => "'[]'::jsonb" })  // ✅ Allow null for existing orders
  products: Array<{ productId: number; productName: string; quantity: number; unitPrice: number; total: number }> | null;

  @CreateDateColumn()
  orderDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
