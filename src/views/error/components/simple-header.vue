<template>
  <div class="simple-navbar">
    <div class="container">
      <div class="row cfx">
        <div class="logo fl">
          <a class="nav-logo-link" href="/static/index.html"></a>
        </div>
        <div class="link-part fr">
          <div class="col-2">
             <get-live800></get-live800>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import getLive800 from 'components/get-live800'

  export default {
    data() {
      return {};
    },
    props: {},
    methods: {},
    computed: {},
    created() {
    },
    components: {
      getLive800
    }
  };
</script>
<style lang="scss">
  .simple-navbar{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 19px 0;
    background: transparent;
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;

    .nav-logo-link{
      width: 80px;
      height: 80px;
      background: url("~images/logo.png") no-repeat center center;
      background-size: contain;
      display: block;
    }
    .col-2{
      margin: 15px 0 0;
      width: auto;
    }
    .live-800{
      font-size: 20px;
      color: #ffffff;
      display: block;
      i.iconfont{
        font-size: 35px;
        color: #B8CDF8;
        margin-right: 11px;
      }
    }

  }

</style>
