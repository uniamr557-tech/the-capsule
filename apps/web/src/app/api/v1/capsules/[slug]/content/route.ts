import { NextResponse } from 'next/server';
import { ContentCollectionService } from '@/lib/content-service';
import { CreateContentItemRequest } from '@capsule/api-contracts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as any;
  const tagId = searchParams.get('tagId') || undefined;
  const sort = searchParams.get('sort') as any;

  const data = await ContentCollectionService.getVisibleContent({ type, tagId, sort });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body: CreateContentItemRequest = await request.json();

    if (!body.type || !body.authorDisplayName) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Content type and author display name are required.' },
        { status: 400 },
      );
    }

    const created = await ContentCollectionService.submitContent(body);
    return NextResponse.json(created, { status: 201 });
  } catch (_err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Failed to create content item.' },
      { status: 500 },
    );
  }
}
