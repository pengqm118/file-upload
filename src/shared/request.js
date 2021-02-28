// 封装请求
const processResponse = response => {
  if (typeof response === 'string') {
    try {
      return JSON.parse(response)
    } catch (e) {
      return response
    }
  }
  return response
}

/**
 *
 * @param {url} 上传地址
 * @param {name} 上传文件key值
 * @param {file} 上传文件对象
 * @param {data} 除文件外的其他参数
 * @param {onSuccess} 上传成功回调
 * @param {onError} 上传失败回调
 * @param {onProgress} 上传进度回调
 */
const request = ({
  url,
  name,
  file,
  data,
  onSuccess,
  onError,
  onProgress
}) => {
  const xhr = new XMLHttpRequest()
  const formData = new FormData()
  // 传入文件的 key value
  formData.append(name, file)
  // 传入文件外的 key value
  Object.entries(data).forEach((key, val) => { formData.append(key, val) })
  // 监听上传的 progress 事件，显示上传进度
  xhr.upload.addEventListener('progress', e => {
    e.percent = e.loaded / e.total * 100
    onProgress(e)
  })
  // open 必须在 'progress' 事件后
  // 发起请求
  xhr.open('POST', url)
  // 请求体数据
  xhr.send(formData)
  // 处理响应数据
  xhr.addEventListener('load', () => {
    // 数据请求成功,调用成功回调函数 onSuccess
    if (xhr.status >= 200 && xhr.status < 300) {
      const response = processResponse(xhr.response)
      onSuccess(response)
    } else {
      onError(new Error('upload request failed!'))
    }
  })

  // 发生错误时调用失败回调 onError
  xhr.addEventListener('err', e => {
    onError(e)
  })

  // 在 xhr 上定义一系列事件和属性
  // upload 属性上的 progress 函数
  // 请求成功事件 load 和 请求失败处理事件 err
  return xhr
}

export default request
