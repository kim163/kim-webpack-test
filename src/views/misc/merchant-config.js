
const config = [
  {
    merchantId:100101,
    name:'千赢国际',
    logo: require('./images/qianYing-logo.png'),
    short:'千赢',
    prefix:'qy'
  },
  {
    merchantId:100102,
    name:'乐虎国际',
    logo: require('./images/leHu-logo.png'),
    short:'乐虎',
    prefix:'leh'
  },
  {
    merchantId:100103,
    name:'龙8',
    logo: require('./images/long8-logo.png'),
    short:'龙8',
    prefix:'l8'
  },
  {
    merchantId:100104,
    name:'亚博娱乐',
    logo: require('./images/yaBo-logo.png'),
    short:'亚博',
    prefix:'yb'
  },
  {
    merchantId:100105,
    name:'优乐',
    logo: require('./images/youLe-logo.png'),
    short:'优乐',
    prefix:'ul'
  },
  {
    merchantId:100106,
    name:'澳门皇冠国际',
    logo: require('./images/huangGuan-logo.png'),
    short:'澳门皇冠',
    prefix:'hg'
  },
  {
    merchantId:100107,
    name:'齐发',
    logo: require('./images/qiFa-logo.png'),
    short:'齐发',
    prefix:'qf'
  },
  {
    merchantId:100108,
    name:'梦之城',
    logo: require('./images/mengZhiCheng-logo.png'),
    short:'梦之城',
    prefix:'mzc'
  },
  {
    merchantId:100109,
    name:'优发国际',
    logo: require('./images/youFa-logo.png'),
    short:'优发',
    prefix:'uf'
  },
  {
    merchantId:100110,
    name:'龙虎国际',
    logo: require('./images/longHu.png'),
    short:'龙虎',
    prefix:'loh'
  },
  {
    merchantId:100111,
    name:'龙都',
    logo: require('./images/longDu-logo.png'),
    short:'龙都',
    prefix:'ld'
  },
  {
    merchantId:100112,
    name:'尊宝国际',
    logo: require('./images/zunBao-logo.png'),
    short:'尊宝',
    prefix:'zb'
  },
]

/**
 * 获取商户基本信息
 * @param id
 * @returns {*}
 */
const getDeail = (id) => {
  return config.find((item) => {
    return item.merchantId === Number(id)
  })
}

export default {
  config,
  getDeail
}