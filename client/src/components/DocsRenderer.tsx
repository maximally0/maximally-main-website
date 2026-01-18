import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, FileText, Folder, Search, Menu, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DocFile {
  path: string;
  title: string;
  description?: string;
  category: string;
  order: number;
  content?: string;
}

interface DocCategory {
  name: string;
  displayName: string;
  description: string;
  files: DocFile[];
}

const DocsRenderer: React.FC = () => {
  const { '*': docPath } = useParams();
  const navigate = useNavigate();
  const [docs, setDocs] = useState<DocCategory[]>([]);
  const [currentDoc, setCurrentDoc] = useState<DocFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; title: string; level: number }>>([]);

  // Mock data - in a real implementation, this would come from your docs API
  const mockDocs: DocCategory[] = [
    {
      name: 'getting-started',
      displayName: 'Getting Started',
      description: 'Everything you need to get up and running',
      files: [
        {
          path: 'getting-started/introduction',
          title: 'Introduction to Maximally',
          description: 'Learn about Maximally\'s mission and core features',
          category: 'getting-started',
          order: 1
        },
        {
          path: 'getting-started/quick-start',
          title: 'Quick Start Guide',
          description: 'Get up and running with Maximally in minutes',
          category: 'getting-started',
          order: 2
        }
      ]
    },
    {
      name: 'platform',
      displayName: 'Platform',
      description: 'Core platform features and functionality',
      files: [
        {
          path: 'platform/overview',
          title: 'Platform Overview',
          description: 'Comprehensive overview of Maximally\'s features',
          category: 'platform',
          order: 1
        },
        {
          path: 'platform/user-roles',
          title: 'User Roles & Permissions',
          description: 'Understanding different user roles and capabilities',
          category: 'platform',
          order: 2
        }
      ]
    },
    {
      name: 'guides',
      displayName: 'Guides',
      description: 'Step-by-step tutorials and how-tos',
      files: [
        {
          path: 'guides/creating-hackathon',
          title: 'Creating Your First Hackathon',
          description: 'Complete guide to organizing a hackathon',
          category: 'guides',
          order: 1
        },
        {
          path: 'guides/team-building',
          title: 'Building Effective Teams',
          description: 'Tips for forming and managing hackathon teams',
          category: 'guides',
          order: 2
        }
      ]
    },
    {
      name: 'api',
      displayName: 'API Reference',
      description: 'Complete API documentation',
      files: [
        {
          path: 'api/authentication',
          title: 'Authentication',
          description: 'API authentication and authorization',
          category: 'api',
          order: 1
        },
        {
          path: 'api/endpoints',
          title: 'API Endpoints',
          description: 'Complete list of available endpoints',
          category: 'api',
          order: 2
        }
      ]
    }
  ];

  useEffect(() => {
    loadDocsStructure();
  }, []);

  const loadDocsStructure = async () => {
    try {
      const response = await fetch('/api/docs/structure');
      const data = await response.json();
      
      if (data.success) {
        setDocs(data.data);
      } else {
        console.error('Failed to load docs structure:', data.error);
        // Fallback to mock data
        setDocs(mockDocs);
      }
    } catch (error) {
      console.error('Error loading docs structure:', error);
      // Fallback to mock data
      setDocs(mockDocs);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (docPath && docs.length > 0) {
      loadDocument(docPath);
    } else if (docs.length > 0) {
      // Default to first document
      const firstDoc = docs[0]?.files[0];
      if (firstDoc) {
        navigate(`/docs/${firstDoc.path}`, { replace: true });
      }
    }
  }, [docPath, docs, navigate]);

  const loadDocument = async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/docs/content/${path}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentDoc(data.data);
          generateTableOfContents(data.data.content);
        } else {
          throw new Error(data.error);
        }
      } else {
        throw new Error('Failed to load document');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      // Fallback to mock content
      const doc = findDocByPath(path);
      if (doc) {
        setCurrentDoc({ ...doc, content: generateMockContent(doc) });
        generateTableOfContents(generateMockContent(doc));
      }
    }
    setLoading(false);
  };

  const findDocByPath = (path: string): DocFile | null => {
    for (const category of docs) {
      const doc = category.files.find(f => f.path === path);
      if (doc) return doc;
    }
    return null;
  };

  const generateMockContent = (doc: DocFile): string => {
    return `# ${doc.title}

${doc.description}

This is a placeholder for the ${doc.title} documentation. In a real implementation, this content would be loaded from the corresponding markdown file.

## Key Features

- Feature 1: Comprehensive documentation
- Feature 2: Interactive examples
- Feature 3: Code snippets and tutorials

## Getting Started

\`\`\`javascript
// Example code snippet
const maximally = new MaximallyAPI({
  apiKey: 'your-api-key'
});

const hackathons = await maximally.hackathons.list();
console.log(hackathons);
\`\`\`

## Next Steps

Continue reading the documentation to learn more about ${doc.title}.`;
  };

  const generateTableOfContents = (content: string) => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    const toc = headings.map(heading => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const title = heading.replace(/^#+\s+/, '');
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { id, title, level };
    });
    setTableOfContents(toc);
  };

  const filteredDocs = docs.map(category => ({
    ...category,
    files: category.files.filter(file =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.files.length > 0);

  const Sidebar = () => (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Home Link */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 mb-4 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
        >
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-1.5 group-hover:from-orange-400 group-hover:to-orange-500 transition-all duration-300">
            <Terminal className="h-4 w-4 text-black" />
          </div>
          <span className="font-press-start text-xs text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
            MAXIMALLY
          </span>
        </Link>
        
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredDocs.map((category) => (
            <div key={category.name} className="mb-6">
              <div className="flex items-center mb-3">
                <Folder className="h-4 w-4 text-gray-500 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                  {category.displayName}
                </h3>
              </div>
              <div className="space-y-1 ml-6">
                {category.files.map((file) => (
                  <Link
                    key={file.path}
                    to={`/docs/${file.path}`}
                    className={`flex items-center p-2 rounded-lg text-sm transition-colors ${
                      currentDoc?.path === file.path
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{file.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const TableOfContents = () => (
    <div className="w-64 p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">On this page</h3>
      <div className="space-y-2">
        {tableOfContents.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${
              item.level > 1 ? `ml-${(item.level - 1) * 4}` : ''
            }`}
            style={{ marginLeft: `${(item.level - 1) * 16}px` }}
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-screen overflow-hidden z-40">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex ml-80 md:ml-80">
        <div className="flex-1 max-w-4xl">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-1 group-hover:from-orange-400 group-hover:to-orange-500 transition-all duration-300">
                <Terminal className="h-3 w-3 text-black" />
              </div>
              <span className="font-press-start text-[10px] text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                MAXIMALLY
              </span>
            </Link>
            <div className="w-8" />
          </div>

          {/* Breadcrumb */}
          {currentDoc && (
            <div className="p-6 pb-0">
              <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Link to="/docs" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Docs
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="capitalize">{currentDoc.category.replace('-', ' ')}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 dark:text-white">{currentDoc.title}</span>
              </nav>
            </div>
          )}

          {/* Document content */}
          <div className="p-6">
            {currentDoc ? (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="mb-8">
                  <Badge variant="secondary" className="mb-4">
                    {currentDoc.category.replace('-', ' ')}
                  </Badge>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {currentDoc.title}
                  </h1>
                  {currentDoc.description && (
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                      {currentDoc.description}
                    </p>
                  )}
                </div>
                
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const inline = !match;
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => (
                      <h1 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}>
                        {children}
                      </h3>
                    ),
                  }}
                >
                  {currentDoc.content || ''}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Document not found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  The requested documentation page could not be found.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Table of contents */}
        {currentDoc && tableOfContents.length > 0 && (
          <div className="hidden xl:block border-l border-gray-200 dark:border-gray-700">
            <TableOfContents />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsRenderer;