export const useEditMode = () => {
  // Sets editMode in state to true/false
  const isEditMode = useState("editMode", () => false);

  const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value;
  };

  return {
    isEditMode,
    toggleEditMode,
  };
};
