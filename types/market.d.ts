declare interface MarketStockQuote {
  股票代码: string;
  交易所: "SZ" | "HK" | string;
  股票简称: string;
  财报期: string;
}
