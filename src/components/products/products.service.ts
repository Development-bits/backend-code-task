import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USERROLE } from 'src/enum/users/userrole.enum';
import { ProductInterface } from 'src/interface/products/products.interface';
import { TransactionsInterface } from 'src/interface/transcations/transactions.interface';
import { UsersInterface } from 'src/interface/users/users.interface';

@Injectable()
export class ProductsService {
    constructor (
        @InjectModel('products') private readonly _productModel: Model<ProductInterface>,
        @InjectModel('users') private readonly _userModel: Model<UsersInterface>,
        @InjectModel('transactions') private readonly _transactionModel: Model<TransactionsInterface>,
    ) {}

    async addProduct (productDto: any, req: any): Promise<any> {
        try {
            let product = await this._productModel.findOne({productName: productDto.productName});
            if (product) {
                throw new HttpException('This product already exists!', HttpStatus.NOT_ACCEPTABLE);
            }
            
            productDto.sellerld = req.user.id;

            let newProduct = await new this._productModel(productDto).save();
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct (updateProductDto: any, req): Promise<any> {
        try {
            let product = await this._productModel.findOne({_id: updateProductDto.id, sellerld: req.user.id});
            if (!product) {
                throw new HttpException('You are not authorized to update the info of this product!', HttpStatus.UNAUTHORIZED);
            }

            await this._productModel.updateOne({_id: updateProductDto.id}, updateProductDto);
            return {
                message: 'The product has been updated successfully!'
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct (id: string, req): Promise<any> {
        try {
            let product = await this._productModel.findOne({_id: id, sellerld: req.user.id});
            if (!product) {
                throw new HttpException('You are not authorized to delete this product', HttpStatus.UNAUTHORIZED);
            }
            
            await this._productModel.deleteOne({_id: id});
            return {
                message: 'Product has been deleted successfully!'
            }
        } catch (error) {
            throw error;
        }
    }

    async depositCoins (depositCoinsDto: any, req: any): Promise<any> {
        try {
            const user = await this._userModel.findOne({_id: req.user.id, role: USERROLE.buyer });
            if (!user) {
                throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
            }

            await this._userModel.updateOne({_id: req.user.id}, {$inc:{deposit: depositCoinsDto.coin}});
            return {
                message: 'Coins have been deposited successfully in your vending machine account!'
            }

        } catch (error) {
            throw error;
        }
    }

    async resetDeposit (req): Promise<any> {
        try {
            let user = await this._userModel.findOne({_id: req.user.id, role: USERROLE.buyer});
            if (!user) {
                throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
            }

            await this._userModel.updateOne({_id: req.user.id}, {deposit: 0});
            return {
                message: 'Your deposit has been reset successfully!'
            }
        } catch (error) {
            throw error;
        }
    }

    async buyProduct (buyProductDto: any, req: any): Promise<any> {
        try {
            const user = await this._userModel.findOne({_id: req.user.id, role: USERROLE.buyer});
            if (!user) {
                throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
            }

            buyProductDto.totalSpent = 0;

            for (const i in buyProductDto.products) {
                const product = await this._productModel.findOne({_id: buyProductDto.products[i].productId});
                if (!product) {
                    throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
                }
                buyProductDto.products[i].productName = product.productName;
                buyProductDto.totalSpent += product.cost * buyProductDto.products[i].amount;
            }

            if (buyProductDto.totalSpent > user.deposit) {
                throw new HttpException('You do not have sufficient coins to buy these products', HttpStatus.BAD_REQUEST);
            }
            
            buyProductDto.change = user.deposit - buyProductDto.totalSpent;

            if ((![0, 5, 10, 20, 50, 100].includes(buyProductDto.change)) && (user.deposit < 100)) {
                return {
                    message: 'Your change can only be returned in 5,10,20,50 or 100 cent coins. Kindly buy more products or add more deposit your account to get the approximate change!'
                }
            } else if ((![0, 5, 10, 20, 50, 100].includes(buyProductDto.change)) && (user.deposit == 100)) {
                return {
                    message: 'Your change can only be returned in 5,10,20,50 or 100 cent coins. Kindly buy more products to get the aprroximate change!'
                }
            }

            await this._userModel.updateOne({_id: req.user.id, role: USERROLE.buyer},{deposit: 0});

            const trx = await new this._transactionModel(buyProductDto).save();
            return trx;
        } catch (error) {
            throw error;
        }
    }

    async getProductById (id: string): Promise<any> {
        try {
            let product = await this._productModel.aggregate([
                {
                    $match: {
                        _id: id
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ]).then(items => items[0]);

            return product;
        } catch (error) {
            throw error;
        }
    }

    async getAllProducts (offset: any, limit: any): Promise<any> {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            let totalCount = await this._productModel.countDocuments();

            let products = await this._productModel.aggregate([
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
            .skip(parseInt(offset))
            .limit(parseInt(limit))

            return {
                totalCount: totalCount,
                data: products
            }
        } catch (error) {
            throw error;
        }
    }
}
