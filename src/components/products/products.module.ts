import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/schema/products/products.schema';
import { UserSchema } from 'src/schema/users/users.schema';
import { TransactionSchema } from 'src/schema/transactions/transactions.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'products', schema: ProductSchema },
            { name: 'users', schema: UserSchema },
            { name: 'transactions', schema: TransactionSchema }
        ])
    ],
    controllers: [ProductsController],
    providers: [ProductsService]
})
export class ProductsModule {}
