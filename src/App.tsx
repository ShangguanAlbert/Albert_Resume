import { parseMarkdown } from './lib/markdown';
import aboutRaw from '../content/about.md?raw';
import Layout from './components/Layout';
import MarkdownPage from './components/MarkdownPage';

const aboutData = parseMarkdown(aboutRaw);

export default function App() {
  return (
    <Layout>
      <MarkdownPage content={aboutData.content} />
    </Layout>
  );
}
