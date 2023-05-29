import request from '@/utils/request'

export default {
  getYearbillList(searchModel) {
    return request({
      url: '/yearbill/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        yearbillName: searchModel.yearbillName,
        yearbillDate: searchModel.yearbillDate,
        yearbillSaa: searchModel.yearbillSaa
      }
    })
  }
}

