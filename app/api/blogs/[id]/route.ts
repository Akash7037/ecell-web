import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStoredBlogs, saveStoredBlog, deleteStoredBlog, StoredBlogPost } from '@/lib/dataStoreServer';
import { slugify, estimateReadTime } from '@/lib/slugUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogs = await getStoredBlogs();
    const blog = blogs.find((b) => b.id === params.id || b.slug === params.id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const blogs = await getStoredBlogs();
    const existing = blogs.find((b) => b.id === params.id || b.slug === params.id);

    if (!existing) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const cleanTitle = body.title ? body.title.trim() : existing.title;
    const rawSlug = body.slug ? body.slug.trim() : existing.slug;
    const finalSlug = slugify(rawSlug) || existing.slug;

    const updated: StoredBlogPost = {
      ...existing,
      slug: finalSlug,
      title: cleanTitle,
      excerpt: body.excerpt !== undefined ? body.excerpt.trim() : existing.excerpt,
      contentHtml: body.contentHtml !== undefined ? body.contentHtml.trim() : existing.contentHtml,
      coverImageUrl: body.coverImageUrl !== undefined ? body.coverImageUrl.trim() : existing.coverImageUrl,
      author: body.author !== undefined ? body.author.trim() : existing.author,
      authorRole: body.authorRole !== undefined ? body.authorRole.trim() : existing.authorRole,
      authorId: body.authorId !== undefined ? body.authorId.trim() : existing.authorId,
      authorAvatarUrl: body.authorAvatarUrl !== undefined ? body.authorAvatarUrl.trim() : existing.authorAvatarUrl,
      authorPortfolioUrl: body.authorPortfolioUrl !== undefined ? body.authorPortfolioUrl.trim() : existing.authorPortfolioUrl,
      publishedAt: body.publishedAt !== undefined ? body.publishedAt.trim() : existing.publishedAt,
      readTime: body.readTime !== undefined ? body.readTime.trim() : (body.contentHtml ? estimateReadTime(body.contentHtml) : existing.readTime),
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : existing.tags,
    };

    await saveStoredBlog(updated);

    try {
      revalidatePath('/blog', 'page');
      revalidatePath(`/blog/${updated.slug}`, 'page');
      if (existing.slug !== updated.slug) {
        revalidatePath(`/blog/${existing.slug}`, 'page');
      }
      revalidatePath('/sitemap.xml');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, blog: updated });
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteStoredBlog(params.id);
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
