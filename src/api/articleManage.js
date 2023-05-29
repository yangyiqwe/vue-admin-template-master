import request from '@/utils/request'

export default {
  getArticleAll(){
    return request({
      url: '/article/list',
      method: 'get'
    })
  }
}
