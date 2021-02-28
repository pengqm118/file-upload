<template>
 <div class="go-upload-list">
   <div :class="['go-upload-list-item', files.status]" v-for="file in files" :key="file.uid">
      <div class="go-upload-list-item-img">
        <div v-if="file.status === 'pending'" class="go-upload-item-img-loading" ></div>
        <template v-else-if="file.status === 'success'">
          <img v-if="isImage(file.type)" class="go-upload-list-item-img" :src="file.url" alt="">
          <div v-else class="go-upload-item-file" ></div>
        </template>
        <div v-else class="go-upload-item-img-error" ></div>
      </div>
      <!-- 文件名字 -->
      <div class="go-upload-list-item-name">
        <span>{{ file.name }}</span>
        <my-progress v-if="file.status === 'pending'" :percent="file.percent"></my-progress>
      </div>
      <!-- 删除按钮 -->
      <span class="go-upload-list-item-delete" @click="onDelete(file)">
        <i class="el-icon-delete"></i>
      </span>
   </div>

 </div>
</template>

<script>
import MyProgress from './Progress'
export default {
  name: 'UploadList',
  props: {
    files: {
      type: Array
    }
  },
  data () {
    return {

    }
  },
  methods: {
    isImage (type) {
      if (!type) { return }
      return type.includes('image')
    },
    onDelete (file) {
      this.$emit('onDelete', file)
    }
  },
  components: {
    MyProgress
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/styles/mixins.scss';
@import '~@/assets/styles/vars.scss';
.go-upload-list {
  .go-upload-list-item {
    margin-top: 8px;
    padding: 8px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
  }
  .go-upload-list-item.success {
    .go-upload-list-item-name {
      color: $primary;
    }
  }
  .go-upload-list-item.failure {
    color: $danger;
    border: 1px solid $danger;
  }
  .go-upload-list-item-name {
    margin-left: 8px;
    flex: 1;
    @include ellipsis;
  }
  .go-upload-list-item-delete {
    cursor: pointer;
  }
  .go-upload-list-item-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
  .go-upload-item-img-loading {
    font-size: 20px;
    @include spinner;
  }
  .go-upload-item-error,
  .go-upload-item-file {
    font-size: 38px;
  }
}
</style>
