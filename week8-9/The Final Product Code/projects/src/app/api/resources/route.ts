import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { normalizeTrackValue, resourceCatalog, type ResourceRecord } from '@/lib/resource-catalog';

function normalizeRemoteResource(input: Record<string, unknown>): ResourceRecord | null {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const url = typeof input.url === 'string' ? input.url.trim() : '';
  if (!title || !url) {
    return null;
  }

  const category = normalizeTrackValue(typeof input.category === 'string' ? input.category : undefined);
  const tracks: ResourceRecord['tracks'] = category === 'all' ? ['frontend'] : [category];
  const type: ResourceRecord['type'] =
    input.type === 'practice' || input.type === 'courses' || input.type === 'books'
      ? input.type
      : 'courses';

  return {
    id: typeof input.id === 'string' ? input.id : `db-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    description: typeof input.description === 'string' ? input.description.trim() : '',
    url,
    tracks,
    type,
    level: typeof input.level === 'string' ? input.level : 'General',
    provider: typeof input.provider === 'string' ? input.provider : 'Imported',
    language: input.language === 'zh' || input.language === 'mixed' ? input.language : 'en',
    free: input.free === false ? false : true,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = normalizeTrackValue(searchParams.get('category'));
  const type = searchParams.get('type');

  let merged = [...resourceCatalog];

  try {
    const client = getSupabaseClient();
    const { data } = await client.from('learning_resources').select('*').order('created_at', { ascending: false });
    const remoteResources = (data ?? [])
      .map((item) => normalizeRemoteResource(item as Record<string, unknown>))
      .filter((item): item is ResourceRecord => Boolean(item));

    const dedupeMap = new Map<string, ResourceRecord>();
    [...remoteResources, ...resourceCatalog].forEach((item) => {
      dedupeMap.set(item.id, item);
    });
    merged = Array.from(dedupeMap.values());
  } catch {
    // Fall back to the curated local catalog when Supabase is unavailable.
  }

  const filtered = merged.filter((item) => {
    const trackMatch = category === 'all' || item.tracks.includes(category);
    const typeMatch = !type || type === 'all' || item.type === type;
    return trackMatch && typeMatch;
  });

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resources } = body;

    if (!resources || !Array.isArray(resources)) {
      return NextResponse.json({ success: false, error: 'resources must be an array' }, { status: 400 });
    }

    const client = getSupabaseClient();
    const { data, error } = await client.from('learning_resources').insert(resources).select();
    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save resources' },
      { status: 500 },
    );
  }
}
