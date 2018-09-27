/**
 * Created by Anne on 2018/08/07.
 * Display page router
 */

const promIndex = () => import('views/show/promotion');  // 推广首页
const promHelp = () => import('views/show/promotion/help');  // 推广帮助中心
const promContactUs = () => import('views/show/promotion/contact-us');  // 推广联系我们
const activityIndex = () => import('views/show/coin-prom');   // 优惠活动

export default [
  {
    path: "/",
    name: "aindex",
    redirect:"/index"
  },
  {
    path: "/index",
    name: "index",
    component: promIndex,
    props:{
      isOfficialWeb:true
    },
    meta:{
      noLogin: true
    }
  },
  {
    path: "/helpCenter",
    name: "helpCenter",
    component: promHelp,
    props:{
      isOfficialWeb:true
    },
    meta:{
      noLogin: true
    }
  },
  {
    path: "/contactUs",
    name: "contactUs",
    component: promContactUs,
    props:{
      isOfficialWeb:true
    },
    meta:{
      noLogin: true
    }
  },
  {
    path: "/prom",
    name: "promIndex",
    component: promIndex,
    meta:{
      noLogin: true
    }
  },
  {
    path: "/promHelp",
    name: "promHelp",
    component: promHelp,
    meta:{
      noLogin: true
    }
  },
  {
    path: "/promContact",
    name: "promContact",
    component: promContactUs,
    meta:{
      noLogin: true
    }
  },
  {
    path: "/newActivity",
    name: "activityIndex",
    component: activityIndex,
    props:{
      isOfficialWeb:true
    },
    meta:{
      noLogin: true
    }
  }
]
