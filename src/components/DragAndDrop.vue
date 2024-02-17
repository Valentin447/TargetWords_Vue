<template>
  <div id="file-drag-drop">
    <form class="drag-and-drop" ref="fileform">
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dragAndDropCapable: false,
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
          const file = e.dataTransfer.files[0];
          this.$emit("dropFile", file);
        }.bind(this)
      );
    }
  },
};
</script>
<style scoped lang="scss">
.drag-and-drop {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: -1000;
}
</style>
