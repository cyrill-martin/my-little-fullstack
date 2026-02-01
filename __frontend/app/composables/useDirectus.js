// This composable handles the communication with Directus
import { createDirectus, rest, readItems } from "@directus/sdk";

export const useDirectus = () => {
  const config = useRuntimeConfig();

  const directusUrl = import.meta.server
    ? config.directusUrl
    : config.public.directusUrl;

  const client = createDirectus(directusUrl).with(rest());

  const getItems = async (collection, query = {}) => {
    return await client.request(readItems(collection, query));
  };

  return {
    client,
    getItems,
  };
};
