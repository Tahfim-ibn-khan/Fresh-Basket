import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from 'src/entities/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist])],
  providers: [
    WishlistService,
    {
      provide: 'WishlistRepository',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Wishlist),
      inject: [DataSource],
    },
  ],
  controllers: [WishlistController],
})
export class WishlistModule {}
