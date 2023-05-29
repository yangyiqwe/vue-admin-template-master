import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import Layout from '@/layout'
import de from 'element-ui/src/locale/lang/de'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) { // token存在
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          // // 路由转换
          let myRoutes = myFilterAsyncRoutes(store.getters.menuList)
          // 404
          myRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })
          // 动态添加路由
          router.addRoutes(myRoutes)

          // 存至全局变量
          global.myRoutes = myRoutes
          if (myRoutes.length === 0 || myRoutes.length === null) {
            next({ ...to, replace: true })// 防止刷新后页面空白
          } else {
            next()
          }
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else { // token不存在
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function myFilterAsyncRoutes(menuList) {
  menuList.filter(menu => {
    if (menu.component === 'Layout') {
      menu.component = Layout
    } else {
      menu.component = require(`@/views/${menu.component}.vue`).default
    }
    // 递归处理子菜单
    if (menu.children && menu.children.length) {
      menu.children = myFilterAsyncRoutes(menu.children)
    }
    return true
  })
  return menuList
}

