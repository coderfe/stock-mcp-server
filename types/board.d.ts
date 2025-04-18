declare interface IndustrySector {
  排名: number
  板块名称: string
  板块代码: string
  最新价: number
  涨跌额: number
  涨跌幅: number
  总市值: number
  换手率: number
  上涨家数: number
  下跌家数: number
  领涨股票: string
  '领涨股票-涨跌幅': number
  日期: string
}

declare interface IndustryStock {
  序号: number
  代码: string
  名称: string
  最新价: number
  涨跌幅: number
  涨跌额: number
  成交量: number
  成交额: number
  振幅: number
  最高: number
  最低: number
  今开: number
  昨收: number
  换手率: number
  '市盈率-动态': number
  市净率: number
}
