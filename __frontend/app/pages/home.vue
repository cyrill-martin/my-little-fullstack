<script setup>
const { t } = await useLabels();
const { editableAttr, applyEditor } = useVisualEditor();
const home = reactive(useContent("pages", 1)); // home
const datasets = reactive(useContent("datasets", 1)); // dataset

onMounted(() => {
  if (home.content) applyEditor();
  if (datasets.content) applyEditor();
});

watch(
  () => home.content,
  (content) => {
    if (content) applyEditor();
  },
);

watch(
  () => datasets.content,
  (content) => {
    if (content) applyEditor();
  },
);
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
        <h1
          :data-directus="
            editableAttr({
              collection: 'pages',
              item: 1,
              fields: 'translations',
              mode: 'modal',
            })
          "
        >
          {{ home.content.translations[0].title }}
        </h1>
        <div
          v-html="home.content.translations[0].content"
          :data-directus="
            editableAttr({
              collection: 'pages',
              item: 1,
              fields: 'translations',
              mode: 'modal',
            })
          "
        ></div>
        <p style="margin-top: 40px; color: #666">
          <small
            >Label:
            <span
              :data-directus="
                editableAttr({
                  collection: 'labels',
                  item: 'menu.home',
                  fields: 'translations',
                  mode: 'modal',
                })
              "
              >{{ t("menu.home") }}</span
            ></small
          >
        </p>
      </div>

      <div v-else>No page found</div>

      <div
        v-if="datasets.content"
        :data-directus="
          editableAttr({
            collection: 'datasets',
            item: 1,
            fields: 'name',
            mode: 'popover',
          })
        "
      >
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
