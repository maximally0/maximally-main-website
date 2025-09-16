# Dynamic Hackathon Page - Slug Access Guide

This guide explains how the slug parameter is accessed and used in the DynamicHackathon component for creating dynamic hackathon pages.

## Overview

The DynamicHackathon page uses React Router to dynamically fetch and display hackathon data based on a URL slug parameter. The slug serves as a unique identifier for each hackathon event.

## URL Structure

The expected URL format is:
```
/hackathon/{slug}
```

Examples:
- `/hackathon/ai-shipathon` → loads AI Shipathon data
- `/hackathon/protocol-404` → loads Protocol 404 data
- `/hackathon/maximally-hacktober` → loads Hacktober data

## Implementation Details

### 1. Extracting the Slug

The slug is extracted using React Router's `useParams` hook:

```typescript
import { useParams } from 'react-router-dom';

export default function DynamicHackathon() {
  const { slug } = useParams<{ slug: string }>();
  
  // The slug variable now contains the value from the URL
  // e.g., if URL is /hackathon/ai-shipathon, slug = "ai-shipathon"
}
```

### 2. Data Fetching with Slug

The slug is used to fetch specific hackathon data from the backend API:

```typescript
useEffect(() => {
  const fetchHackathon = async () => {
    if (!slug) return; // Guard clause for missing slug
    
    try {
      const response = await fetch(`/api/hackathons/${slug}`);
      if (!response.ok) {
        throw new Error('Hackathon not found');
      }
      const data = await response.json();
      setHackathon(data);
      setIsVisible(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hackathon');
    } finally {
      setLoading(false);
    }
  };

  fetchHackathon();
}, [slug]); // Re-run when slug changes
```

### 3. Backend API Route

The server handles the slug parameter in the API route:

```typescript
app.get("/api/hackathons/:slug", async (req, res) => {
  try {
    const { slug } = req.params; // Extract slug from URL parameters
    const hackathon = await storage.getHackathon(slug);
    
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }
    
    res.json(hackathon);
  } catch (error) {
    console.error("Error fetching hackathon:", error);
    res.status(500).json({ error: "Failed to fetch hackathon" });
  }
});
```

## Database Schema

The hackathon data includes the following key fields:

```typescript
interface HackathonData {
  id: number;
  slug: string; // URL-friendly identifier
  title: string;
  subtitle?: string;
  tagline: string;
  badge_text?: string;
  description: string;
  registration_url?: string;
  start_date: string;
  end_date: string;
  duration: string;
  format: string;
  team_size: string;
  judging_type: string;
  results_date: string;
  what_it_is: string;
  the_idea: string;
  who_joins: string[];
  tech_rules: string[];
  fun_awards: string[];
  perks: string[];
  cash_pool?: string;
  judging_description: string;
  judging_criteria: string;
  required_submissions: string[];
  optional_submissions?: string[];
  theme_color_primary: string;
  theme_color_secondary: string;
  theme_color_accent: string;
  theme_config?: {
    fonts?: { ... };
    colors?: { ... };
    spacing?: { ... };
    animations?: { ... };
    layout?: { ... };
    svgElements?: { ... };
    customCSS?: { ... };
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

## Error Handling

### Missing Slug Protection
```typescript
if (!slug) return; // Prevents API call with undefined slug
```

### 404 Error Display
```typescript
if (error || !hackathon) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-press-start text-2xl text-red-500 mb-4">404</h1>
        <p className="text-white">Hackathon not found</p>
      </div>
    </div>
  );
}
```

## Dynamic Theming

The component applies dynamic theming based on the hackathon's theme configuration:

```typescript
// Apply theme CSS variables to document root
useEffect(() => {
  if (!hackathon) return;

  const theme = hackathon.theme_config || {};
  const colors = theme.colors || {};
  const root = document.documentElement;
  
  // Apply theme colors
  root.style.setProperty('--color-primary', colors.primary || hackathon.theme_color_primary);
  root.style.setProperty('--color-secondary', colors.secondary || hackathon.theme_color_secondary);
  root.style.setProperty('--color-accent', colors.accent || hackathon.theme_color_accent);
  
  // Cleanup on unmount
  return () => {
    // Remove CSS variables
  };
}, [hackathon]);
```

## SEO Integration

The slug is used for SEO optimization:

```typescript
<SEO
  title={`${hackathon.title} - ${hackathon.tagline}`}
  description={hackathon.description}
  keywords={`hackathon, ${hackathon.slug}, coding competition, ${hackathon.format.toLowerCase()}`}
/>
```

## Loading States

The component manages three main states:

1. **Loading**: Shows while fetching data for the slug
2. **Error/404**: Shows when slug doesn't match any hackathon
3. **Success**: Renders the full hackathon page with dynamic theming

## Usage Examples

### Accessing Current Slug
```typescript
const { slug } = useParams<{ slug: string }>();
console.log('Current hackathon slug:', slug);
```

### Conditional Rendering Based on Slug
```typescript
{slug === 'ai-shipathon' && (
  <div>Special content for AI Shipathon</div>
)}
```

### Navigation to Dynamic Pages
```typescript
// Navigate to specific hackathon
<Link to={`/hackathon/${hackathonSlug}`}>
  View Hackathon Details
</Link>
```

## Best Practices

1. **URL-Friendly Slugs**: Use lowercase letters, numbers, and hyphens only
2. **Unique Slugs**: Ensure each hackathon has a unique slug
3. **SEO Optimization**: Keep slugs descriptive but concise
4. **Error Handling**: Always validate slug existence before processing
5. **Type Safety**: Use TypeScript generics with useParams

## Testing

To test the dynamic hackathon functionality:

1. Navigate to `/hackathon/test-slug`
2. Check if proper error handling shows for non-existent slugs
3. Verify theme application works correctly
4. Test responsive design across devices
5. Confirm SEO meta tags are properly set

## Database Operations

### Creating New Hackathon
```typescript
const newHackathon = {
  slug: 'my-new-hackathon',
  title: 'My New Hackathon',
  // ... other fields
};
await storage.createHackathon(newHackathon);
```

### Updating Existing Hackathon
```typescript
await storage.updateHackathon(slug, updatedData);
```

### Deleting Hackathon
```typescript
await storage.deleteHackathon(slug);
```

This dynamic implementation allows for scalable hackathon management while maintaining clean URLs and consistent user experience.