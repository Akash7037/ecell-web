import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NVIDIA_API_KEY =
  process.env.NVIDIA_API_KEY ||
  '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';

const openai = new OpenAI({
  apiKey: NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
  timeout: 90000,
});

function cleanHtmlOutput(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.trim();
  // Strip markdown code fences if model wrapped response in ```html ... ```
  cleaned = cleaned.replace(/^```(?:html)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  // If the model wrapped in <body>...</body>, extract just the body contents
  const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    cleaned = bodyMatch[1];
  }
  // Strip outer document tags and headers
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/?(?:html|head|body|meta|title)[^>]*>/gi, '');
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, text, topic, context } = body;

    if (!action || (action !== 'format' && action !== 'generate')) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "format" or "generate".' },
        { status: 400 }
      );
    }

    if (action === 'format') {
      if (!text || typeof text !== 'string' || !text.trim()) {
        return NextResponse.json(
          { error: 'Please provide plain text to format into HTML.' },
          { status: 400 }
        );
      }

      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional HTML formatting assistant. Your job is to convert raw or unformatted plain text into clean, structured, semantic HTML for a blog article. Auto-detect headings and wrap major sections in <h2>, sub-sections in <h3>. Wrap all body text into proper <p> paragraphs. Convert bullet points and steps into <ul><li> or <ol><li>. Wrap notable quotations or key insights into <blockquote>. Use <strong> for emphasis. Retain all original information, facts, and links. Output ONLY the raw HTML body markup. Do NOT wrap with ```html markdown codeblocks. Do NOT include <html>, <head>, or <body> tags.',
          },
          {
            role: 'user',
            content: `Convert the following text into clean, semantic HTML with auto-detected headings, paragraphs, and line breaks:\n\n${text.trim()}`,
          },
        ],
        temperature: 0.3,
        top_p: 1,
        max_tokens: 4096,
        stream: false,
      });

      const choice = completion.choices[0]?.message as any;
      let html = choice?.content || choice?.reasoning_content || choice?.reasoning || '';
      html = cleanHtmlOutput(html);

      if (!html) {
        return NextResponse.json(
          { error: 'Model did not return content. Please try again.' },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, html });
    }

    if (action === 'generate') {
      if (!topic || typeof topic !== 'string' || !topic.trim()) {
        return NextResponse.json(
          { error: 'Please provide a topic to generate the blog article.' },
          { status: 400 }
        );
      }

      const userPrompt = `Topic: ${topic.trim()}\nAdditional Notes / Context: ${
        context && typeof context === 'string' && context.trim()
          ? context.trim()
          : 'Focus on student engineering, technology prototyping, innovation, or venture creation relevant to E-Cell VSBCETC Coimbatore.'
      }\n\nPlease generate a full, engaging, structured blog post in semantic HTML format.`;

      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert technical writer and editorial mentor for the Entrepreneurship Cell (E-Cell) at VSB College of Engineering Technical Campus (VSBCETC), Coimbatore. You write inspiring, pragmatic, high-quality articles for student founders, hardware developers, and innovators. Generate a rich, comprehensive article using <h2> for main section titles, <h3> for sub-points, <p> for detailed explanatory paragraphs, <blockquote> for highlighted insights, and <ul><li> for actionable takeaways. Output ONLY the raw HTML body (do not include <h1>, do not use ```html code fences, do not include <html> or <body> tags).',
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        top_p: 1,
        max_tokens: 4096,
        stream: false,
      });

      const choice = completion.choices[0]?.message as any;
      let html = choice?.content || choice?.reasoning_content || choice?.reasoning || '';
      html = cleanHtmlOutput(html);

      if (!html) {
        return NextResponse.json(
          { error: 'Failed to generate content from AI. Please try again.' },
          { status: 502 }
        );
      }

      // Generate a short 1-2 sentence excerpt from the text
      const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const excerpt =
        plainText.length > 180 ? `${plainText.slice(0, 177)}...` : plainText;

      return NextResponse.json({
        success: true,
        html,
        excerpt,
        topic: topic.trim(),
      });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'An error occurred during AI processing',
      },
      { status: 500 }
    );
  }
}
