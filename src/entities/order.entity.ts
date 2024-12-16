import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @Column()
  status: string;

  @Column('decimal', { name: 'total_price' })
  totalPrice: number;

  @Column({ name: 'order_date' })
  orderDate: Date;

  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

  @Column({ name: 'delivery_date', nullable: true })
  deliveryDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
