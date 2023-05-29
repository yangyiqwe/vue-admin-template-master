import request from '@/utils/request'

export default {
  getStyleList(){
    return request({
      url: '/style/list',
      method: 'get'
    })
  }
}
