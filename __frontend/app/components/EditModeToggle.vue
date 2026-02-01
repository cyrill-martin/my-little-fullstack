<script setup>
import { NMarquee } from "naive-ui";
const { isEditMode, toggleEditMode } = useEditMode();

// Keyboard shortcut (Ctrl+E)
onMounted(() => {
  const handleKeydown = (e) => {
    if (e.ctrlKey && e.key === "e") {
      e.preventDefault();
      toggleEditMode();
    }
  };

  window.addEventListener("keydown", handleKeydown);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
});
</script>

<template>
  <div
    style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      width: 250px;
      background-color: #ffff0080;
    "
  >
    <n-marquee v-if="isEditMode">
      <div style="margin-right: 0px">kmapper edit mode</div>
    </n-marquee>
  </div>
</template>
