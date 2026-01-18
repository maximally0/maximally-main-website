# SEO Quick Reference Guide

## Adding SEO to New Pages

### 1. Import the SEO Component

```tsx
import SEO from '@/components/SEO';
```

### 2. Basic Page SEO

```tsx
function MyPage() {
  return (
    <>
      <SEO
        title="Page Title - Maximally"
        description="A compelling description of your page (150-160 characters)"
        keywords="keyword1, keyword2, keyword3"
      />
      
      {/* Your page content */}
    </>
  );
}
```

### 3. Blog Post SEO

```tsx
<SEO
  title="Blog Post Title - Maximally Blog"
  description="Blog post description"
  keywords="blog, topic, keywords"
  article={true}
  author="Author Name"
  publishedTime="2025-01-18T00:00:00Z"
  modifiedTime="2025-01-18T00:00:00Z"
  section="Blog Category"
  image="https://maximally.in/blog-image.jpg"
/>
```

### 4. Documentation Page SEO

```tsx
<SEO
  title="Doc Title - Maximally Documentation"
  description="Documentation page description"
  keywords="docs, guide, tutorial"
  breadcrumbs={[
    { name: "Home", url: "/" },
    { name: "Documentation", url: "/docs" },
    { name: "Section", url: "/docs/section" },
    { name: "Page", url: "/docs/section/page" }
  ]}
  structuredData={{
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Doc Title",
    "description": "Doc description"
  }}
/>
```

### 5. Event Page SEO

```tsx
<SEO
  title="Event Name - Maximally Hackathon"
  description="Event description with dates and details"
  keywords="hackathon, event, coding competition"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Event Name",
    "startDate": "2025-02-01T09:00:00Z",
    "endDate": "2025-02-03T18:00:00Z",
    "location": {
      "@type": "VirtualLocation",
      "url": "https://maximally.in/event-slug"
    },
    "description": "Event description",
    "organizer": {
      "@type": "Organization",
      "name": "Maximally"
    }
  }}
/>
```

## SEO Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | No | Page title (default: "Maximally - Global Teen Hackathon Platform") |
| `description` | string | No | Meta description (150-160 chars recommended) |
| `keywords` | string | No | Comma-separated keywords |
| `image` | string | No | OG image URL (1200x630px recommended) |
| `canonicalUrl` | string | No | Canonical URL (auto-generated from pathname) |
| `article` | boolean | No | Set to true for blog posts |
| `author` | string | No | Author name (for articles) |
| `publishedTime` | string | No | ISO 8601 date (for articles) |
| `modifiedTime` | string | No | ISO 8601 date (for articles) |
| `section` | string | No | Article section/category |
| `noindex` | boolean | No | Prevent indexing (default: false) |
| `breadcrumbs` | array | No | Breadcrumb navigation array |
| `structuredData` | object | No | Additional JSON-LD structured data |

## Best Practices

### Title Tags
- Keep under 60 characters
- Include primary keyword
- Make it compelling and unique
- Include brand name at the end

**Good**: "AI Hackathon Guide for Teens - Maximally"
**Bad**: "Maximally | AI Hackathon Guide for Teens and Students"

### Meta Descriptions
- Keep between 150-160 characters
- Include primary keyword naturally
- Make it actionable and compelling
- Accurately describe the page content

**Good**: "Learn how to participate in AI hackathons with our comprehensive guide. Get tips, resources, and step-by-step instructions for teen developers."
**Bad**: "This page is about AI hackathons and how teens can participate in them and learn coding."

### Keywords
- Use 5-10 relevant keywords
- Include primary and secondary keywords
- Use long-tail keywords
- Avoid keyword stuffing

**Good**: "AI hackathon, teen coding competition, student hackathon guide, beginner AI projects"
**Bad**: "hackathon, hackathon, hackathon, coding, coding, coding, AI, AI, AI"

### Images
- Use descriptive file names
- Add alt text to all images
- Optimize file size (< 200KB)
- Use proper dimensions (1200x630 for OG images)

### URLs
- Keep URLs short and descriptive
- Use hyphens to separate words
- Include primary keyword
- Avoid special characters

**Good**: `/blog/ai-hackathon-guide-for-teens`
**Bad**: `/blog/post?id=12345&category=ai`

## Structured Data Examples

### Article
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "image": "https://maximally.in/image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Maximally",
    "logo": {
      "@type": "ImageObject",
      "url": "https://maximally.in/logo.png"
    }
  },
  "datePublished": "2025-01-18",
  "dateModified": "2025-01-18"
}
```

### Event
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Hackathon Name",
  "startDate": "2025-02-01T09:00:00Z",
  "endDate": "2025-02-03T18:00:00Z",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://maximally.in/event"
  },
  "description": "Event description",
  "organizer": {
    "@type": "Organization",
    "name": "Maximally",
    "url": "https://maximally.in"
  }
}
```

### FAQ
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text"
      }
    }
  ]
}
```

## Adding Pages to Sitemap

When creating new pages, add them to `client/public/sitemap.xml`:

```xml
<url>
  <loc>https://maximally.in/new-page</loc>
  <priority>0.7</priority>
  <changefreq>monthly</changefreq>
  <lastmod>2025-01-18</lastmod>
</url>
```

### Priority Guidelines:
- Homepage: 1.0
- Main sections: 0.9
- Important pages: 0.8
- Regular pages: 0.7
- Blog posts: 0.7
- Archive pages: 0.5
- Legal pages: 0.3

### Change Frequency:
- Homepage: weekly
- Blog index: daily
- Documentation: monthly
- Blog posts: monthly
- Static pages: yearly

## Testing Your SEO

### Tools:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Markup Validator**: https://validator.schema.org/
3. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
5. **PageSpeed Insights**: https://pagespeed.web.dev/

### Checklist:
- [ ] Title tag is unique and under 60 characters
- [ ] Meta description is compelling and 150-160 characters
- [ ] Keywords are relevant and not stuffed
- [ ] Image has proper dimensions (1200x630)
- [ ] Canonical URL is correct
- [ ] Structured data validates without errors
- [ ] Page loads in under 3 seconds
- [ ] Mobile-friendly
- [ ] All links work
- [ ] Images have alt text

## Common Mistakes to Avoid

1. **Duplicate Content**: Each page should have unique content
2. **Missing Meta Descriptions**: Every page needs a description
3. **Broken Links**: Check all internal and external links
4. **Slow Page Speed**: Optimize images and code
5. **Missing Alt Text**: Add descriptive alt text to all images
6. **Keyword Stuffing**: Use keywords naturally
7. **Thin Content**: Provide substantial, valuable content
8. **Missing Mobile Optimization**: Ensure responsive design
9. **Ignoring Analytics**: Monitor and adjust based on data
10. **Not Updating Sitemap**: Keep sitemap current

## Need Help?

- Documentation: https://maximally.in/docs
- Support: support@maximally.in
- Discord: https://discord.gg/maximally

---

**Last Updated**: January 18, 2025
