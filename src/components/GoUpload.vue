<template>
 <div class="go-upload">
   <input
   class="go-upload-input"
   type="file"
   ref="input"
   @change="onInputChange"
   >
   <upload-dragger v-if="dragging" @handleFiles="handleFiles" @onClick="onClickTrigger"/>
   <div v-else class="go-up-trigger" @click="onClickTrigger">
     <slot> </slot>
   </div>
   <upload-list :files="files" @onDelete="onDelete"></upload-list>
 </div>
</template>

<script>
import { noop } from '@/shared/util'
import request from '@/shared/request'

import UploadList from '@/components/UploadList'
import UploadDragger from '@/components/UploadDragger'

export default {
  name: 'GoUpload',
  components: {
    UploadList,
    UploadDragger
  },
  props: {
    name: {
      type: String,
      default: 'file'
    },
    action: { // url
      type: String,
      required: true
    },
    dragging: { type: Boolean, default: true },
    onExceed: { type: Function, default: noop },
    onChange: { type: Function, default: noop },
    onError: { type: Function, default: noop },
    onProgress: { type: Function, default: noop },
    customHttpRequest: { type: Function, default: request },
    beforeUpload: { type: Function },
    data: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      files: [],
      tempIndex: 0, // 用于文件标记
      reqs: {}
    }
  },
  methods: {
    // 点击插槽内的组件，然后借助冒泡传到 go-up-trigger 来间接触发 input 按钮
    onClickTrigger () {
      this.$refs.input.click()
    },
    // 拖拽上传直接触发上传函数
    handleFiles (files) {
      this.uploadFiles(files)
    },
    // 开始上传
    onInputChange (e) {
      // e.target.files 是伪数组
      const rawFiles = Array.from(e.target.files)
      this.uploadFiles(rawFiles)
      // console.log(rawFiles)
    },
    uploadFiles (rawFiles) {
      // 计算文件数量
      const filesLen = rawFiles.length + this.files.length
      // 对上传文件数量限制,一旦上传文件数量超出限制就调用传入的(props) onExceed 函数
      if (this.limit && filesLen > this.limit) {
        return this.onExceed(rawFiles, this.files)
      }
      // 开始上传文件
      this.startUpload(rawFiles)
    },
    startUpload (rawFiles) {
      // 对将要上传的文件格式化 normalizeFiles
      rawFiles.forEach(rawFile => {
        const file = this.normalizeFiles(rawFile)
        if (!this.beforeUpload || this.beforeUpload()) {
          this.upload(file)
        }
        // console.log(file)
      })
    },
    // 格式化文件
    normalizeFiles (rawFile) {
      const file = {
        name: rawFile.name,
        size: rawFile.size,
        type: rawFile.type,
        percent: 0,
        uid: Date.now() + this.tempIndex++, // 这种标记文件的方式不太可取，后面需要改进
        status: 'init', // 上传状态: init pending success failure
        raw: rawFile
      }
      // 将格式化后的文件存入 files 内
      this.files.push(file)

      return file
    },
    // 上传文件 file => 格式化后的文件
    // 收集所有上传需要的参数，将文件状态改为 pending 进行后续操作
    upload (file) {
      const options = {
        url: this.action,
        name: this.name,
        file: file.raw,
        data: this.data,
        onSuccess: this.handleSuccess.bind(this, file), // 厉害啊!!!!!!!!!!!!!!
        onError: this.handleError.bind(this, file),
        onProgress: this.handleProgress.bind(this, file)
      }
      file.status = 'pending'
      this.onChange(file, this.files)
      const req = this.customHttpRequest(options)
      this.reqs[file.uid] = req
      if (req instanceof Promise) { // 感觉有点借鉴 axios 源码的意思!!!!!!!!!!!!!!!!
        req.then(options.onSuccess, options.onError)
      }
    },
    // 将文件状态修改为 success 并添加 response 和 url 属性分别作为响应和预览地址
    handleSuccess (file, response) {
      // 删除 reqs 中对应的 xhr
      delete this.reqs[file.uid]
      file.status = 'success'
      this.$set(file, 'response', response)
      this.$set(file, 'url', response.data.path)
    },
    handleError (file, error) {
      delete this.reqs[file.uid]
      file.status = 'failure'
      this.onError(error, file, this.files)
    },
    handleProgress (file, event) {
      file.percent = event.percent
      this.onChange(file, this.files)
      this.onProgress(event, file, this.files)
    },
    // 文件删除
    onDelete (file) {
      const index = this.files.indexOf(file)
      this.files.splice(index, 1)
      const { uid } = file
      if (this.reqs[uid]) {
        // 删除上传内容
        this.reqs[uid].abort()
        // 删除请求盒子内对应的请求 xhr
        delete this.reqs[uid]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.go-upload {
  .go-upload-input {
    display: none;
    width: 100%;
  }
}
</style>
