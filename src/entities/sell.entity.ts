import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sells')
export class Sell {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column('decimal')
  price: number;

  @Column()
  quantity: number;
}
