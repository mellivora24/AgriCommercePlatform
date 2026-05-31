import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config';
import { AuthModule } from '@module/auth/auth.module';
import { UsersModule } from '@module/users/users.module';
import { CategoriesModule } from '@module/categories/categories.module';
import { SellersModule } from '@module/sellers/sellers.module';
import { ProductsModule } from '@module/products/products.module';
import { CartModule } from '@module/cart/cart.module';
import { OrdersModule } from '@module/orders/orders.module';
import { ShipmentsModule } from '@module/shipments/shipments.module';
import { PaymentsModule } from '@module/payments/payments.module';
import { WalletModule } from '@module/wallet/wallet.module';
import { ReturnsModule } from '@module/returns/returns.module';
import { AdminModule } from '@module/admin/admin.module';
import { BuyerProfilesModule } from '@module/buyer_profiles/buyer_profiles.module';
import { ShipperProfilesModule } from '@module/shipper_profiles/shipper_profiles.module';
import { PrismaModule } from '@app-prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    SellersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ShipmentsModule,
    PaymentsModule,
    WalletModule,
    ReturnsModule,
    AdminModule,
    BuyerProfilesModule,
    ShipperProfilesModule,
  ],
})
export class AppModule {}
