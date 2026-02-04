<script setup>
// Handling the custom edit's mode UI interaction

/* Hovering over elements shows an outline if the HTML element contains 
a correctly formatted data-edit attribute.
Right click shows a corresponding link to Directus */
import { NPopover, NButton } from "naive-ui";

const runtimeConfig = useRuntimeConfig();
const { isEditMode } = useEditMode();

const showPopover = ref(false);
const popoverX = ref(0);
const popoverY = ref(0);
const currentEdit = ref(null); // { collection, id, field }
const currentTarget = ref(null);

const directusUrl = computed(() => {
  if (!currentEdit.value) return "";
  const { collection, id } = currentEdit.value;
  const base = `${runtimeConfig.public.directusUrl}/admin/content/${collection}`;
  return id && id !== "--" ? `${base}/${id}` : base;
});

const parseDataEdit = (value) => {
  // Format: "collection/id/field" e.g. "pages/1/title" or "labels/menu.home"
  const [collection, id, field = null] = value.split("/");
  return { collection, id, field };
};

const handleMouseEnter = (e) => {
  const target = e.target.closest("[data-edit]");
  if (!target || !isEditMode.value) return;

  // Add outline to highlight the editable element
  target.style.cssText =
    "outline: 2px solid rgba(0, 0, 0, 0.5); border-radius: 4px;";
  currentTarget.value = target;
};

const handleMouseLeave = (e) => {
  const target = e.target.closest("[data-edit]");
  if (!target || !isEditMode.value) return;

  // Remove outline
  target.style.cssText = "";
  if (currentTarget.value === target) {
    currentTarget.value = null;
  }
};

const handleContextMenu = (e) => {
  const target = e.target.closest("[data-edit]");
  if (!target || !isEditMode.value) return;

  e.preventDefault();

  // Position popover at click location
  popoverX.value = e.clientX;
  popoverY.value = e.clientY;
  currentEdit.value = parseDataEdit(target.dataset.edit);
  showPopover.value = true;
};

const handleClickOutside = () => {
  showPopover.value = false;
  currentEdit.value = null;
};

onMounted(() => {
  document.addEventListener("mouseenter", handleMouseEnter, true);
  document.addEventListener("mouseleave", handleMouseLeave, true);
  document.addEventListener("contextmenu", handleContextMenu, true);
});

onUnmounted(() => {
  document.removeEventListener("mouseenter", handleMouseEnter, true);
  document.removeEventListener("mouseleave", handleMouseLeave, true);
  document.removeEventListener("contextmenu", handleContextMenu, true);
});
</script>

<template>
  <n-popover
    :show="showPopover"
    :x="popoverX"
    :y="popoverY"
    trigger="manual"
    placement="bottom-start"
    @clickoutside="handleClickOutside"
  >
    <div style="padding: 4px 0">
      <div style="font-size: 12px; color: #666; margin-bottom: 4px">
        {{
          `${currentEdit?.collection}${currentEdit?.id && currentEdit.id !== "--" ? "/" + currentEdit.id : ""}${currentEdit?.field ? ": " + currentEdit.field : ""}`
        }}
      </div>
      <n-button
        tag="a"
        :href="directusUrl"
        target="_blank"
        size="small"
        type="primary"
      >
        Go to Directus
      </n-button>
    </div>
  </n-popover>
</template>
