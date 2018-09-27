<template>
  <div class="header">
    <div class="container">
      <div class="container-left">
        <div class="logo"></div>
        <div class="name">久安钱包</div>
      </div>
      <!--<div class="container-right">-->
        <!--<div class="nav">-->
          <!--<span class="cursor-pointer">登录</span>-->
          <!--<span class="line"></span>-->
          <!--<span class="cursor-pointer">注册</span>-->
          <!--<a class="language j-languageSel" href="javascript:void(0);" data-i18n-html="languageSel">ENGLISH</a>-->
        <!--</div>-->
        <!--<div class="mobile-nav">-->
          <!--<span class="button" :class="{'button-toggle': showMobileNav}" @click="showMobileNav = !showMobileNav"></span>-->
          <!--<div class="nav-list" v-show="showMobileNav">-->
            <!--<div class="nav-item cursor-pointer">登录</div>-->
            <!--<div class="nav-item cursor-pointer">注册</div>-->
            <!--<a class="nav-item language j-languageSel" href="javascript:void(0);" data-i18n-html="languageSel">ENGLISH</a>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        showMobileNav:false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    height: 100px;
    line-height: 100px;
    background-color: #5087ff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .container {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    .container-left {
      display: flex;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      transition: all .5s;
      .logo {
        width: 80px;
        height: 80px;
        background: url("~images/logo.png");
        background-size: contain;
      }
      .name {
        font-size: 24px;
        color: #ffffff;
        margin-left: 15px;
      }
    }
    .container-right {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
      color: #FFFFFF;
      .nav {
        display: block;
        .language {
          width: 114px;
          height: 45px;
          border-radius: 22px;
          border: solid 2px #ffffff;
          display: inline-block;
          vertical-align: middle;
          line-height: 45px;
          text-align: center;
          margin-left: 30px;
        }
      }
      .mobile-nav {
        display: none;
        position: relative;
      }
      .line {
        width: 2px;
        height: 25px;
        background-color: #c9daff;
        display: inline-block;
        vertical-align: middle;
        margin: 0 20px;
      }
      .nav-list {
        position: absolute;
        right: 5%;
        top: 75%;
        background: #ffffff;
        color: #333333;
        width: 100px;
        text-align: center;
        border: 1px solid #cccccc;
        border-radius: 5px;
        &:after{
          content: '';
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-bottom-color: #cccccc;
          position: absolute;
          top: -20px;
          right: 21px;
        }
        &:before{
          content: '';
          width: 0;
          height: 0;
          border: 9px solid transparent;
          border-bottom-color: #ffffff;
          position: absolute;
          top: -18px;
          right: 22px;
          z-index: 2;
        }
        .nav-item{
          width: 100%;
          height: 40px;
          line-height: 40px;
          font-size: 18px;
          display: block;
          &:hover{
            background: #f1f1f1;
          }
        }
      }
      .button {
        font-weight: 400;
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: transparent;
        border: none;
        cursor: pointer;
        border-radius: 100%;
        transition: 0.6s;
        position: relative;
        margin-right: 20px;
        &.button-toggle {
          &:after {
            transform: translateY(0px) rotate(-45deg) scale(1) translateX(-14%);
          }
          &:before {
            transform: translateY(0px) rotate(45deg) scale(1);
          }
        }
        &:after, &:before {
          position: absolute;
          content: '';
          top: 20%;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #ffffff;
          border-radius: 5px;
          transition: 0.5s;
          display: block;
          transform-origin: 0% 0%;
        }
        &:after {
          top: 80%;
        }
      }
    }
    .cursor-pointer {
      cursor: pointer;
    }
  }

  @media only screen and (max-width: 999px) {
    .container {
      width: 100%;
    }
    .container-left {
      width: 80%;
      margin-left: 10%;
      justify-content: center;
    }
    .nav {
      display: none !important;
    }
    .mobile-nav {
      display: block !important;
    }
  }
</style>