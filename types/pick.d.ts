declare interface ChuangXinGao {
  序号: number
  股票代码: string
  股票简称: string
  涨跌幅: number
  换手率: number
  最新价: number
  前期高点: number
  前期高点日期: string
}

declare interface LiangJiaQiSheng {
  序号: number
  股票代码: string
  股票简称: string
  最新价: number
  量价齐升天数: number
  阶段涨幅: number
  累计换手率: number
  所属行业: string
}

declare interface LianXuShangZhang {
  序号: number
  股票代码: string
  股票简称: string
  收盘价: number
  最高价: number
  最低价: number
  连涨天数: number
  连续涨跌幅: number
  累计换手率: number
  所属行业: string
}

declare interface ChiXuFangLiang {
  序号: number
  股票代码: string
  股票简称: string
  涨跌幅: number
  最新价: number
  成交量: string
  基准日成交量: string
  放量天数: number
  阶段涨跌幅: number
  所属行业: string
}
