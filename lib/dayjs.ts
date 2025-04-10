import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(updateLocale)
dayjs.extend(localeData)
dayjs.locale('zh-cn', {
  weekStart: 1,
})

export default dayjs
