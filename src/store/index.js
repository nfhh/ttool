import { createStore } from 'vuex'
import {
  getLocalUserInfo,
  setLocalUserInfo,
  removeLocalUserInfo, removeLocalAccessToken
} from '@/utils/local'
import { post } from '@/utils/request'

export default createStore({
  state: {
    userInfo: getLocalUserInfo()
  },
  mutations: {
    setUserInfo (state, payload) {
      state.userInfo = payload
      setLocalUserInfo(payload)
    },
    logout (state) {
      state.userInfo = null
      removeLocalUserInfo()
      removeLocalAccessToken()
    }
  },
  actions: {
    async getUser (store) {
      const result = await post(`${window.APIURL}auth/me`)
      store.commit('setUserInfo', result.data)
    }
  },
  modules: {}
})
