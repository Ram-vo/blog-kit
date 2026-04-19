import { createEmptyEditorialPost } from "../../../src/editorial/editor-state";
import { createStarterEditorialRepository } from "../../../src/editorial/provider";
import { StarterContainer } from "../../components/starter-ui";
import { StarterEditorClient } from "../components/editor-client";

export const dynamic = "force-dynamic";

export default async function NewEditorPage() {
  const { source, editorial } = createStarterEditorialRepository();
  const categories = await editorial.listCategories();

  return (
    <StarterContainer>
      <StarterEditorClient
        mode="create"
        source={source}
        initialValue={createEmptyEditorialPost()}
        categories={categories}
      />
    </StarterContainer>
  );
}
