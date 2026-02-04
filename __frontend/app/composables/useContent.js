// This composable fetches content from any Directus collection
// For singletons: useContent('collection_name')
// For regular collections: useContent('collection_name', id)
export const useContent = (collection, id = null) => {
  const { getItems } = useDirectus();
  const { locale } = useI18n();
  const { isPreview, getFilter } = usePreview();

  const localeMap = {
    de: "de-DE",
    en: "en-US",
  };

  const directusLocale = computed(() => localeMap[locale.value] || "de-DE");

  const { data, pending, error } = useAsyncData(
    `${collection}-${id || "singleton"}-${locale.value}-${isPreview.value}`,
    () =>
      getItems(collection, {
        filter: getFilter(id),
        fields: ["*", "translations.*"],
        deep: {
          translations: {
            _filter: { languages_code: { _eq: directusLocale.value } },
          },
        },
        limit: 1,
      }),
  );

  // Singletons return an object, regular collections return an array
  const content = computed(() =>
    Array.isArray(data.value) ? data.value[0] : data.value,
  );

  return { content, pending, error };
};
