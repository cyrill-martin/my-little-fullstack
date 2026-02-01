<script setup>
// This is the preview banner shown on top of each page if the site is in preview mode
const { isPreview } = usePreview();
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const isGerman = computed(() => locale.value === "de");
</script>

<template>
  <div class="preview-banner" v-if="isPreview">
    PREVIEW -
    <NuxtLink :to="switchLocalePath('de')" :class="{ active: isGerman }"
      >DE</NuxtLink
    >
    |
    <NuxtLink :to="switchLocalePath('en')" :class="{ active: !isGerman }"
      >EN</NuxtLink
    >
  </div>
</template>

<style lang="css" scoped>
.preview-banner {
  background: orange;
  padding: 10px;
  text-align: center;
}
a {
  text-decoration: none;
}

a.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
