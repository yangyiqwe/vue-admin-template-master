import request from '@/utils/request'

export default {
  getOutbillList(searchModel) {
    return request({
      url: '/outbill/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        outbillConnection: searchModel.outbillConnection,
        startTime: searchModel.startTime,
        endTime:searchModel.endTime,
        outbillArtice:searchModel.outbillArtice,
        outbillSpci:searchModel.outbillSpci
      }
    })
  },
  saveOutbill(outbill) {
    console.log("outbill"+JSON.stringify(outbill))
    if (outbill.id == null && outbill.id == undefined) {
      return this.addOutbill(outbill)
    }
    return this.updateOutbill(outbill)
  },
  addOutbill(outbill){
    return request({
      url: '/outbill',
      method: 'post',
      data: outbill
    })
  },
  updateOutbill(outbill){
    return request({
      url: '/outbill',
      method: 'put',
      data: outbill
    })
  },
  getOutbillById(id){
    return request({
      url: `/outbill/${id}`,
      method: 'get'
    })
  },
  deleteOutbillById(id) {
    return request({
      url: `/outbill/${id}`,
      method: 'delete'
    })
  }
}
