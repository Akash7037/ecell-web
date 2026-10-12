'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileTextIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  CheckCircle2Icon,
  Loader2Icon,
  ExternalLinkIcon,
  EyeIcon,
  CodeIcon,
  UsersIcon,
  BookOpenIcon,
  UploadIcon,
} from 'lucide-react';

interface BloggerPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl?: string;
  author: string;
  authorRole?: string;
  authorId?: string;
  authorAvatarUrl?: string;
  authorPortfolioUrl?: string;
  publishedAt: string;
  readTime?: string;
  tags?: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  portfolioUrl?: string;
}

export function BloggerDashboard() {
  const [blogs, setBlogs] = useState<BloggerPost[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<BloggerPost | null>(null);
  const [adding, setAdding] = useState(false);
  const [editorMode, setEditorMode] = useState<'html' | 'preview'>('html');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const emptyBlog = {
    title: '',
    slug: '',
    excerpt: '',
    contentHtml: `<h2>Introduction</h2>\n<p>Write your article introduction here...</p>\n\n<h2>Main Points</h2>\n<p>Explain your engineering, business, or prototype learnings...</p>\n\n<blockquote>\n  "Key take-away or notable quotation from the lab."\n</blockquote>\n\n<p>Conclusion and next steps...</p>`,
    coverImageUrl: '',
    author: 'Rajith J',
    authorRole: 'President',
    authorId: 'm-1',
    authorAvatarUrl: 'https://hnlwmaovaopnghvmifof.supabase.co/storage/v1/object/public/ecell-media/media-1791002600219-0dff0489.png',
    authorPortfolioUrl: 'https://linkedin.com',
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: '4 min read',
    tags: '',
  };

  const [form, setForm] = useState(emptyBlog);

  useEffect(() => {
    fetchBlogs();
    fetchTeamMembers();
  }, []);

  const flashNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4500);
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/members');
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data);
      }
    } catch (err) {
      console.error('Failed to load team members:', err);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...emptyBlog,
      publishedAt: new Date().toISOString().split('T')[0],
    });
    setAdding(true);
    setEditorMode('html');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const openEdit = (blog: BloggerPost) => {
    setAdding(false);
    setEditing(blog);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      contentHtml: blog.contentHtml || '',
      coverImageUrl: blog.coverImageUrl || '',
      author: blog.author || 'E-Cell Council',
      authorRole: blog.authorRole || '',
      authorId: blog.authorId || '',
      authorAvatarUrl: blog.authorAvatarUrl || '',
      authorPortfolioUrl: blog.authorPortfolioUrl || '',
      publishedAt: blog.publishedAt || new Date().toISOString().split('T')[0],
      readTime: blog.readTime || '4 min read',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
    });
    setEditorMode('html');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInsertSnippet = (snippet: string) => {
    if (!textareaRef.current) {
      setForm((prev) => ({
        ...prev,
        contentHtml: prev.contentHtml + '\n' + snippet,
      }));
      return;
    }

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.contentHtml;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newContent = before + snippet + after;
    setForm((prev) => ({ ...prev, contentHtml: newContent }));

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + snippet.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 50);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Please provide a blog title.');
      return;
    }
    if (!form.contentHtml.trim()) {
      alert('Please provide blog HTML content.');
      return;
    }

    setSaving(true);
    try {
      const parsedTags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...(editing ? { id: editing.id } : {}),
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim() || form.title.trim(),
        contentHtml: form.contentHtml.trim(),
        coverImageUrl: form.coverImageUrl.trim() || undefined,
        author: form.author.trim() || 'E-Cell Council',
        authorRole: form.authorRole.trim(),
        authorId: form.authorId.trim() || undefined,
        authorAvatarUrl: form.authorAvatarUrl.trim() || undefined,
        authorPortfolioUrl: form.authorPortfolioUrl.trim() || undefined,
        publishedAt: form.publishedAt.trim(),
        readTime: form.readTime.trim(),
        tags: parsedTags,
      };

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        flashNotice(editing ? 'Article updated successfully!' : 'Article published live successfully!');
        setAdding(false);
        setEditing(null);
        fetchBlogs();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'Failed to save blog'}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('An unexpected error occurred while saving the post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog: BloggerPost) => {
    if (!window.confirm(`Are you sure you want to delete "${blog.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/blogs?id=${blog.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        flashNotice(`Deleted "${blog.title}"`);
        if (editing?.id === blog.id) {
          setEditing(null);
          setAdding(false);
        }
        fetchBlogs();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error occurred while deleting post');
    }
  };

  return (
    <div className="min-h-screen bg-paper pb-20">
      {/* Top Header */}
      <header className="border-b border-paper-muted bg-paper/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rust/10 flex items-center justify-center text-rust">
              <BookOpenIcon size={16} />
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-ink-light leading-none">
                E-Cell VSBCETC
              </p>
              <h1 className="font-headline text-lg font-bold text-ink leading-tight">
                Blogger Studio
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-rust hover:text-vermilion transition-colors"
            >
              <span>View Live Blog</span>
              <ExternalLinkIcon size={12} />
            </Link>

            <button
              onClick={() => {
                sessionStorage.removeItem('ecell_blogger_auth');
                window.location.reload();
              }}
              className="text-xs text-ink-light hover:text-ink transition-colors font-mono"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-headline text-2xl font-bold text-ink">Articles &amp; Field Notes</h2>
            <p className="text-xs text-ink-muted mt-1">
              {loading ? 'Loading...' : `${blogs.length} published story${blogs.length !== 1 ? 's' : ''} (sorted newest first)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {notice && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
                <CheckCircle2Icon size={14} />
                {notice}
              </span>
            )}
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-rust hover:bg-vermilion text-white text-xs font-semibold px-4 py-2.5 rounded-sm transition-colors shadow-2xs"
            >
              <PlusIcon size={14} /> Write New Article
            </button>
          </div>
        </div>

        {/* Composer Form */}
        {(adding || editing) && (
          <div ref={formRef} className="mb-10 border border-paper-muted rounded-sm p-6 bg-paper-dim shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-paper-muted">
              <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
                <FileTextIcon size={16} className="text-rust" />
                <span>{adding ? 'Compose New Blog Post' : `Editing: ${editing?.title}`}</span>
              </h3>
              <button
                onClick={() => {
                  setAdding(false);
                  setEditing(null);
                }}
                className="text-xs text-ink-muted hover:text-ink font-mono"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Post Title <span className="text-vermilion">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const titleVal = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        title: titleVal,
                        slug: adding && !prev.slug ? titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug,
                      }));
                    }}
                    placeholder="e.g. Preparing for Project Expo: What Industrial Mentors Look for"
                    className="w-full border border-paper-muted bg-paper rounded-sm px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-ink font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    URL Slug (Unique Link Path)
                  </label>
                  <div className="flex items-center border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs font-mono">
                    <span className="text-ink-light select-none">/blog/</span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="my-custom-post-slug"
                      className="flex-1 bg-transparent text-ink focus:outline-none ml-0.5"
                    />
                  </div>
                </div>
              </div>

              {/* Publication Date (Custom/Backdate) & Read Time & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Publication Date <span className="text-vermilion">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                    className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink font-mono"
                  />
                  <span className="text-[10px] text-ink-light mt-1 block">
                    You can set any custom or historical date.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="Hardware, Patents, Expo"
                    className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Author Section: Team Member Selector & Portfolio Linking */}
              <div className="border border-paper-muted rounded-sm p-4 bg-paper space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Select Author from Team Members
                  </label>
                  <select
                    value={form.authorId || ''}
                    onChange={(e) => {
                      const mId = e.target.value;
                      if (!mId) {
                        setForm((prev) => ({
                          ...prev,
                          authorId: '',
                          author: 'E-Cell Council',
                          authorRole: 'VSB College of Engineering Technical Campus',
                          authorAvatarUrl: '',
                          authorPortfolioUrl: '',
                        }));
                        return;
                      }
                      const selected = teamMembers.find((m) => m.id === mId);
                      if (selected) {
                        setForm((prev) => ({
                          ...prev,
                          authorId: selected.id,
                          author: selected.name,
                          authorRole: selected.role,
                          authorAvatarUrl: selected.avatarUrl || '',
                          authorPortfolioUrl: selected.portfolioUrl || '',
                        }));
                      }
                    }}
                    className="w-full border border-paper-muted bg-paper-light rounded-sm px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink font-medium"
                  >
                    <option value="">-- Custom Author / E-Cell Council --</option>
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} — {m.role}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-ink-light mt-1 block">
                    Selecting a team member links their profile picture and portfolio page.
                  </span>
                </div>

                {/* Author Details Preview & Customization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-paper-muted/60">
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-paper-light border border-paper-muted overflow-hidden shrink-0 flex items-center justify-center text-ink">
                      {form.authorAvatarUrl ? (
                        <img
                          src={form.authorAvatarUrl}
                          alt={form.author}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UsersIcon size={18} className="text-ink-light" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-ink">
                        {form.author || 'Author Name'}
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        {form.authorRole || 'Author Role'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink mb-1">
                      Author Display Name
                    </label>
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="e.g. Rajith J"
                      className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink mb-1">
                      Author Role / Title
                    </label>
                    <input
                      type="text"
                      value={form.authorRole}
                      onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                      placeholder="e.g. President"
                      className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-ink"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-ink mb-1">
                      Author Portfolio URL (LinkedIn / Website / GitHub)
                    </label>
                    <input
                      type="url"
                      value={form.authorPortfolioUrl}
                      onChange={(e) => setForm({ ...form, authorPortfolioUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/... or https://myportfolio.com"
                      className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-ink font-mono"
                    />
                    <span className="text-[10px] text-ink-light mt-0.5 block">
                      Clicking or touching the author in the blog opens this portfolio link.
                    </span>
                  </div>
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Summary / Excerpt (Displayed on blog feed)
                </label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="A concise 1-2 sentence overview of the article..."
                  className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Cover Image URL (Displays at top of post and card, non-stretched)
                </label>
                <input
                  type="text"
                  value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or media URL"
                  className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink font-mono"
                />
              </div>

              {/* Content HTML Editor with Quick Insert Toolbar & Live Preview */}
              <div className="border border-paper-muted rounded-sm bg-paper overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-paper-light border-b border-paper-muted">
                  {/* Formatting Quick Insert Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-ink-light mr-1 uppercase">Insert:</span>
                    <button
                      type="button"
                      onClick={() => handleInsertSnippet('<h2>Heading Title</h2>\n')}
                      className="px-2 py-1 text-[11px] font-mono font-semibold bg-paper border border-paper-muted rounded hover:border-ink transition-colors text-ink"
                      title="Insert Heading 2"
                    >
                      + H2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSnippet('<h3>Subheading Title</h3>\n')}
                      className="px-2 py-1 text-[11px] font-mono font-semibold bg-paper border border-paper-muted rounded hover:border-ink transition-colors text-ink"
                      title="Insert Heading 3"
                    >
                      + H3
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSnippet('<p>Paragraph text goes here...</p>\n')}
                      className="px-2 py-1 text-[11px] font-mono bg-paper border border-paper-muted rounded hover:border-ink transition-colors text-ink"
                      title="Insert Paragraph"
                    >
                      + &lt;p&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSnippet('<strong>Bold Text</strong>')}
                      className="px-2 py-1 text-[11px] font-mono bg-paper border border-paper-muted rounded hover:border-ink transition-colors text-ink"
                      title="Insert Bold Text"
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSnippet('<a href="https://example.com" target="_blank" rel="noopener">Link Description</a>')}
                      className="px-2 py-1 text-[11px] font-mono bg-paper border border-paper-muted rounded hover:border-ink transition-colors text-ink"
                      title="Insert Link"
                    >
                      + Link
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSnippet('<img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80" alt="Prototype bench" />\n')}
                      className="px-2 py-1 text-[11px] font-mono bg-paper border border-paper-muted rounded hover:border-ink transition-colors text-ink"
                      title="Insert Image"
                    >
                      + Image
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSnippet('<blockquote>\n  "Engineering insight or quotation"\n</blockquote>\n')}
                      className="px-2 py-1 text-[11px] font-mono bg-paper border border-paper-muted rounded hover:border-ink transition-colors text-ink"
                      title="Insert Blockquote"
                    >
                      + Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertSnippet('<ul>\n  <li>Key point 1</li>\n  <li>Key point 2</li>\n</ul>\n')}
                      className="px-2 py-1 text-[11px] font-mono bg-paper border border-paper-muted rounded hover:border-ink transition-colors text-ink"
                      title="Insert Bullet List"
                    >
                      + List
                    </button>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex items-center gap-1 bg-paper border border-paper-muted p-0.5 rounded text-xs">
                    <button
                      type="button"
                      onClick={() => setEditorMode('html')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                        editorMode === 'html'
                          ? 'bg-ink text-paper-DEFAULT font-semibold'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      <CodeIcon size={12} />
                      HTML Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                        editorMode === 'preview'
                          ? 'bg-ink text-paper-DEFAULT font-semibold'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      <EyeIcon size={12} />
                      Live Preview
                    </button>
                  </div>
                </div>

                {editorMode === 'html' ? (
                  <div className="p-3 bg-paper">
                    <textarea
                      ref={textareaRef}
                      rows={18}
                      required
                      value={form.contentHtml}
                      onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
                      placeholder="Write your article in HTML format..."
                      className="w-full font-mono text-xs text-ink bg-transparent focus:outline-none resize-y leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                ) : (
                  <div className="p-6 bg-paper-light max-h-[550px] overflow-y-auto">
                    <div className="max-w-2xl mx-auto">
                      <p className="font-mono text-[10px] text-ink-light uppercase tracking-widest mb-4">
                        Live Preview of Published Article:
                      </p>
                      <div
                        className="blog-prose"
                        dangerouslySetInnerHTML={{ __html: form.contentHtml }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-paper-muted">
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 border border-paper-muted text-xs font-semibold text-ink-muted hover:text-ink transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-rust text-white text-xs font-semibold px-5 py-2.5 rounded-sm hover:bg-vermilion transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2Icon size={12} className="animate-spin" />}
                  {saving ? 'Publishing...' : adding ? 'Publish Blog Post' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Articles List */}
        <div className="border border-paper-muted rounded-sm overflow-hidden bg-paper">
          {loading ? (
            <div className="py-12 text-center text-xs text-ink-muted font-mono">
              <Loader2Icon size={16} className="animate-spin inline-block mr-2" />
              Loading articles...
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-muted font-mono">
              No articles published yet. Click &quot;Write New Article&quot; above to create one.
            </div>
          ) : (
            <div className="divide-y divide-paper-muted">
              {blogs.map((b) => (
                <div
                  key={b.id || b.slug}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper-light/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-semibold text-rust">
                        {b.publishedAt}
                      </span>
                      <span className="text-paper-muted">·</span>
                      <span className="font-mono text-[11px] text-ink-light">
                        {b.readTime || '4 min read'}
                      </span>
                      {b.tags && b.tags.length > 0 && (
                        <>
                          <span className="text-paper-muted">·</span>
                          <span className="text-[10px] font-mono text-ink-muted uppercase">
                            {b.tags.slice(0, 2).join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                    <h4 className="font-headline text-base font-bold text-ink leading-snug line-clamp-1">
                      {b.title}
                    </h4>
                    <p className="text-xs text-ink-muted line-clamp-1 mt-0.5">
                      {b.excerpt}
                    </p>
                    <p className="font-mono text-[11px] text-ink-light mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>By <strong className="text-ink font-semibold">{b.author}</strong></span>
                      {b.authorPortfolioUrl && (
                        <a
                          href={b.authorPortfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-rust hover:underline"
                          title="Open author portfolio"
                        >
                          <ExternalLinkIcon size={10} />
                          <span>Portfolio</span>
                        </a>
                      )}
                      <span className="text-paper-muted">·</span>
                      <span className="text-ink-light select-none">/blog/{b.slug}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-medium border border-paper-muted rounded hover:bg-paper-light text-ink transition-colors"
                      title="Open article in new tab"
                    >
                      <ExternalLinkIcon size={12} />
                      <span>View</span>
                    </a>
                    <button
                      onClick={() => openEdit(b)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-paper-light hover:bg-paper-dim border border-paper-muted rounded text-ink transition-colors"
                    >
                      <PencilIcon size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      className="p-1.5 text-ink-light hover:text-vermilion hover:bg-vermilion/5 rounded transition-colors"
                      title="Delete post"
                    >
                      <Trash2Icon size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
