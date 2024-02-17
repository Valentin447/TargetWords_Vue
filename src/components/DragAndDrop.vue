<template>
  <div id="file-drag-drop">
    <form class="drag-and-drop" ref="fileform">
      <span class="drop-files">или перетащите файл сюда</span>
      <div class="file-listing">
        {{ file.name }}
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dragAndDropCapable: false,
      file: {},
    };
  },
  methods: {
    determineDragAndDropCapable() {
      const div = document.createElement("div");
      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
    if (this.dragAndDropCapable) {
      [
        "drag",
        "dragstart",
        "dragend",
        "dragover",
        "dragenter",
        "dragleave",
        "drop",
      ].forEach(
        function (event) {
          this.$refs.fileform.addEventListener(
            event,
            function (e) {
              e.preventDefault();
              e.stopPropagation();
            }.bind(this),
            false
          );
        }.bind(this)
      );
      this.$refs.fileform.addEventListener(
        "drop",
        function (e) {
          this.file = e.dataTransfer.files[0];
          console.log(this.file);
        }.bind(this)
      );
    }
  },
};
</script>
<style scoped lang="scss">
.drag-and-drop {
  width: 100%;
  height: 100vh;
}
.file-listing {
}
</style>
