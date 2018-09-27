export default {
  name:/^[\u4e00-\u9fa5,\·]+$/,//中文姓名
  nickName:"",//昵称？
  phone:/^1\d{10}/,//手机号码
  php_phone:/^[0|9]\d{10}/, //+63手机号
  account: /^[a-zA-Z0-9]{6,10}$/,//用户帐号
  agent_account:/^a_[\da-zA-Z]{3,15}$/,//代理帐号
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,//密码
  pay_password:/^\d{6}$/,//支付密码
  email:/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,//邮箱
  qq:/\d{4,13}/,//qq
  wechat:/^[a-zA-Z][\w\-]{5-19}/,//微信
  bank:/^(\d{16}|\d{18}|\d{19})$/,//银行卡号
  intNum:/^[0-9]*[1-9][0-9]*$/        //非零正整数
}
