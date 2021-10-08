<template>
  <div>
    <div>嵌套路由</div>
    <div>
      <el-input v-model="id" class="!w-40" placeholder="子路由id" />
      <el-button @click="changeChildRouter">
        跳转
      </el-button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const id = ref('')
const changeChildRouter = () => {
  router.push(`/users/${id.value}`)
}
</script>
