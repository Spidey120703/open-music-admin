<script setup lang="ts">
import { OTable } from '@/components/common'
import { ElTagX } from '@/tsx'
import { getRolesByPage } from '@/api/role.ts'
import type { Role } from '@/types'
import { reactive, ref, onMounted } from 'vue'
import type { Columns } from '@/components/common/Table/types.ts'

const columns = reactive<Columns>([
  {
    label: '编号',
    prop: 'id',
    sortable: true,
  },
  {
    label: '艺人',
    prop: 'name',
    sortable: true,
  },
  {
    label: '艺人昵称',
    prop: 'localizedName',
    sortable: true,
  },
  {
    label: '艺人简介',
    prop: 'intro',
    sortable: false,
  },
])

const dialogVisible = ref(true)
const formData = ref({
  id: '',
  name: '',
  localizedName: '',
  intro: '',
  history: '',
  awards: '',
})

function getArtistsByPage(params: any): Promise<any> {
  // 模拟的艺人数据
  const artists = [
    {
      id: 1,
      name: 'Coldplay',
      localizedName: '酷玩；冷玩',
      intro: 'Coldplay 是一支来自英国的摇滚乐队，成立于1996年，由主唱克里斯·马丁等人组成。他们的音乐风格以摇滚和流行为主，代表作品包括《Viva la Vida》、《Yellow》等。',
      history: 'Coldplay 成立于1996年，最初由克里斯·马丁和强尼·巴克兰在大学期间组建。乐队在2000年发行了首张专辑《Parachutes》，并迅速获得了全球的认可。',
      awards: 'Coldplay 获得了多项格莱美奖、全英音乐奖和MTV音乐奖，包括最佳摇滚专辑和最佳流行乐队等。',
    },
    {
      id: 2,
      name: 'OneRepublic',
      localizedName: '一体共和；共和乐团',
      intro: 'OneRepublic 是一支来自美国的流行摇滚乐队，成立于2002年，由主唱瑞恩·泰德等人组成。他们的音乐风格以流行摇滚为主，代表作品包括《Apologize》、《Counting Stars》等。',
      history: 'OneRepublic 成立于2002年，最初由瑞恩·泰德和扎克·菲尔金斯在科罗拉多州组建。乐队在2007年发行了首张专辑《Dreaming Out Loud》，并凭借单曲《Apologize》一举成名。',
      awards: 'OneRepublic 获得了多项MTV音乐奖和公告牌音乐奖，包括最佳流行乐队和最佳单曲等。',
    },
    {
      id: 3,
      name: 'Linkin Park',
      localizedName: '林肯公园',
      intro: 'Linkin Park 是一支来自美国的摇滚乐队，成立于1996年，由查斯特·贝宁顿、麦克·信田等人组成。他们的音乐风格以摇滚、说唱金属为主，代表作品包括《In the End》、《Numb》等。',
      history: 'Linkin Park 成立于1996年，最初由麦克·信田和罗伯·布尔登组建。乐队在2000年发行了首张专辑《Hybrid Theory》，并迅速成为全球最受欢迎的摇滚乐队之一。',
      awards: 'Linkin Park 获得了多项格莱美奖、MTV音乐奖和公告牌音乐奖，包括最佳摇滚专辑和最佳硬摇滚表演等。',
    },
    {
      id: 4,
      name: 'Imagine Dragons',
      localizedName: '梦龙乐队',
      intro: 'Imagine Dragons 是一支来自美国的流行摇滚乐队，成立于2008年，由主唱丹·雷诺兹等人组成。他们的音乐风格以流行摇滚、独立摇滚为主，代表作品包括《Radioactive》、《Believer》等。',
      history: 'Imagine Dragons 成立于2008年，最初由丹·雷诺兹和韦恩·瑟蒙在拉斯维加斯组建。乐队在2012年发行了首张专辑《Night Visions》，并凭借单曲《Radioactive》一举成名。',
      awards: 'Imagine Dragons 获得了多项格莱美奖、MTV音乐奖和公告牌音乐奖，包括最佳摇滚表演和最佳流行乐队等。',
    },
    {
      id: 5,
      name: 'Maroon 5',
      localizedName: '马老五；魔力红',
      intro: 'Maroon 5 是一支来自美国的流行摇滚乐队，成立于1994年，由主唱亚当·列维等人组成。他们的音乐风格以流行摇滚、R&B为主，代表作品包括《Moves Like Jagger》、《Sugar》等。',
      history: 'Maroon 5 成立于1994年，最初由亚当·列维和杰西·卡迈克尔在洛杉矶组建。乐队在2002年发行了首张专辑《Songs About Jane》，并凭借单曲《This Love》一举成名。',
      awards: 'Maroon 5 获得了多项格莱美奖、MTV音乐奖和公告牌音乐奖，包括最佳流行乐队和最佳单曲等。',
    },
  ];

  // 计算分页信息
  const current = 1;
  const size = 10;
  const total = artists.length;
  const pages = Math.ceil(total / size);
  const startIndex = 1;
  const endIndex = Math.min(startIndex, total);
  const records = artists;

  // 返回分页结果，并包装在 { code: 200, msg: 'ok', data: xxx } 中
  return Promise.resolve({
    data: {
      code: 200,
      msg: 'ok',
      data: {
        current,
        size,
        records,
        pages,
        total,
      },
    }
  });
}

onMounted(() => {
  // 自动填入第一条艺人的数据
  const firstArtist = getArtistsByPage({}).then(res => {
    formData.value = res.data.data.records[0]
  })
})

</script>

<template>
  <OTable
    :load-data="getArtistsByPage"
    :columns="columns"
    searchable
    selection
    addition
    editable
    deletable
    pagination
  />

  <el-dialog v-model="dialogVisible" title="编辑艺人信息">
    <el-form :model="formData" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编号">
            <el-input v-model="formData.id" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="艺人">
            <el-input v-model="formData.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="艺人昵称">
        <el-input v-model="formData.localizedName" />
      </el-form-item>
      <el-form-item label="艺人简介">
        <el-input v-model="formData.intro" type="textarea" :rows="8" />
      </el-form-item>
      <el-form-item label="歌手经历">
        <el-input v-model="formData.history" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="获奖信息">
        <el-input v-model="formData.awards" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
