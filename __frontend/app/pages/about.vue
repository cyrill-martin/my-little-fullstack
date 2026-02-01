<script setup>
const { t } = await useLabels();
const { content, pending, error } = useContent("pages", 2);
</script>

<template>
  <div>
    <PreviewBanner />
    <div style="max-width: 800px; margin: 40px auto; padding: 20px">
      <div v-if="pending">Loading...</div>

      <div v-else-if="error" style="color: red">Error: {{ error.message }}</div>

      <div v-else-if="content">
        <h1>{{ content.translations[0].title }}</h1>
        <div v-html="content.translations[0].content"></div>
        <p style="margin-top: 40px; color: #666">
          <small>Ein Label: {{ t("menu.home") }}</small>
        </p>
      </div>

      <div v-else>No page found</div>
    </div>
  </div>
</template>

<style lang="css" scoped>
h1 {
  color: blue;
}
</style>
