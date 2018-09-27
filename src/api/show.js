import { service } from "@/util"

let numversion = '/api/v1/';   // 版本信息
let numversionNew = '/api/v2/';   // 版本信息
// 账户

export const login = jsonData => service({
  url: numversion + `user/chain/login2`,
  method: 'post',
  data: jsonData,
  encryptDef:true,  //使用默认加密规则
});  // 登录：手机登录/邮箱登录

export const implicitLogin = jsonData => service({
  url: numversion + `user/chain/implicitLogin`,
  method: 'post',
  data: jsonData
});  // 隐式登录

export const loginByUserNameAndPwd = jsonData => service({
  url: numversion + `user/chain/loginByUserNameAndPwd`,
  method: 'post',
  data: jsonData
});  //登录：账号密码登录

export const register = jsonData => service({
  url: numversion + `user/chain/register`,
  method: 'post',
  data: jsonData
});  //注册用户


export const sendCode = jsonData => service({
  url: numversion + `mgs/send`,
  method: 'post',
  data: jsonData
});  //发送验证码-手机

export const sendEmailCode = jsonData => service({
  url: numversion + `email/send`,
  method: 'post',
  data: jsonData
});  //发送验证码-邮箱

export const getUserInfo = jsonData => service({
  url: numversion + `account/cash/getUserDetail`,
  method: 'post',
  data: jsonData
});  //获取用户信息

export const getBankInfo = jsonData => service({
  url: numversion + `account/cash/getBankList`,
  method: 'post',
  data: jsonData
});  //获取银行卡

export const getLive800Url = jsonData => service({
  url: numversion + `getLive800Url`,
  method: 'post',
  data: jsonData
});  //获取Live800

export const qrCode = jsonData => service({
  url: numversion + `user/chain/qrCode`,
  method: 'post',
  data: jsonData
});  // app扫码登录地址