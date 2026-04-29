import { StarterContainer, SurfacePanel } from "../../components/starter-ui";
import { StarterEditorLoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function EditorLoginPage() {
  return (
    <StarterContainer>
      <SurfacePanel className="mx-auto grid max-w-[34rem] gap-6 px-6 py-7 sm:px-8">
        <div className="grid gap-2">
          <p className="font-sans text-[0.76rem] uppercase tracking-[0.12em] text-starter-soft">
            Starter editor
          </p>
          <h1 className="text-[clamp(2rem,4vw,3rem)] leading-none font-semibold tracking-[-0.05em]">
            Editor access
          </h1>
          <p className="text-[1rem] leading-[1.7] text-starter-muted">
            Enter the configured starter editor token to continue. This
            lightweight guard is only for the reference app; production
            apps can replace it with their own auth or Supabase Auth.
          </p>
        </div>

        <StarterEditorLoginForm />
      </SurfacePanel>
    </StarterContainer>
  );
}
