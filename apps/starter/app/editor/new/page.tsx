import { createEmptyEditorialPost } from "../../../src/editorial/editor-state";
import { createStarterLocalAdapter } from "../../../src/editorial/local-editorial";
import { StarterContainer } from "../../components/starter-ui";
import { StarterEditorClient } from "../components/editor-client";

export const dynamic = "force-dynamic";

export default async function NewEditorPage() {
  const adapter = createStarterLocalAdapter();
  const categories = await adapter.editorial.listCategories();

  return (
    <StarterContainer>
      <StarterEditorClient
        mode="create"
        initialValue={createEmptyEditorialPost()}
        categories={categories}
      />
    </StarterContainer>
  );
}
