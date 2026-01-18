# Maximally Documentation

This directory contains all documentation files for the Maximally platform. The documentation is automatically rendered on the website at `/docs`.

## Structure

- `getting-started/` - Getting started guides
- `platform/` - Platform features and functionality
- `api/` - API documentation
- `guides/` - Step-by-step guides
- `reference/` - Reference materials

## Writing Documentation

- Use Markdown (.md) or MDX (.mdx) files
- Follow the naming convention: lowercase with hyphens
- Include frontmatter for metadata
- Use relative links for internal references

## Frontmatter Format

```yaml
---
title: "Page Title"
description: "Brief description of the page"
category: "getting-started" | "platform" | "api" | "guides" | "reference"
order: 1
---
```