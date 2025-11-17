export interface LineItem {
  id: string;
  productId: string;
  variant: {
    sku: string;
  };
  quantity: number;
  price: {
    value: {
      centAmount: number;
      currencyCode: string;
    };
  };
  name: Record<string, string>;
}

export interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
  totalLineItemQuantity: number;
  // Add other cart properties as needed
}

export interface CartResponse {
  data: Cart;
}
