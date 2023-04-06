import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class SignupBuyerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class SignupSellerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UpdateBuyerDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsString()
    userName: string;

    @ApiProperty()
    @IsString()
    password: string;
}

export class UpdateSellerDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsString()
    userName: string;

    @ApiProperty()
    @IsString()
    password: string;
}