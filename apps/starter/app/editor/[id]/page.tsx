import { notFound } from "next/navigation";
import { toEditorialPostInput } from "../../../src/editorial/editor-state";
import { createStarterEditorialRepository } from "../../../src/editorial/provider";
import { StarterContainer } from "../../components/starter-ui";
import { StarterEditorClient } from "../components/editor-client";

export const dynamic = "force-dynamic";

export default async function EditorDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { source, editorial } = createStarterEditorialRepository();
  const [post, categories] = await Promise.all([
    editorial.getPostById(id),
    editorial.listCategories()
  ]);

  if (!post) {
    notFound();
  }

  return (
    <StarterContainer>
      <StarterEditorClient
        mode="edit"
        source={source}
        postId={post.id}
        initialValue={toEditorialPostInput(post)}
        categories={categories}
      />
    </StarterContainer>
  );
}
