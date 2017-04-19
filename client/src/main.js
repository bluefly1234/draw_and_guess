import Vue from 'vue'
import App from '~/App'
import VueRouter from 'vue-router'
import routes from '~/routes'
import store from '~/store'
import WebSocketClient from './WebSocketClient'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '~/assets/less/golbal.less'
import '~/assets/less/components.less'

// 使用Router插件
Vue.use(VueRouter)
// 使用MintUI的message提示信息
Vue.use(MintUI)

const router = new VueRouter({ routes })

Vue.prototype.isIPhone = () => {
  return window.navigator.userAgent.indexOf('iPhone') > -1
}

Vue.prototype.loading = text => {
  Vue.prototype._currentLoading = MintUI.Indicator.open({
    text, spinnerType: 'snake'
  })
}
Vue.prototype.loaded = _ => {
  Vue.nextTick(_ => MintUI.Indicator.close())
}

Vue.prototype.$messageBox = MintUI.MessageBox

Vue.prototype.$message = (message, time = message.length / 4 * 1000) => {
  return MintUI.Toast({
    message: message,
    position: 'bottom',
    duration: time
  })
}

router.beforeEach((to, from, next) => {
  if (!Vue.prototype.$webSocket) {
    const webSocket = WebSocketClient.init({
      path: 'ws://172.20.10.7:9001/ws/',
      open () {
        let user = store.getters.user
        webSocket.request(user, 'login').then((user) => {
          store.dispatch('login', user)
          if (user.inGame) {
            router.replace({name: 'begin', params: {id: user.currentRoomId}})
          }
        }).then(() => {
          webSocket.send({
            name: 'j5team' + '的房间',
            playNumber: 6,
            type: '1',
            playTimes: 1
          }, 'createRoom')
          next()
        })
      }
    })
    Vue.prototype.$webSocket = webSocket
  } else {
    next()
  }
})

router.afterEach(() => {
  Vue.prototype.loaded()
})

// 全局混合，为每个Vue实例的自定义对象处理逻辑
Vue.mixin({
  created () {
    const events = this.socketEvents
    if (events) {
      Object.keys(events).forEach(k => {
        this.$webSocket.on(k, events[k].bind(this))
      })
    }
  },
  beforeDestory () {
    const events = this.socketEvents
    if (events) {
      Object.keys(events).forEach(k => {
        this.$webSocket.off(k, events[k].bind(this))
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

document.addEventListener('touchmove', e => {
  e.preventDefault()
}, { passive: false })
