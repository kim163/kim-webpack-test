<template>
  <div class="main">
    <span>{{tip}}</span>
    <input type="range" class="range" :min="min" :max="max" :step="step" v-model="val">
  </div>
</template>

<script>
  export default {
    name: "range",
    data(){
      return{
        val:0
      }
    },
    watch:{
      val(newVal){
        this.$emit('change',Number(newVal))
      },
      reset(val){
        if(val){
          this.val = 0
        }
      }
    },
    model:{
      prop:'rangeVal',
      event:'change'
    },
    props:{
      min:{
        type:Number,
        default:1
      },
      max:{
        type:Number,
        default:100
      },
      step:{
        type:Number,
        default:10
      },
      rangeVal:{
        type:[String,Number],
        default:'0'
      },
      tip:{
        type:String,
        default:''
      },
      reset:{
        type:Boolean,
        default:false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mobile";
  .main{
    width: 100%;
    display: flex;
    .range{
      flex-grow: 1;
    }
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track{
    background-image: linear-gradient(-90deg, #4634A9 0%, #F63669 100%);
    height: r(2);
  }
  input[type='range']::-moz-range-track{
    background-image: linear-gradient(-90deg, #4634A9 0%, #F63669 100%);
    height: r(2);
  }
  input[type="range"]::-ms-track{
    color:transparent;
    background-image: linear-gradient(-90deg, #4634A9 0%, #F63669 100%);
    height: r(2);
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: #F4376D;
    border: r(3) solid #FFFFFF;
    box-shadow: 0 r(2) r(6) 0 rgba(0,0,0,0.30);
    border-radius: r(15);
    cursor: pointer;
    width: r(15);
    height: r(15);
    transform: translateY(-50%);
  }
  input[type='range']::-moz-range-thumb {
    background: #F4376D;
    border: r(3) solid #FFFFFF;
    box-shadow: 0 r(2) r(6) 0 rgba(0,0,0,0.30);
    border-radius: r(15);
    cursor: pointer;
    width: r(15);
    height: r(15);
  }
  input[type='range']::-ms-thumb {
    background: #F4376D;
    border: r(3) solid #FFFFFF;
    box-shadow: 0 r(2) r(6) 0 rgba(0,0,0,0.30);
    border-radius: r(15);
    cursor: pointer;
    width: r(15);
    height: r(15);
  }
</style>
