// This composable handels the preview mode (mainly for the preview feature in Directus)
export const usePreview = () => {
  const route = useRoute();

  const isPreview = computed(() => route.query.preview === "true");

  const getFilter = (id) => {
    const filter = {};

    if (id) {
      filter.id = { _eq: id };
    }

    if (!isPreview.value) {
      filter.status = { _eq: "published" };
    }

    return filter;
  };

  return {
    isPreview,
    getFilter,
  };
};
