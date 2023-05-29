import request from '@/utils/request'

export default {
  getConnectionList(searchModel) {
    return request({
      url: '/connection/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        connectionUserName: searchModel.connectionUserName
      }
    })
  },
  getConnectionAll(){
    return request({
      url: '/connection/getConnectionAll',
      method: 'get',
    })
  },
  addConnection(connection) {
    return request({
      url: '/connection',
      method: 'post',
      data: connection
    })
  },
  updateConnection(connection) {
    return request({
      url: '/connection',
      method: 'put',
      data: connection
    })
  },
  saveConnection(connection) {
    if (connection.connectionId == null && connection.connectionId == undefined) {
      return this.addConnection(connection)
    }
    return this.updateConnection(connection)
  },
  getConnectionById(id) {
    return request({
      url: `/connection/${id}`,
      method: 'get'
    })
  },
  deleteConnectionById(id) {
    return request({
      url: `/connection/${id}`,
      method: 'delete'
    })
  }
}
