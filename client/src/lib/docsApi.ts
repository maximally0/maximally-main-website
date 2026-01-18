import { supabase } from './supabaseClient';

export interface DocSection {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
}

export interface DocPage {
  id: string;
  section_id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  order_index: number;
  is_published: boolean;
  meta_title?: string;
  meta_description?: string;
  section?: DocSection;
}

export interface DocCategory {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  files: DocFile[];
}

export interface DocFile {
  path: string;
  title: string;
  description?: string;
  category: string;
  order: number;
  content?: string;
}

/**
 * Fetch all active documentation sections with their published pages
 */
export async function getDocsStructure(): Promise<DocCategory[]> {
  // Fetch active sections
  const { data: sections, error: sectionsError } = await supabase
    .from('doc_sections')
    .select('*')
    .eq('is_active', true)
    .order('order_index');

  if (sectionsError) {
    console.error('Error fetching doc sections:', sectionsError);
    return [];
  }

  if (!sections || sections.length === 0) {
    return [];
  }

  // Fetch published pages for all sections
  const { data: pages, error: pagesError } = await supabase
    .from('doc_pages')
    .select('*')
    .eq('is_published', true)
    .order('order_index');

  if (pagesError) {
    console.error('Error fetching doc pages:', pagesError);
    return [];
  }

  // Transform to DocCategory format
  const categories: DocCategory[] = (sections as DocSection[]).map(section => {
    const sectionPages = ((pages || []) as DocPage[]).filter(page => page.section_id === section.id);
    
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

  return categories;
}

/**
 * Fetch a specific documentation page by section name and slug
 */
export async function getDocPage(sectionName: string, pageSlug: string): Promise<DocFile | null> {
  // First get the section
  const { data: section, error: sectionError } = await supabase
    .from('doc_sections')
    .select('*')
    .eq('name', sectionName)
    .eq('is_active', true)
    .single();

  if (sectionError || !section) {
    console.error('Error fetching section:', sectionError);
    return null;
  }

  // Then get the page
  const { data: page, error: pageError } = await supabase
    .from('doc_pages')
    .select('*')
    .eq('section_id', (section as DocSection).id)
    .eq('slug', pageSlug)
    .eq('is_published', true)
    .single();

  if (pageError || !page) {
    console.error('Error fetching page:', pageError);
    return null;
  }

  const typedPage = page as DocPage;

  return {
    path: `${sectionName}/${pageSlug}`,
    title: typedPage.title,
    description: typedPage.description,
    category: sectionName,
    order: typedPage.order_index,
    content: typedPage.content,
  };
}

/**
 * Search documentation pages
 */
export async function searchDocs(query: string): Promise<DocFile[]> {
  const { data: pages, error } = await supabase
    .from('doc_pages')
    .select(`
      *,
      section:doc_sections(*)
    `)
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
    .limit(20);

  if (error) {
    console.error('Error searching docs:', error);
    return [];
  }

  return ((pages || []) as any[]).map((page: any) => ({
    path: `${page.section.name}/${page.slug}`,
    title: page.title,
    description: page.description,
    category: page.section.name,
    order: page.order_index,
    content: page.content,
  }));
}
