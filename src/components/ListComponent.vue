<template>
  <div class="info">
    <p class="info">Всего слов: {{ countAllWords }}</p>
    <p class="info">Уникальных слов: {{ wordsArr.length }}</p>
  </div>
  <ol>
    <li class="list" v-for="item in wordsArr" :key="item.id">
        <p class="list__word">{{ item.word }}</p>
        <p class="list__count">{{ item.count }}</p>
    </li>
  </ol>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  components: {},
  computed: {
    ...mapState(["wordsArr", "countAllWords"]),
  },
};
</script>

<style lang="scss" scoped>
.list {
  max-width: 300px;
  margin: 0 auto 5px;
  display: flex;
  background-color: #fff;
  font-family: "Rubik";
  border-radius: 7px;
  justify-content: space-between;
  padding: 0 10px;
  line-height: 0.5rem;
  align-items: center;
  &__word{
    font-size: 1.2rem;
  }
}
</style>
