import request from '@/utils/request'

export default {

  getMoneyflowList(searchModel) {
    return request({
      url: '/moneyflow/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize
        //username: searchModel.username,
        //phone: searchModel.phone
      }
    });
  },
  addMoneyflow(moneyflow) {
    return request({
      url: '/moneyflow',
      method: 'post',
      data: moneyflow
    });
  },
  updateMoneyflow(moneyflow) {
    return request({
      url: '/moneyflow',
      method: 'put',
      data: moneyflow
    })
  },
  saveMoneyflow(moneyflow) {
    if (moneyflow.moneyflowId == null && moneyflow.moneyflowId == undefined) {
      return this.addMoneyflow(moneyflow);
    }
    return this.updateMoneyflow(moneyflow);
  },
  deleteMoneyflowById(id) {
    return request({
      url: `/moneyflow/${id}`,
      method: 'delete'
    });
  },
  getMoneyflowById(id) {
    return request({
      url: `/moneyflow/${id}`,
      method: 'get'
    })
  },
  exportMoflow() {
    return request({
      url: '/moneyflow/exportMoneyflow',
      method: 'get',
      responseType: 'blob'
    })
  }
}
