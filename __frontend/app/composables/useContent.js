// This composable fetches a single item by collection and slug from any Directus collection
// It returns ALL available Directus data for this item
export const useContent = (collection, id) => {
  const { getItems } = useDirectus();
  const { locale } = useI18n();
  const { isPreview, getFilter } = usePreview();

  const localeMap = {
    de: "de-DE",
    en: "en-US",
  };

  const directusLocale = computed(() => localeMap[locale.value] || "de-DE");

  const { data, pending, error } = useAsyncData(
    `${collection}-${id}-${locale.value}-${isPreview.value}`,
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

  // Always return all the Directus data available
  const content = computed(() => data.value?.[0] || null);

  return { content, pending, error };
};
