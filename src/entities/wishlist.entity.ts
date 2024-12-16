import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'product_name' })
  productName: string;

  @Column('decimal', { name: 'product_price' })
  productPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
