import NameListManager from "@/components/admin/NameListManager";
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/features/tags/hooks";

export default function AdminBlogTags() {
  const { data, isLoading, isError } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  return (
    <NameListManager
      title="Tag"
      pluralTitle="Tags"
      items={data}
      isLoading={isLoading}
      isError={isError}
      onCreate={(name) => createTag.mutateAsync({ name })}
      onUpdate={(id, name) => updateTag.mutateAsync({ id, name })}
      onDelete={(id) => deleteTag.mutateAsync(id)}
    />
  );
}
