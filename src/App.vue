<template>
  <PreLoader />
  <router-view />
</template>
<script>
import PreLoader from "./components/PreLoader.vue";
import TextReader from "./components/TextReader.vue";

export default {
  components: {
    TextReader,
    PreLoader,
},
};
</script>
<style lang="scss">
body {
  margin: 0;
  background-color: #f8f8f8;
}
</style>
