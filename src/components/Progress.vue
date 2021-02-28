<template>
 <div class="progress">
   <div class="progress-inner" ref="inner"></div>
 </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  // watch 的温习 加上 $nextTick 的使用及原理
  watch: {
    // percent: function (val) {
    //   this.$refs.inner.style.width = `${val}%`
    //   console.log(val)
    // }
    percent: {
      handler (val) {
        this.$nextTick(() => {
          this.$refs.inner.style.width = `${val}%`
        })
        console.log(val)
      },
      immediate: true // 很关键，决定着进度条显示。不加的话会导致初始加载时进度条为满状态
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/assets/styles/vars.scss";
.progress {
  background-color: #fff;
  height: 10px;
  border-radius: 100px;
  .progress-inner {
    background-color: deeppink;
    height: 100%;
    border-radius: 100px;
    transition: width .2s linear;
  }
}
</style>
