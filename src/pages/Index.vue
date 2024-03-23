<template>
  <div class="index-page-wrap">
    <p class="description">Загрузите файл с текстом на английском языке. Вы получите список слов которые в нем встречаются, отсортированный в порядке убывания частоты употребления слова. При помощи этог списка вы можете определить какие слова вам нужно выучить. Это позволит реже использовать словарь при чтении этого текста.</p>
    <PreLoader />
    <TextReader />
  </div>
</template>
<script>
import PreLoader from "@/components/PreLoader.vue";
import TextReader from "@/components/TextReader.vue";

export default {
  components: { TextReader, PreLoader },
};
</script>
<style scoped lang="scss">
.index-page-wrap {
  width: 100%;
  height: 100vh;
  padding-top: 100px;
}
.description{
  max-width: 700px;
  display: flex;
  margin: 0 auto;
  font-size: 20px;
  font-family: "Rubik";
  margin-bottom: 100px;
}
</style>
