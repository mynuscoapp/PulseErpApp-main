export class DealProductList{
    OWNER_ID: string;
    OWNER_TYPE: string ='D';
    PRODUCT_ID: number;
    PRODUCT_NAME: string;
    ORIGINAL_PRODUCT_NAME: string;
    PRODUCT_DESCRIPTION: string;
    PRICE: number;
<<<<<<< HEAD
    PRODUCT_NAME: string;
=======
    PRICE_EXCLUSIVE: number;
    PRICE_NETTO: number;
    PRICE_BRUTTO: number;
    PRICE_ACCOUNT: string;
>>>>>>> 9e41d99e8cd94a83bd4e739174c748ab41359717
    QUANTITY: number;
    DISCOUNT_TYPE_ID: number;
    DISCOUNT_RATE: number;
    DISCOUNT_SUM: number;
    TAX_RATE: number;
    TAX_INCLUDED: string;
    CUSTOMIZED: string = 'Y';
    MEASURE_CODE: number = 796;
    MEASURE_NAME: string = 'pcs';
    SORT: number = 0;
    XML_ID: string;
    TYPE: number = 1;
    STORE_ID: string;
    RESERVE_ID: string;
    DATE_RESERVE_END: Date;
    RESERVE_QUANTITY: string;
}