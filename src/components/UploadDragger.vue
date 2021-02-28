<template>
 <div class="go-upload-dragger"
 :class="{dragging}"
  @dragenter="onDragenter"
  @dragleave="onDragleave"
  @dragover="onDragover"
  @drop="onDrop"
  @click="onClick"
 >
 <!--
  @dragover="onDragover" -->
  <div><i class="el-icon-upload" style="font-size: 50px"></i></div>
  <span>Drop file here or click to upload</span>
 </div>
</template>

<script>
export default {
  name: 'UploadDragger',
  data () {
    return {
      dragging: false // 用来控制拖拽进出的效果显示（拖拽有效区域）
    }
  },
  methods: {
    onDragenter (e) {
      this.dragging = true
      e.stopPropagation()
      e.preventDefault()
    },
    onDragleave (e) {
      this.dragging = false
      e.stopPropagation()
      e.preventDefault()
    },
    onDragover (e) {
      e.stopPropagation()
      e.preventDefault()
    },
    onDrop (e) {
      this.dragging = false
      e.stopPropagation()
      e.preventDefault()
      const files = e.dataTransfer.files
      console.log(files)
      this.$emit('handleFiles', files)
    },
    onClick () {
      this.$emit('onClick')
    }
  }
}
</script>

<style lang='scss' scoped>
.go-upload-dragger {
  border: 1px dashed gray;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.dragging {
    border: 2px dashed deeppink;
    background-color: gray;
  }
}
</style>
