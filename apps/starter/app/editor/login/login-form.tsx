"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export function StarterEditorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/editor/session", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const nextPath = searchParams.get("next");
      router.push(nextPath?.startsWith("/editor") ? (nextPath as never) : "/editor");
      router.refresh();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unknown login error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="font-sans text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-starter-soft">
          Access token
        </span>
        <input
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          className="rounded-2xl border border-[var(--surface-border)] bg-white px-4 py-3 font-sans text-[0.95rem] outline-none transition focus:border-starter-dark"
          placeholder="Paste the configured editor token"
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || token.length === 0}
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-starter-dark px-4 py-3 font-sans text-sm font-semibold text-[#fff7ea] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Checking..." : "Open editor"}
      </button>
    </form>
  );
}
