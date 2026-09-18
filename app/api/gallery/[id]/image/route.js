import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import GalleryImage from '../../../../../models/GalleryImage';
import { isObjectId, jsonError, safeServerError } from '../../../../../lib/api';

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!isObjectId(id)) return jsonError('Invalid image.', 400);
    await dbConnect();
    const image = await GalleryImage.findOne({ _id: id, isActive: true }).select('data contentType').lean();
    if (!image) return jsonError('Image not found.', 404);
    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) { return safeServerError(error, 'gallery:image'); }
}
