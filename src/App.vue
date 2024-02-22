<template>
  <router-view />
</template>
<script>
import TextReader from "./components/TextReader.vue";

export default {
  components: {
    TextReader,
  },
};
</script>
<style lang="scss">
body {
  margin: 0;
  background-color: #f8f8f8;
}
</style>
