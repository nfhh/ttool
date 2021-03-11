<template>
  <div class="container">
    <div class="login-form">
      <h3>
        <span>铁威马测试工具</span>
      </h3>
      <div class="input">
        <input type="text" placeholder="请输入帐号" v-model="name"/>
      </div>
      <div class="input">
        <input type="password" placeholder="请输入密码" v-model="password" @keydown.enter="handleLogin"/>
      </div>
      <div class="btn-box">
        <a href="javascript:;" class="btn" @click="handleLogin" :disabled="disabled">登录</a>
      </div>
      <div class="version">v1.1.0</div>
    </div>
    <Toast v-if="show" :message="toastMessage"/>
  </div>
</template>

<script>
import { ref, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/utils/request'
import Toast, { useToastEffect } from '../../components/Toast'
import { useStore } from 'vuex'
import { setLocalAccessToken } from '@/utils/local'

const useLoginEffect = (showToast) => {
  const router = useRouter()
  const store = useStore()
  const data = reactive({
    name: '',
    password: ''
  })
  const disabled = ref(false)
  const handleLogin = async () => {
    disabled.value = true
    try {
      const result = await post(`${window.APIURL}auth/login`, {
        name: data.name,
        password: data.password
      })
      if (result?.code === 0 && result?.data) {
        setLocalAccessToken(result.data.access_token)
        await store.dispatch('getUser')
        await router.push({ name: 'Dashboard' })
      } else {
        showToast('登陆失败')
      }
    } catch (e) {
      disabled.value = false
      showToast('请求失败')
    }
  }

  const {
    name,
    password
  } = toRefs(data)
  return {
    disabled,
    name,
    password,
    handleLogin
  }
}
export default {
  name: 'Index',
  components: { Toast },
  setup () {
    const {
      show,
      toastMessage,
      showToast
    } = useToastEffect()
    const {
      disabled,
      name,
      password,
      handleLogin
    } = useLoginEffect(showToast)
    return {
      disabled,
      name,
      password,
      show,
      toastMessage,
      handleLogin
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./../../assets/scss/mixin.scss";

.container {
  @include flex(center, center);
  height: 100vh;

  .login-form {
    box-sizing: border-box;
    padding-left: 31px;
    padding-right: 31px;
    width: 410px;
    height: 368px;
    background-color: #fff;
    border: 1px solid #ddd;
    margin: 0 auto;

    h3 {
      line-height: 23px;
      font-size: 24px;
      text-align: center;
      margin: 40px auto 49px;
    }

    .input {
      display: inline-block;
      width: 348px;
      height: 50px;
      border: 1px solid #e5e5e5;
      margin-bottom: 20px;

      input {
        width: 100%;
        height: 100%;
        border: none;
        padding: 18px;
      }
    }

    .version {
      padding-top: 14px;
      font-size: 14px;
      text-align: center;
    }

    .btn-box {
      .btn {
        width: 100%;
        line-height: 50px;
        margin-top: 10px;
        font-size: 16px;
        display: inline-block;
        text-align: center;
        background-color: #027EFC;
        color: #fff;
        border: none;
      }
    }

  }
}
</style>
