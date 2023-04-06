import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, IsIn } from "class-validator";

export class ProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amountAvailable: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    cost: number;
}

export class UpdateProductDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    productName: string;

    @ApiProperty()
    @IsNumber()
    amountAvailable: number;

    @ApiProperty()
    @IsNumber()
    cost: number;
}

export class DepositCoinsDto {
    @ApiProperty({
        enum: [2, 5, 10, 20, 50, 100]
    })
    @IsIn([2, 5, 10, 20, 50, 100], { message: 'Coin must be one of the following values: 2, 5, 10, 20, 50, 100' })
    coin: number;
}