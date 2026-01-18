import fs from 'fs/promises';
import path from 'path';

async function copyDocs() {
  const sourceDir = path.join(process.cwd(), 'docs');
  const targetDir = path.join(process.cwd(), 'client', 'public', 'docs');

  try {
    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Copy all files from docs to public/docs
    await copyDirectory(sourceDir, targetDir);
    
    console.log('✅ Documentation files copied to public/docs');
  } catch (error) {
    console.error('❌ Error copying docs:', error);
  }
}

async function copyDirectory(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  await fs.mkdir(dest, { recursive: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

copyDocs();