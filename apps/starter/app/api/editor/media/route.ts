import { NextResponse } from "next/server";
import { createStarterEditorialRepository } from "../../../../src/editorial/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getFormFile(formData: FormData) {
  const file = formData.get("file");
  return file instanceof File ? file : null;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = getFormFile(formData);

  if (!file) {
    return NextResponse.json(
      { message: "Upload requires a file field." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Only image uploads are supported." },
      { status: 400 }
    );
  }

  const { media } = createStarterEditorialRepository();
  const asset = await media.uploadMedia({
    fileName: file.name,
    contentType: file.type,
    data: new Uint8Array(await file.arrayBuffer())
  });

  return NextResponse.json(asset);
}
