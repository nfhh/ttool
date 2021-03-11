<template>
  <div class="header">
    <div class="header__left">
      <h1>铁威马测试工具</h1>
    </div>
    <div class="header__right">
      <div>{{ user.name }}
        <Logout/>
      </div>
    </div>
  </div>
</template>

<script>
import Logout from './Logout'

export default {
  name: 'Header',
  props: {
    user: {}
  },
  components: { Logout }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  padding: 10px 0;

  &__left {
    width: 200px;
  }

  &__right {
    flex: 1;
    text-align: right;
    margin: auto;
    font-size: 16px;
    padding-right: 15px;
  }
}
</style>
