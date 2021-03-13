<template>
  <Header :user="currentUser"></Header>
  <table>
    <caption><input type="file" ref="avatarInput"
                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    @change="fileChange">
    </caption>
    <colgroup>
      <col width="40%"/>
      <col width="20%"/>
      <col width="20%"/>
      <col width="20%"/>
    </colgroup>
    <thead>
    <tr>
      <th>项目</th>
      <th>标准</th>
      <th>测试结果</th>
      <th>判定</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>SN</td>
      <td>{{ item['SN'] || loading5 }}</td>
      <td><input
        type="search"
        class="sn__input"
        placeholder="请输入SN"
        v-model="sn.res"
        maxlength="6"
      /></td>
      <td><span :class="sn.is_ok">{{ sn.is_ok }}</span></td>
    </tr>
    <tr>
      <td>型号</td>
      <td>{{ item['型号'] || loading5 }}</td>
      <td>{{ model.res }}</td>
      <td><span :class="model.is_ok">{{ model.is_ok }}</span></td>
    </tr>
    <tr>
      <td>内核版本</td>
      <td>{{ item['内核版本'] || loading5 }}</td>
      <td>{{ kernel_version.res }}</td>
      <td><span :class="kernel_version.is_ok">{{ kernel_version.is_ok }}</span></td>
    </tr>
    <tr>
      <td>BIOS版本</td>
      <td>{{ item['BIOS版本'] || loading5 }}</td>
      <td>{{ bios_version.res }}</td>
      <td><span :class="bios_version.is_ok">{{ bios_version.is_ok }}</span></td>
    </tr>
    <tr>
      <td>CPU型号</td>
      <td>{{ item['CPU型号'] || loading5 }}</td>
      <td>{{ cpu.res }}</td>
      <td><span :class="cpu.is_ok">{{ cpu.is_ok }}</span></td>
    </tr>
    <tr>
      <td>CPU温度</td>
      <td>{{ item['CPU温度'] || loading5 }}</td>
      <td>{{ cpu_temp.res }}</td>
      <td><span :class="cpu_temp.is_ok">{{ cpu_temp.is_ok }}</span></td>
    </tr>
    <tr>
      <td>CPU使用率</td>
      <td>{{ item['CPU使用率'] || loading5 }}</td>
      <td>{{ cpu_used.res }}</td>
      <td><span :class="cpu_used.is_ok">{{ cpu_used.is_ok }}</span></td>
    </tr>
    <tr>
      <td>内存容量</td>
      <td>{{ item['内存容量'] || loading5 }}</td>
      <td>{{ ram.res }}</td>
      <td><span :class="ram.is_ok">{{ ram.is_ok }}</span></td>
    </tr>
    <tr>
      <td>设备温度</td>
      <td>{{ item['设备温度'] || loading5 }}</td>
      <td>{{ nas_temp.res }}</td>
      <td><span :class="nas_temp.is_ok">{{ nas_temp.is_ok }}</span></td>
    </tr>
    <tr>
      <td>风扇转速</td>
      <td>{{ item['风扇转速'] || loading5 }}</td>
      <td>{{ fan_speed.res }}</td>
      <td><span :class="fan_speed.is_ok">{{ fan_speed.is_ok }}</span></td>
    </tr>
    <tr>
      <td>MAC 地址</td>
      <td colspan="3" class="wrapper">
        <div class="wrapper__cell" v-for="(it,index) in mac" :key="index">
          <div>{{ item['MAC地址'] || loading5 }}</div>
          <div>{{ it.res }}</div>
          <div><span :class="it.is_ok">{{ it.is_ok }}</span></div>
        </div>
      </td>
    </tr>
    <tr>
      <td>外置 USB</td>
      <td>{{ item['硬盘读最低'] && item['硬盘写最低'] ? `硬盘读最低:${item['硬盘读最低']} 硬盘写最低:${item['硬盘写最低']}` : loading5 }}</td>
      <td class="wrapper">
        <div class="wrapper__cell" v-for="(it,index) in u_disk.res" :key="index">
          <div>{{ it }}</div>
        </div>
      </td>
      <td><span :class="u_disk.is_ok">{{ u_disk.is_ok }}</span></td>
    </tr>
    <tr>
      <td>网口</td>
      <td>{{ item['网速最低'] || loading5 }}</td>
      <td class="wrapper">
        <div class="wrapper__cell" v-for="(it,index) in net.res" :key="index">
          <div>{{ it }}</div>
        </div>
      </td>
      <td><span :class="net.is_ok">{{ net.is_ok }}</span></td>
    </tr>
    <tr>
      <td>硬盘</td>
      <td>{{ item['硬盘读最低'] && item['硬盘写最低'] ? `硬盘读最低:${item['硬盘读最低']} 硬盘写最低:${item['硬盘写最低']}` : loading5 }}</td>
      <td class="wrapper">
        <div class="wrapper__cell" v-for="(it,index) in disk.res" :key="index">
          <div>{{ it }}</div>
        </div>
      </td>
      <td><span :class="disk.is_ok">{{ disk.is_ok }}</span></td>
    </tr>
    <tr>
      <td colspan="3">结果</td>
      <td><span :class="finished">{{ finished }}</span></td>
    </tr>
    </tbody>
  </table>
  <div class="bottom__box">
    <button type="button" @click="retest" :disabled="disabled" :class="{'cursor':!disabled}">重新测试</button>
  </div>
  <Toast v-if="show" :message="toastMessage"/>
