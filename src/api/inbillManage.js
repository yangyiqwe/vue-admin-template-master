import request from '@/utils/request'

export default {
  getInbillList(searchModel) {
    return request({
      url: '/inbill/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        inbillConnection: searchModel.inbillConnection,
        startTime: searchModel.startTime,
        endTime:searchModel.endTime,
        inbillArtice:searchModel.inbillArtice,
        inbillSpci:searchModel.inbillSpci
      }
    })
  },
  saveInbill(inbill) {
    if (inbill.inbillId == null && inbill.inbillId == undefined) {
      return this.addInbill(inbill)
    }
    return this.updateInbill(inbill)
  },
  addInbill(inbill){
    return request({
      url: '/inbill',
      method: 'post',
      data: inbill
    })
  },
  updateInbill(inbill){
    return request({
      url: '/inbill',
      method: 'put',
      data: inbill
    })
  },
  getInbillById(id){
    return request({
      url: `/inbill/${id}`,
      method: 'get'
    })
  },
  deleteInbillById(id) {
    return request({
      url: `/inbill/${id}`,
      method: 'delete'
    })
  }
}
