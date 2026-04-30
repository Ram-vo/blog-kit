import {
  deletePostResponse,
  getPostResponse,
  updatePostResponse
} from "../../../../../src/editorial/api-handlers";
import { createStarterEditorialRepository } from "../../../../../src/editorial/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return getPostResponse(id, createStarterEditorialRepository());
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return updatePostResponse(id, request, createStarterEditorialRepository());
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return deletePostResponse(id, createStarterEditorialRepository());
}
