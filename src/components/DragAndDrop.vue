<template>

</template>
<script>
export default {
  data() {
    return {
      dragAndDrop: false,
    };
  },
  methods: {
    determineDragAndDrop() {
      const div = document.createElement("div");
      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },
  },
  mounted() {
    const dropZone = document.body;
    dropZone.addEventListener("dragenter", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
  
    dropZone.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
  
    dropZone.addEventListener("dragleave", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
  
    dropZone.addEventListener("drop", function (e) {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files[0];
          this.$emit("dropFile", file);
        }.bind(this)
      );
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
