import { setAttr, apply } from "@directus/visual-editing";

export const useVisualEditor = () => {
  const { directusUrl } = useRuntimeConfig().public;

  const isVisualEditor = computed(() => {
    if (import.meta.server) return false;
    return window !== window.parent;
  });

  let editorInstance = null;

  const applyEditor = () => {
    if (!isVisualEditor.value) return;

    nextTick(async () => {
      if (editorInstance) {
        editorInstance.remove();
      }
      editorInstance = await apply({
        directusUrl,
        onSaved: () => {
          refreshNuxtData();
        },
      });
    });
  };

  const editableAttr = (options) => {
    return setAttr(options);
  };

  return {
    isVisualEditor,
    editableAttr,
    applyEditor,
  };
};
