// Utility to load markdown documentation files
export interface DocFile {
  path: string;
  title: string;
  description?: string;
  category: string;
  order: number;
  content?: string;
}

export interface DocCategory {
  name: string;
  displayName: string;
  description: string;
  icon: React.ReactNode;
  files: DocFile[];
}

// Function to load markdown content from the docs folder
export async function loadMarkdownContent(docPath: string): Promise<string> {
  try {
    // Try to load from the docs folder
    const response = await fetch(`/docs/${docPath}.md`);
    if (response.ok) {
      return await response.text();
    }
    
    // Fallback: return a default message if file not found
    return `# Documentation Not Found\n\nThe documentation for "${docPath}" is currently being updated. Please check back later or contact support if you need immediate assistance.`;
  } catch (error) {
    console.error(`Failed to load documentation for ${docPath}:`, error);
    return `# Error Loading Documentation\n\nThere was an error loading the documentation for "${docPath}". Please try refreshing the page or contact support if the issue persists.`;
  }
}

// Function to extract title from markdown content
export function extractTitleFromMarkdown(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.substring(2).trim();
    }
  }
  return 'Untitled Document';
}