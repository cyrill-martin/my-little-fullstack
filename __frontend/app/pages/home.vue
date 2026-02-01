<script setup>
const { t } = await useLabels();
const home = reactive(useContent("pages", 1)); // home
const datasets = reactive(useContent("datasets", 1)); // dataset
</script>

<template>
  <div>
    <PreviewBanner />
    <div style="max-width: 800px; margin: 40px auto; padding: 20px">
      <div v-if="home.pending">Loading...</div>

      <div v-else-if="home.error" style="color: red">
        Error: {{ home.error.message }}
      </div>

      <div v-else-if="home.content">
        <h1 data-edit="pages/1/title">
          {{ home.content.translations[0].title }}
        </h1>
        <div
          v-html="home.content.translations[0].content"
          data-edit="pages/1/content"
        ></div>
        <p style="margin-top: 40px; color: #666">
          <small
            >Label:
            <span data-edit="labels/menu.home">{{
              t("menu.home")
            }}</span></small
          >
        </p>
      </div>

      <div v-else>No page found</div>

      <div v-if="datasets.content" data-edit="datasets/1/name">
        <a
          :href="`${datasets.content.url}`"
          target="_blank"
          rel="noopener noreferrer"
          >{{ datasets.content.name }}</a
        >
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
h1 {
  color: blue;
}
</style>
