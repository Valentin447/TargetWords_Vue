<template>
  <div class="index-page-wrap">
  <PreLoader />
  <TextReader />
</div>
</template>
<script>
import PreLoader from '@/components/PreLoader.vue';
import TextReader from '@/components/TextReader.vue';

export default {
    components: { TextReader, PreLoader }
}
</script>
<style scoped lang="scss">
  .index-page-wrap{
    width: 100%;
    height: 100vh;
    padding-top: 200px;
  }
</style>