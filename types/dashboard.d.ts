interface ApiResponse<T> {
  success: boolean
  data: T
}

interface StockPosition {
  id: number
  code: string
  name: string
  shares: number
  cost: number
}

interface StockInfo {
  id: number;
  code: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

declare type StockPositionsResponse = ApiResponse<StockPosition[]>

declare type StockInfoResponse = ApiResponse<StockInfo[]>

declare type UpdateStockPriceFormData = {
  code: string
  price: number
}
