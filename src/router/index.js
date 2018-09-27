import Vue from 'vue';
import VueRouter from 'vue-router';
import maps from './map';
// import filters from './hook/beforEach';

Vue.use(VueRouter);

let error404 = () => import('views/error/404');
let error403 = () => import('views/error/403');
let error500 = () => import('views/error/500');

const router = new VueRouter({
  mode: 'history', //路由的 history 模式
  base: "/",
  'linkActiveClass': 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (!from.meta.noCache) {
        console.log('scrollTop:', document.body.scrollTop);
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  },

  routes: maps.concat([
    {
      path: "/404",
      component: error404
    },
    {
      path: "/403",
      component: error403
    },
    {
      path: "/500",
      component: error500
    },
    {
      path: "*",
      component: error404
    }
  ])
});
// router.beforeEach(filters);


export default router;
