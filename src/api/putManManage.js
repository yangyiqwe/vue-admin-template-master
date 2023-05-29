import request from '@/utils/request'

export default {
  getPutManList(){
    return request({
      url: '/putman/list',
      method: 'get'
    })
  }
}
