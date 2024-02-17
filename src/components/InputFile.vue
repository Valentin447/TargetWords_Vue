<template>
  <input
    name="file"
    type="file"
    id="input__file"
    class="input input__file"
    v-on:change="inputChange"
  />
  <label for="input__file" class="input__file-button">
    <p>Выберите *.txt файл</p>
  </label>
  <p>или перетащите файл сюда</p>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    inputChange(e) {
      const file = e.target.files[0];
      this.$emit("inputFile", file);
    },
  },
};
</script>

<style scoped lang="scss">
.input__file {
  opacity: 0;
  visibility: hidden;
  position: absolute;
}
.input__file-button {
  width: max-content;
  padding: 0 30px;
  height: 60px;
  background: #08a652;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  cursor: pointer;
  margin: 0 auto;
}
</style>
