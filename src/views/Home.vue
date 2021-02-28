<template>
  <div class="home">
    <el-button type="success" plain @click="draggingStatusChange">切换功能</el-button>
    <go-upload v-if="isDragging" :action="action" :dragging="isDragging"/>
    <go-upload v-else :action="action" :dragging="isDragging">
      <el-button type="success">click to upload</el-button>
    </go-upload>
  </div>
</template>

<script>
import GoUpload from '@/components/GoUpload'
export default {
  name: 'Home',
  data () {
    return {
      action: 'https://afternoon-dawn-09444.herokuapp.com/upload',
      isDragging: false
    }
  },
  methods: {
    draggingStatusChange () {
      this.isDragging = !this.isDragging
    }
  },
  components: {
    GoUpload
  }
}
</script>
