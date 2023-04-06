import { ApiProperty } from "@nestjs/swagger";
import { Products } from "src/interface/transcations/transactions.interface";

export class BuyProductDto {
    @ApiProperty({
        example: [
            {
                productId: '',
                amount: 0
            }
        ]
    })
    products: Products[]
}