import { notFound } from "next/navigation";
import { toEditorialPostInput } from "../../../src/editorial/editor-state";
import { createStarterLocalAdapter } from "../../../src/editorial/local-editorial";
import { StarterContainer } from "../../components/starter-ui";
import { StarterEditorClient } from "../components/editor-client";

export const dynamic = "force-dynamic";

export default async function EditorDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adapter = createStarterLocalAdapter();
  const [post, categories] = await Promise.all([
    adapter.editorial.getPostById(id),
    adapter.editorial.listCategories()
  ]);

  if (!post) {
    notFound();
  }

  return (
    <StarterContainer>
      <StarterEditorClient
        mode="edit"
        postId={post.id}
        initialValue={toEditorialPostInput(post)}
        categories={categories}
      />
    </StarterContainer>
  );
}
