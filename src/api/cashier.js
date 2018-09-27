import { service } from "@/util"

let numversion = '/api/v1/';   // 版本信息
// 收银台

//收银台初始化
export const cashierInit = jsonData => service({
  url: numversion+`payment/cashier/init`,
  method: 'post',
  data: jsonData
});

//支付提交
export const paymentPay = jsonData => service({
  url: numversion+`payment/pay`,
  method: 'post',
  data: jsonData
});

//商户绑定用户，默认登录
export const bindMerchantLoginRelation = jsonData => service({
  url: numversion+`user/chain/bindMerchantLoginRelation`,
  method: 'post',
  data: jsonData
});

//商户是否已经绑定
export const isSyncUser = jsonData => service({
  url: numversion+`user/chain/isSyncUser`,
  method: 'post',
  data: jsonData
});

//查看商户列表
export const userMerchantList = jsonData => service({
  url: numversion+`user/chain/userMerchantList`,
  method: 'post',
  data: jsonData
});

//删除商户列表
export const removeUserMerchant = jsonData => service({
  url: numversion+`user/chain/removeUserMerchant`,
  method: 'post',
  data: jsonData
});

//快速创建久安账号
export const syncUserAndBindRelation = jsonData => service({
  url: numversion+`user/chain/syncUserAndBindRelation`,
  method: 'post',
  data: jsonData
});

//快速创建--修改密码
export const updatePassword = jsonData => service({
  url: numversion+`user/chain/updatePassword`,
  method: 'post',
  data: jsonData
});

//快速创建--绑定邮箱
export const bindEmail = jsonData => service({
  url: numversion+`account/cash/bindEmail`,
  method: 'post',
  data: jsonData
});

//快速创建--绑定手机号码
export const bindPhone = jsonData => service({
  url: numversion+`account/cash/bindPhone`,
  method: 'post',
  data: jsonData
});

//判断用户名是否已经存在
export const checkExistUser = jsonData => service({
  url: numversion+`user/chain/checkExistUser`,
  method: 'post',
  data: jsonData
});

// 查询订单状态
export const getOrderStatus = jsonData => service({
  url: numversion+`payment/getOrderStatus`,
  method: 'post',
  data: jsonData,
  loading:false
});

//获取收银台websocket地址
export const getSharedConfigList = jsonData => service({
  url: numversion+`common/getSharedConfigList`,
  method: 'post',
  data: jsonData
});