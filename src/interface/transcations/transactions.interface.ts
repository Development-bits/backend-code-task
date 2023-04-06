export interface Products {
    productId: string;
    productName: string;
    amount: number;
}

export class TransactionsInterface {
    _id: string;
    products: Products[];
    totalSpent: number;
    change: number;
}