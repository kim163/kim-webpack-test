import Vue from 'vue'
import VueI18n from 'vue-i18n' //引入i8n插件
import enLocale from './en'  //英文包
import zhLocale from './zh' //中文包
import {$localStorage,$sessionStorage} from '@/util/storage'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  }
}

function get_language() {    // 获取语言
  let language ;
  if(!$localStorage.get('language-sel')){
   /* if (navigator.language) {
      language = navigator.language;
    }else {
      language = navigator.browserLanguage;
    }*/

    language = "zh";

    if(language.indexOf("zh") != -1){
      language = "zh";
    }else if(language.indexOf("en") != -1){
      language = "en";
    }
    $localStorage.set('language-sel', language);
  }else{
    language = $localStorage.get('language-sel');
  }

  return language;
}

const i18n = new VueI18n({
  locale: get_language(), // 判断语言习惯设置
  messages // 挂载语言包
})

export default i18n
