import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { DepositCoinsDto, ProductDto, UpdateProductDto } from 'src/dto/products/products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gurd';
import { JwtSellerAuthGuard } from '../auth/jwt-seller-auth.guard';
import { JwtBuyerAuthGuard } from '../auth/jwt-buyer-auth.guard';
import { BuyProductDto } from 'src/dto/transactions/transactions.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor (private readonly _productService: ProductsService) {}

    @UseGuards(JwtSellerAuthGuard)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('addProduct')
    addProduct (
        @Body() productDto: ProductDto,
        @Req() req
    ) {
        return this._productService.addProduct(productDto, req);
    }

    @UseGuards(JwtSellerAuthGuard)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('updateProduct')
    updateProduct (
        @Body() updateProductDto: UpdateProductDto,
        @Req() req
    ) {
        return this._productService.updateProduct(updateProductDto, req);
    }

    @UseGuards(JwtSellerAuthGuard)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete('deleteProduct/:id')
    deleteProduct (
        @Param('id') id: string,
        @Req() req
    ) {
        return this._productService.deleteProduct(id, req);
    }

    @UseGuards(JwtBuyerAuthGuard)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('depositCoins')
    depositCoins (
        @Body() depositCoinsDto: DepositCoinsDto,
        @Req() req
    ) {
        return this._productService.depositCoins(depositCoinsDto, req);
    }

    @UseGuards(JwtBuyerAuthGuard)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('resetDeposit')
    resetDeposit (
        @Req() req
    ) {
        return this._productService.resetDeposit(req);
    }

    @UseGuards(JwtBuyerAuthGuard)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('buyProduct')
    buyProduct (
        @Body() BuyProductDto: BuyProductDto,
        @Req() req
    ) {
        return this._productService.buyProduct(BuyProductDto, req);
    }

    @Get('getProductById/:id') 
    getProductById (
        @Param('id') id: string
    ) {
        return this._productService.getProductById(id);
    }

    @Get('getAllProducts')
    getAllProducts (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10
    ) {
        return this._productService.getAllProducts(offset, limit);
    }
}
