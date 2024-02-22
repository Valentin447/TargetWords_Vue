<template>
  <div>
    <router-link to="/">Назад</router-link>
    <ListComponent />
  </div>
</template>

<script>
import ListComponent from '@/components/ListComponent.vue';


  export default {
    components: { ListComponent }
}
</script>

<style lang="scss" scoped>

</style>