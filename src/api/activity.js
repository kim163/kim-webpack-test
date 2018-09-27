import { service } from "@/util"

let numversion = '/api/v1/';   // 版本信息

//获取活动信息配置
export const getAwardInfo = jsonData => service({
  url: numversion+`coupon/getAwardInfo`,
  method: 'post',
  data: jsonData
});
//获取公告
export const announcement = jsonData => service({
  url: numversion+`additionalFeatures/announcement`,
  method: 'post',
  data: jsonData
});
//获取我的优惠券详细信息
export const getFastTraderAward = jsonData => service({
  url: numversion+`coupon/getFastTraderAward`,
  method: 'post',
  data: jsonData
});
//获取优惠券排行
export const awardRankings = jsonData => service({
  url: numversion+`coupon/awardRankings`,
  method: 'post',
  data: jsonData
});
