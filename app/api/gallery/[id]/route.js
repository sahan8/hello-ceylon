import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import GalleryImage from '../../../../models/GalleryImage';
import { isAdmin } from '../../../../lib/auth';
import { isObjectId, jsonError, safeServerError } from '../../../../lib/api';

export async function DELETE(_request, { params }) {
  if (!(await isAdmin())) return jsonError('Unauthorized.', 401);
  try {
    const { id } = await params;
    if (!isObjectId(id)) return jsonError('Invalid image.', 400);
    await dbConnect();
    const image = await GalleryImage.findByIdAndDelete(id);
    if (!image) return jsonError('Image not found.', 404);
    return NextResponse.json({ success: true });
  } catch (error) { return safeServerError(error, 'gallery:delete'); }
}
