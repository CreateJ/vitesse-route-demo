<template>
  <div>动态子路由</div>
  <div>
    传了id为{{ id }}的路由
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { id } = route.params
</script>
