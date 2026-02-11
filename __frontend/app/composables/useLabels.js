// This composable fetches translated labels from Directus
export const useLabels = async () => {
  const { getItems } = useDirectus();
  const { locale } = useI18n();

  const localeMap = {
    de: "de-DE",
    en: "en-US",
  };

  const directusLocale = computed(() => localeMap[locale.value] || "de-DE");

  // Load labels - no await, useAsyncData returns refs that populate asynchronously
  const { data: labels } = await useAsyncData(
    `labels-${locale.value}`,
    () =>
      getItems("labels", {
        fields: ["*", "translations.*"],
        deep: {
          translations: {
            _filter: { languages_code: { _eq: directusLocale.value } },
          },
        },
      }),
    { watch: [locale] },
  );

  const t = (key) => {
    const label = labels.value?.find((l) => l.key === key);
    return label?.translations?.[0]?.value || key;
  };

  return { t };
};
