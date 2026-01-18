import { Router } from 'express';
import type { Express } from 'express';

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
  icon?: string;
  files: DocFile[];
}

export function registerDocsRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin;

  if (!supabaseAdmin) {
    console.error('Supabase admin client not available for docs routes');
    return;
  }

  // Get all documentation structure (sections and published pages)
  app.get('/api/docs/structure', async (req, res) => {
    try {
      // Fetch active sections
      const { data: sections, error: sectionsError } = await supabaseAdmin
        .from('doc_sections')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (sectionsError) {
        throw sectionsError;
      }

      if (!sections || sections.length === 0) {
        return res.json({ success: true, data: [] });
      }

      // Fetch published pages for all sections
      const { data: pages, error: pagesError } = await supabaseAdmin
        .from('doc_pages')
        .select('*')
        .eq('is_published', true)
        .order('order_index');

      if (pagesError) {
        throw pagesError;
      }

      // Transform to DocCategory format
      const categories: DocCategory[] = sections.map(section => {
        const sectionPages = (pages || []).filter(page => page.section_id === section.id);
        
        return {
          name: section.name,
          displayName: section.display_name,
          description: section.description || '',
          icon: section.icon || 'FileText',
          files: sectionPages.map(page => ({
            path: `${section.name}/${page.slug}`,
            title: page.title,
            description: page.description,
            category: section.name,
            order: page.order_index,
            content: page.content,
          })),
        };
      });

      res.json({ success: true, data: categories });
    } catch (error) {
      console.error('Error building docs structure:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to load documentation structure' 
      });
    }
  });

  // Get a specific documentation page by section name and slug
  app.get('/api/docs/content/:sectionName/:pageSlug', async (req, res) => {
    try {
      const { sectionName, pageSlug } = req.params;

      // First get the section
      const { data: section, error: sectionError } = await supabaseAdmin
        .from('doc_sections')
        .select('*')
        .eq('name', sectionName)
        .eq('is_active', true)
        .single();

      if (sectionError || !section) {
        return res.status(404).json({ 
          success: false, 
          error: 'Section not found' 
        });
      }

      // Then get the page
      const { data: page, error: pageError } = await supabaseAdmin
        .from('doc_pages')
        .select('*')
        .eq('section_id', section.id)
        .eq('slug', pageSlug)
        .eq('is_published', true)
        .single();

      if (pageError || !page) {
        return res.status(404).json({ 
          success: false, 
          error: 'Page not found' 
        });
      }

      const docFile: DocFile = {
        path: `${sectionName}/${pageSlug}`,
        title: page.title,
        description: page.description,
        category: sectionName,
        order: page.order_index,
        content: page.content,
      };

      res.json({ success: true, data: docFile });
    } catch (error) {
      console.error('Error loading doc page:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to load documentation page' 
      });
    }
  });

  // Search documentation
  app.get('/api/docs/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json({ success: true, data: [] });
      }

      const searchQuery = `%${query}%`;

      // Search in published pages
      const { data: pages, error } = await supabaseAdmin
        .from('doc_pages')
        .select(`
          *,
          section:doc_sections(*)
        `)
        .eq('is_published', true)
        .or(`title.ilike.${searchQuery},description.ilike.${searchQuery},content.ilike.${searchQuery}`)
        .limit(20);

      if (error) {
        throw error;
      }

      const results = (pages || []).map(page => {
        // Find context around the match
        let context = '';
        const contentLower = page.content.toLowerCase();
        const queryLower = query.toLowerCase();
        const queryIndex = contentLower.indexOf(queryLower);
        
        if (queryIndex !== -1) {
          const start = Math.max(0, queryIndex - 100);
          const end = Math.min(page.content.length, queryIndex + 100);
          context = page.content.substring(start, end);
          
          // Clean up the context
          context = context.replace(/\n+/g, ' ').trim();
          if (start > 0) context = '...' + context;
          if (end < page.content.length) context = context + '...';
        }

        // Calculate relevance
        let relevance = 0;
        if (page.title.toLowerCase().includes(queryLower)) relevance += 10;
        if (page.description?.toLowerCase().includes(queryLower)) relevance += 5;
        const matches = (contentLower.match(new RegExp(queryLower, 'g')) || []).length;
        relevance += matches;

        return {
          path: `${page.section.name}/${page.slug}`,
          title: page.title,
          description: page.description,
          category: page.section.name,
          context,
          relevance,
        };
      });

      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);

      res.json({ success: true, data: results });
    } catch (error) {
      console.error('Error searching docs:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to search documentation' 
      });
    }
  });
}