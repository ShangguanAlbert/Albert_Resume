import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';

interface MarkdownPageProps {
  content: string;
}

export default function MarkdownPage({ content }: MarkdownPageProps) {
  return (
    <div className="prose prose-gray max-w-none
      prose-headings:border-b prose-headings:border-gray-200 prose-headings:pb-1 prose-headings:mb-4 prose-headings:mt-8
      prose-h1:text-2xl prose-h1:font-bold
      prose-h2:text-xl prose-h2:font-semibold
      prose-p:leading-relaxed
      prose-li:leading-relaxed
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900
      prose-em:text-gray-600
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
