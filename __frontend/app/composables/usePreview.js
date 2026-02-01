// This composable handels the preview mode (mainly for the preview feature in Directus)
export const usePreview = () => {
  const route = useRoute();

  // The site is in preview mode as soon as there's a page id URL parameter
  const isPreview = computed(() => route.query.preview === "true");

  const getFilter = (id) => {
    if (isPreview.value) {
      return {
        id: { _eq: id },
      };
    }

    // Else, it's fetched by id and only published content
    return {
      id: { _eq: id },
      status: { _eq: "published" },
    };
  };

  return {
    isPreview,
    getFilter,
  };
};
