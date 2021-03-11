<template>
  <Header :user="currentUser"></Header>
  <table>
    <colgroup>
      <col width="40%"/>
      <col width="30%"/>
      <col width="30%"/>
    </colgroup>
    <thead>
    <input type="file" ref="avatarInput"
           accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
           @change="fileChange">
    <tr>
      <th>项目</th>
      <th>测试结果</th>
      <th>判定</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>SN</td>
      <td><input
        class="sn__input"
        placeholder="请输入SN"
        v-model="sn.res"
      /></td>
      <td>{{ sn.is_ok }}</td>
    </tr>
    <tr>
      <td>型号</td>
      <td>{{ model.res }}</td>
      <td>{{ model.is_ok }}</td>
    </tr>
    <tr>
      <td>内核版本</td>
      <td>{{ kernel_version.res }}</td>
      <td>{{ kernel_version.is_ok }}</td>
    </tr>
    <tr>
      <td>BIOS 版本</td>
      <td>{{ bios_version.res }}</td>
      <td>{{ bios_version.is_ok }}</td>
    </tr>
    <tr>
      <td>CPU 型号</td>
      <td>{{ cpu.res }}</td>
      <td>{{ cpu.is_ok }}</td>
    </tr>
    <tr>
      <td>CPU 温度</td>
      <td>{{ cpu_temp.res }}</td>
      <td>{{ cpu_temp.is_ok }}</td>
    </tr>
    <tr>
      <td>CPU 使用率</td>
      <td>{{ cpu_used.res }}</td>
      <td>{{ cpu_used.is_ok }}</td>
    </tr>
    <tr>
      <td>内存容量</td>
      <td>{{ ram.res }}</td>
      <td>{{ ram.is_ok }}</td>
    </tr>
    <tr>
      <td>设备温度</td>
      <td>{{ nas_temp.res }}</td>
      <td>{{ nas_temp.is_ok }}</td>
    </tr>
    <tr>
      <td>风扇转速</td>
      <td>{{ fan_speed.res }}</td>
      <td>{{ fan_speed.is_ok }}</td>
    </tr>
    <tr>
      <td>MAC 地址</td>
      <td colspan="2" class="wrapper">
        <div class="wrapper__cell" v-for="(item,index) in mac" :key="index">
          <div>{{ item.res }}</div>
          <div>{{ item.is_ok }}</div>
        </div>
      </td>
    </tr>
    <tr>
      <td>外置 USB</td>
      <td class="wrapper">
        <div class="wrapper__cell" v-for="(item,index) in u_disk.res" :key="index">
          <div>{{ item }}</div>
        </div>
      </td>
      <td>{{ u_disk.is_ok }}</td>
    </tr>
    <tr>
      <td>网口</td>
      <td class="wrapper">
        <div class="wrapper__cell" v-for="(item,index) in net.res" :key="index">
          <div>{{ item }}</div>
        </div>
      </td>
      <td>{{ net.is_ok }}</td>
    </tr>
    <tr>
      <td>硬盘</td>
      <td class="wrapper">
        <div class="wrapper__cell" v-for="(item,index) in disk.res" :key="index">
          <div>{{ item }}</div>
        </div>
      </td>
      <td>{{ disk.is_ok }}</td>
    </tr>
    <tr>
      <td colspan="2">结果</td>
      <td>{{ finished }}</td>
    </tr>
    </tbody>
  </table>
  <Toast v-if="show" :message="toastMessage"/>
</template>

