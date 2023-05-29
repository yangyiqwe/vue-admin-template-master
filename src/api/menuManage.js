import request from '@/utils/request'

export default {
  getAllMenu() {
    return request({
      url: '/menu',
      method: 'get'
    })
  },
  menuByHost() {
    return request({
      url: '/menu/getMenuByHost',
      method: 'get'
    })
  },
  saveMenu(menu) {
    if (menu.menuId == null && menu.menuId == undefined) {
      return this.addMenu(menu)
    }
    return this.updateMenu(menu)
  },
  addMenu(menu) {
    return request({
      url: '/menu',
      method: 'post',
      data: menu
    })
  },
  updateMenu(menu) {
    return request({
      url: '/menu',
      method: 'put',
      data: menu
    })
  }
}
