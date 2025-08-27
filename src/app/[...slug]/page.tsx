import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string[];
  };
}

export default function DynamicPage({ params }: PageProps) {
  try {
    const slugPath = params.slug.join('/');
    const htmlPath = path.join(process.cwd(), 'public', 'site', slugPath, 'page.html');
    
    if (!fs.existsSync(htmlPath)) {
      notFound();
    }
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  } catch (error) {
    return (
      <div>
        <h1>Cold Harbor Website</h1>
        <p>Error loading content: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
