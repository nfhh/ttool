<template>
  <a href="javascript:;" @click="handleLogout">退出</a>
  <Toast v-if="show" :message="toastMessage"/>
</template>

<script>
import { useRouter } from 'vue-router'
import { post } from '@/utils/request'
import Toast, { useToastEffect } from '../../components/Toast'
import { useStore } from 'vuex'

const useLogoutEffect = (showToast) => {
  const router = useRouter()
  const store = useStore()

  const handleLogout = async () => {
    if (confirm('确定退出吗？') === false) {
      return
    }
    try {
      const result = await post(`${window.APIURL}auth/logout`)
      if (result?.code === 0) {
        store.commit('logout')
        router.push({ name: 'Index' })
      } else {
        showToast('退出失败')
      }
    } catch (e) {
      showToast('请求失败')
    }
  }

  return {
    handleLogout
  }
}
export default {
  name: 'Logout',
  components: { Toast },
  setup () {
    const {
      show,
      toastMessage,
      showToast
    } = useToastEffect()
    const {
      handleLogout
    } = useLogoutEffect(showToast)
    return {
      show,
      toastMessage,
      handleLogout
    }
  }
}
</script>

<style scoped>

</style>
