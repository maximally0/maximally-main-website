# Supabase Storage Buckets

This document describes all storage buckets, their visibility, limits, and intended usage.

---

## report-screenshots
- **Visibility:** Public
- **Policies:** 2
- **Max file size:** 50 MB (default)
- **Allowed MIME types:** Any
- **Purpose:**  
  Stores screenshots uploaded in reports (bug reports, issue submissions, etc.).

---

## project-logos
- **Visibility:** Public
- **Policies:** 3
- **Max file size:** 5 MB
- **Allowed MIME types:**  
  - image/jpeg  
  - image/png  
  - image/webp  
  - image/svg+xml
- **Purpose:**  
  Stores logos for projects.

---

## hackathon-logos
- **Visibility:** Public
- **Policies:** 3
- **Max file size:** 5 MB
- **Allowed MIME types:**  
  - image/jpeg  
  - image/png  
  - image/webp  
  - image/svg+xml
- **Purpose:**  
  Stores logos related to hackathons.

---

## certificates
- **Visibility:** Private (default)
- **Policies:** 0
- **Max file size:** 50 MB (default)
- **Allowed MIME types:** Any
- **Purpose:**  
  Stores generated certificates (PDFs or images).  
  Access should be restricted or provided via signed URLs.

---

## avatar
- **Visibility:** Public
- **Policies:** 1
- **Max file size:** 50 MB (default)
- **Allowed MIME types:** Any
- **Purpose:**  
  Stores user profile avatars.

---

## blog-images
- **Visibility:** Public
- **Policies:** 4
- **Max file size:** 50 MB (default)
- **Allowed MIME types:** Any
- **Purpose:**  
  Stores images used in blog posts and articles.

---
