import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children, className = "" }: { children: string | null | undefined; className?: string }) {
  if (!children) return null;
  return (
    <div className={`prose max-w-none prose-headings:font-display prose-a:underline-offset-2 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ a: (props) => <a {...props} target="_blank" rel="noreferrer" /> }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
