import fs from 'fs';
import path from 'path';

export default function Home() {
  try {
    const htmlPath = path.join(process.cwd(), 'public', 'site', 'page.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  } catch (error) {
    return (
      <div>
        <h1>Cold Harbor Website</h1>
        <p>Error loading content: {error.message}</p>
      </div>
    );
  }
}