<script>
import { reactive, toRefs, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { get, post } from '@/utils/request'
import Header from './Header'
import Toast, { useToastEffect } from '../../components/Toast'

const loading = '读取中……'
const loading2 = '等待中……'
const loading3 = '测试中……'
const loading4 = '待输入……'

const useUploadEffect = (showToast) => {
  const fileChange = async () => {

  }
  return {
    fileChange
  }
}

const useReadEffect = (showToast) => {
  const finished = ref(loading2)
  const readData = reactive({
    sn: {
      res: '',
      is_ok: loading4
    },
    nas_temp: {
      res: loading,
      is_ok: loading
    },
    cpu_temp: {
      res: loading,
      is_ok: loading
    },
    fan_speed: {
      res: loading,
      is_ok: loading
    },
    cpu_used: {
      res: loading,
      is_ok: loading
    },
    model: {
      res: loading,
      is_ok: loading
    },
    kernel_version: {
      res: loading,
      is_ok: loading
    },
    bios_version: {
      res: loading,
      is_ok: loading
    },
    cpu: {
      res: loading,
      is_ok: loading
    },
    mac: [{
      res: loading,
      is_ok: loading
    }],
    ram: {
      res: loading,
      is_ok: loading
    },
    disk: {
      res: [loading],
      is_ok: loading2
    },
    net: {
      res: [loading],
      is_ok: loading2
    },
    u_disk: {
      res: [loading],
      is_ok: loading
    }
  })

  const getReadInfo = async () => {
    const result = await get('test2.php?do=init')
    if (result?.code === 0 && result?.data) {
      const data = result.data
      readData.model = data.model
      readData.kernel_version = data.kernel_version
      readData.bios_version = data.bios_version
      readData.cpu = data.cpu
      readData.cpu_temp = data.cpu_temp
      readData.cpu_used = data.cpu_used
      readData.ram = data.ram
      readData.nas_temp = data.nas_temp
      readData.fan_speed = data.fan_speed
      readData.mac = data.mac
      readData.net = data.net
      readData.u_disk = data.u_disk
      readData.disk = data.disk
      await getTestOne()
    }
  }

  const stop = watch(() => readData.sn.res, (c) => {
    if (c.length === 6) {
      readData.sn.is_ok = 'PASS'
      getReadInfo()
      stop()
    }
  })

  const getTestOne = async () => {
    readData.net.is_ok = loading3
    const result = await get('test2.php?do=test_net')
    if (result?.code === 0 && result?.data) {
      readData.net.is_ok = result.data.res
      await getTestTwo()
    }
  }

  const getTestTwo = async () => {
    readData.disk.is_ok = loading3
    const result = await get('test2.php?do=test_disk')
    if (result?.code === 0 && result?.data) {
      readData.disk.is_ok = result.data.res
      const tmp = JSON.stringify(readData)
      finished.value = tmp.includes('PASS') ? 'PASS' : 'NG'
      await handleSave()
    }
  }

  const handleSave = async () => {
    try {
      const result = await post(`${window.APIURL}test/store`, {
        sn: readData.sn.res,
        result: readData,
        finished: finished.value ? 'PASS' : 'NG'
      })
      if (result?.code === 0) {
        showToast('保存成功')
      } else {
        showToast('保存失败')
      }
    } catch (e) {
      showToast('保存失败')
    }
  }

  return {
    readData,
    finished
  }
}

export default {
  name: 'Dashboard',
  components: {
    Header,
    Toast
  },
  setup () {
    const store = useStore()
    const currentUser = computed(() => store.state.userInfo.user)
    const {
      show,
      toastMessage,
      showToast
    } = useToastEffect()
    const {
      readData,
      finished
    } = useReadEffect(showToast)
    const {
      fileChange
    } = useUploadEffect(showToast)
    return {
      fileChange,
      show,
      toastMessage,
      currentUser,
      ...toRefs(readData),
      finished
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  width: 100%;

  thead {
    background: #f3f3f3;
  }

  td, th {
    border: solid 1px #ddd;
    padding: 10px;
  }

  .sn__input {
    width: 100%;
    padding: 6px 4px;
    font-size: 16px;
    border: 1px solid #ddd;
  }

  .wrapper {
    padding: 0;

    &__cell {
      display: flex;

      & div {
        flex: 1;
        padding: 10px;
        border-left: solid 1px #ddd;
        border-bottom: solid 1px #ddd;
      }

      & div:first-child {
        border-left: none;
      }

      &:last-child div {
        border-bottom: none;
      }
    }
  }
}
</style>
