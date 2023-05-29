import request from '@/utils/request'

export default {
  getYearList(){
    return request({
      url: '/year/list',
      method: 'get'
    })
  }
}
