import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStoredBlogs, saveStoredBlog, deleteStoredBlog, StoredBlogPost } from '@/lib/dataStoreServer';
import { slugify, estimateReadTime } from '@/lib/slugUtils';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET /api/blogs — returns all blogs sorted descending
export async function GET() {
  try {
    const blogs = await getStoredBlogs();
    return NextResponse.json(blogs, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST /api/blogs — create or update a blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Blog title is required' }, { status: 400 });
    }

    if (!body.contentHtml || !body.contentHtml.trim()) {
      return NextResponse.json({ error: 'Blog HTML content is required' }, { status: 400 });
    }

    const cleanTitle = body.title.trim();
    const rawSlug = body.slug ? body.slug.trim() : cleanTitle;
    let finalSlug = slugify(rawSlug);
    if (!finalSlug) {
      finalSlug = `post-${randomBytes(4).toString('hex')}`;
    }

    // Custom date selection as explicitly required by user:
    const publishedAt = body.publishedAt && body.publishedAt.trim()
      ? body.publishedAt.trim()
      : new Date().toISOString().split('T')[0];

    const blog: StoredBlogPost = {
      id: body.id || `blog-${randomBytes(6).toString('hex')}`,
      slug: finalSlug,
      title: cleanTitle,
      excerpt: body.excerpt?.trim() || cleanTitle,
      contentHtml: body.contentHtml.trim(),
      coverImageUrl: body.coverImageUrl?.trim() || undefined,
      author: body.author?.trim() || 'E-Cell Council',
      authorRole: body.authorRole?.trim() || 'VSBCETC',
      authorId: body.authorId?.trim() || undefined,
      authorAvatarUrl: body.authorAvatarUrl?.trim() || undefined,
      authorPortfolioUrl: body.authorPortfolioUrl?.trim() || undefined,
      publishedAt,
      readTime: body.readTime?.trim() || estimateReadTime(body.contentHtml),
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      showLogoOverlay: body.showLogoOverlay !== false,
    };

    const saved = await saveStoredBlog(blog);
    if (!saved) {
      return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 });
    }

    try {
      revalidatePath('/', 'page');
      revalidatePath('/blog', 'page');
      revalidatePath(`/blog/${blog.slug}`, 'page');
      revalidatePath('/sitemap.xml');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Failed to create/update blog:', error);
    return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
  }
}

// DELETE /api/blogs?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const deleted = await deleteStoredBlog(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    try {
      revalidatePath('/blog', 'page');
      revalidatePath('/sitemap.xml');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