</template>

<script>
import { reactive, toRefs, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { get, post } from '@/utils/request'
import Header from './Header'
import Toast, { useToastEffect } from '../../components/Toast'

const loading = '等待中……'
const loading2 = '等待中……'
const loading3 = '测试中……'
const loading4 = '待输入……'
const loading5 = '待上传……'

const useUploadEffect = (showToast) => {
  const confData = reactive({ item: {} })
  const fileChange = async (evt) => {
    const oFile = evt.target.files[0]
    const result = await post('test2.php?do=upload', {
      file: oFile
    })
    if (result?.code === 0) {
      showToast(result.message)
      console.log(result.data)
      confData.item = result.data
    } else {
      showToast('上传配置失败')
    }
  }
  const { item } = toRefs(confData)
  return {
    item,
    fileChange
  }
}

const useReadEffect = (showToast) => {
  const finished = ref(loading2)
  const needRead = ref(loading)
  const readData = reactive({
    sn: {
      res: '',
      is_ok: loading4
    },
    nas_temp: {
      res: needRead,
      is_ok: needRead
    },
    cpu_temp: {
      res: needRead,
      is_ok: needRead
    },
    fan_speed: {
      res: needRead,
      is_ok: needRead
    },
    cpu_used: {
      res: needRead,
      is_ok: needRead
    },
    model: {
      res: needRead,
      is_ok: needRead
    },
    kernel_version: {
      res: needRead,
      is_ok: needRead
    },
    bios_version: {
      res: needRead,
      is_ok: needRead
    },
    cpu: {
      res: needRead,
      is_ok: needRead
    },
    mac: [{
      res: needRead,
      is_ok: needRead
    }],
    ram: {
      res: needRead,
      is_ok: needRead
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

  const disabled = ref(true)
  const retest = async () => {
    disabled.value = true
    readData.nas_temp = {
      res: needRead,
      is_ok: needRead
    }
    readData.cpu_temp = {
      res: needRead,
      is_ok: needRead
    }
    readData.fan_speed = {
      res: needRead,
      is_ok: needRead
    }
    readData.cpu_used = {
      res: needRead,
      is_ok: needRead
    }
    readData.model = {
      res: needRead,
      is_ok: needRead
    }
    readData.kernel_version = {
      res: needRead,
      is_ok: needRead
    }
    readData.bios_version = {
      res: needRead,
      is_ok: needRead
    }
    readData.cpu = {
      res: needRead,
      is_ok: needRead
    }
    readData.mac = [{
      res: needRead,
      is_ok: needRead
    }]
    readData.ram = {
      res: needRead,
      is_ok: needRead
    }
    readData.disk = {
      res: [loading],
      is_ok: loading2
    }
    readData.net = {
      res: [loading],
      is_ok: loading2
    }
    readData.u_disk = {
      res: [loading],
      is_ok: loading
    }
    finished.value = loading2
    await getReadInfo()
  }

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

  watch(() => readData.sn.res, (c) => {
    if (c.length === 6) {
      readData.sn.is_ok = 'PASS'
      needRead.value = '读取中……'
      getReadInfo()
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
      finished.value = tmp.includes('NG') ? 'NG' : 'PASS'
      disabled.value = false
      await handleSave()
    }
  }

  const handleSave = async () => {
    try {
      const result = await post(`${window.APIURL}test/store`, {
        sn: readData.sn.res,
        result: readData,
        finished: finished.value
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
    needRead,
    finished,
    disabled,
    retest
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
      finished,
      needRead,
      retest,
      disabled
    } = useReadEffect(showToast)
    const {
      item,
      fileChange
    } = useUploadEffect(showToast)
    return {
      loading5,
      needRead,
      item,
      fileChange,
      show,
      toastMessage,
      currentUser,
      ...toRefs(readData),
      finished,
      retest,
      disabled
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/scss/mixin.scss";

table {
  border-collapse: collapse;
  width: 100%;

  caption {
    padding-bottom: 10px;
  }

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

.bottom__box {
  @include flex(flex-end, center);
  margin-top: 10px;

  button {
    padding: 6px 10px;
    user-select: none;
    background-color: #fff;
    color: #333;
    margin-right: 10px;
    @include border(1px, #ddd, solid);
  }
}
</style>
