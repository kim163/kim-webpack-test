
import Vue from 'vue'

Vue.directive('numberOnly',{
  twoWay: true,
  bind: (el) => {
    el.handler = function() {
      el.value = el.value.replace(/\D+/, '')
    }
    el.addEventListener('input', el.handler)
  },
  unbind: (el) => {
    el.removeEventListener('input', el.handler)
  },
  update: (el,binding,vnode) => {
    if(el.value !== ''){
      el.value = el.value.replace(/[^0-9.]+/g, '');
    }
  }
})
