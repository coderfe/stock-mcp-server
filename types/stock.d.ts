declare interface ItemValue {
  item: string;
  value: number | string;
}

interface BaseStockHistory {
  日期: string;
  开盘: number;
  收盘: number;
  最高: number;
  最低: number;
  成交量: number;
  成交额: number;
  振幅: number;
  涨跌幅: number;
  涨跌额: number;
  换手率: number;
}

declare interface StockHistory extends BaseStockHistory {
  股票代码: string;
}

interface IndexHistory extends BaseStockHistory {}

declare interface FinancialData {
  "报告期": number;
  "净利润": string;
  "净利润同比增长率": boolean | string;
  "扣非净利润": boolean | string;
  "扣非净利润同比增长率": boolean | string;
  "营业总收入": string;
  "营业总收入同比增长率": boolean | string;
  "基本每股收益": boolean | string;
  "每股净资产": string;
  "每股资本公积金": boolean | string;
  "每股未分配利润": boolean | string;
  "每股经营现金流": boolean | string;
  "销售净利率": string;
  "销售毛利率": string;
  "净资产收益率": boolean | string;
  "净资产收益率-摊薄": string;
  "营业周期": string;
  "存货周转率": string;
  "存货周转天数": string;
  "应收账款周转天数": boolean | string;
  "流动比率": string;
  "速动比率": string;
  "保守速动比率": string;
  "产权比率": string;
  "资产负债率": string;
}

declare interface CostAnalysisData {
  "日期": string;
  "获利比例": number;
  "平均成本": number;
  "90成本-低": number;
  "90成本-高": number;
  "90集中度": number;
  "70成本-低": number;
  "70成本-高": number;
  "70集中度": number;
}

declare interface MarketData {
  "数据日期": string;
  "当日收盘价": number;
  "当日涨跌幅": number;
  "总市值": number;
  "流通市值": number;
  "总股本": number;
  "流通股本": number;
  "PE(TTM)": number;
  "PE(静)": number;
  "市净率": number;
  "PEG值": number;
  "市现率": number;
  "市销率": number;
}

declare interface CapitalFlowData {
  "日期": string;
  "收盘价": number;
  "涨跌幅": number;
  "主力净流入-净额": number;
  "主力净流入-净占比": number;
  "超大单净流入-净额": number;
  "超大单净流入-净占比": number;
  "大单净流入-净额": number;
  "大单净流入-净占比": number;
  "中单净流入-净额": number;
  "中单净流入-净占比": number;
  "小单净流入-净额": number;
  "小单净流入-净占比": number;
}

interface BaseStrongStock {
  "序号": number;
  "代码": string;
  "名称": string;
  "涨跌幅": number;
  "最新价": number;
  "成交额": number;
  "流通市值": number;
  "总市值": number;
  "换手率": number;
  "涨停统计": string;
  "所属行业": string;
}

declare interface StrongStock extends BaseStrongStock {
  "涨停价": number;
  "涨速": number;
  "是否新高": "是" | "否";
  "量比": number;
  "入选理由": string;
}

declare interface LimitUpStock extends BaseStrongStock {
  "封板资金": number;
  "首次封板时间": string;
  "最后封板时间": string;
  "炸板次数": number;
  "连板数": number;
}

declare interface HKStockData {
  "序号": number;
  "代码": string;
  "名称": string;
  "最新价": number;
  "涨跌额": number;
  "涨跌幅": number;
  "今开": number;
  "最高": number;
  "最低": number;
  "昨收": number;
  "成交量": number;
  "成交额": number;
}
