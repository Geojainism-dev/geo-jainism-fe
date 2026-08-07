import NameListManager from "@/components/admin/NameListManager";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/categories/hooks";

export default function AdminBlogCategories() {
  const { data, isLoading, isError } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  return (
    <NameListManager
      title="Category"
      pluralTitle="Categories"
      items={data}
      isLoading={isLoading}
      isError={isError}
      onCreate={(name) => createCategory.mutateAsync({ name })}
      onUpdate={(id, name) => updateCategory.mutateAsync({ id, name })}
      onDelete={(id) => deleteCategory.mutateAsync(id)}
    />
  );
}
