/**
 * Upload Cloudinary export images to Supabase Storage and update DB URLs.
 * Run: npm run migrate:images
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(__dirname, '..', 'data', 'cloudinary-export', '_manifest.json');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MIME = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

function extFromUrl(url) {
  const ext = path.extname(new URL(url).pathname).slice(1).toLowerCase();
  return ext === 'jpeg' ? 'jpg' : ext || 'jpg';
}

function resolveLocalFile(localPath, url) {
  if (fs.existsSync(localPath)) return localPath;
  const ext = extFromUrl(url);
  const withExt = `${localPath}.${ext}`;
  if (fs.existsSync(withExt)) return withExt;
  throw new Error(`Local file not found: ${localPath}`);
}

function bucketForPublicId(publicId) {
  if (publicId.startsWith('banners/')) return 'banners';
  if (publicId.startsWith('blog/')) return 'blog-covers';
  if (publicId.startsWith('tutors/')) return 'tutors';
  if (publicId.startsWith('courses/')) return 'gallery';
  return 'tutors';
}

function storagePath(publicId, ext) {
  const base = path.basename(publicId);
  if (publicId.startsWith('courses/')) return `classes/${base}.${ext}`;
  return `${base}.${ext}`;
}

async function uploadFile(bucket, storageKey, filePath, contentType) {
  const body = fs.readFileSync(filePath);
  const { error } = await supabase.storage.from(bucket).upload(storageKey, body, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Upload ${bucket}/${storageKey}: ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(storageKey);
  return data.publicUrl;
}

async function replaceUrls(table, column) {
  const { data: rows, error } = await supabase.from(table).select(`id, ${column}`);
  if (error) throw new Error(`${table}: ${error.message}`);

  let updated = 0;
  for (const row of rows ?? []) {
    const oldUrl = row[column];
    if (!oldUrl || !oldUrl.includes('cloudinary.com')) continue;
    const newUrl = urlMap.get(oldUrl);
    if (!newUrl) {
      console.warn(`  ⚠ No mapping for ${table}.${column} id=${row.id}`);
      continue;
    }
    const { error: updateError } = await supabase
      .from(table)
      .update({ [column]: newUrl })
      .eq('id', row.id);
    if (updateError) throw new Error(`Update ${table}/${row.id}: ${updateError.message}`);
    updated++;
  }
  return updated;
}

const urlMap = new Map();

async function main() {
  console.log('📦 Migrating Cloudinary images → Supabase Storage...\n');

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const files = manifest.files ?? [];
  let uploaded = 0;
  let skipped = 0;

  for (const entry of files) {
    if (urlMap.has(entry.url)) {
      skipped++;
      continue;
    }

    const ext = extFromUrl(entry.url);
    const localFile = resolveLocalFile(entry.localPath, entry.url);
    const bucket = bucketForPublicId(entry.publicId);
    const key = storagePath(entry.publicId, ext);
    const contentType = MIME[ext] ?? 'image/jpeg';

    const publicUrl = await uploadFile(bucket, key, localFile, contentType);
    urlMap.set(entry.url, publicUrl);
    uploaded++;
    console.log(`  ↑ ${bucket}/${key}`);
  }

  console.log(`\n✅ Uploaded ${uploaded} files (${skipped} duplicate URLs skipped)`);
  console.log('\n🔄 Updating database URLs...');

  const bannerCount = await replaceUrls('banners', 'imageUrl');
  const classCount = await replaceUrls('classes', 'imageUrl');
  const tutorCount = await replaceUrls('tutors', 'imageUrl');
  const blogCount = await replaceUrls('blog_posts', 'coverImageUrl');

  console.log(`  banners: ${bannerCount}`);
  console.log(`  classes: ${classCount}`);
  console.log(`  tutors: ${tutorCount}`);
  console.log(`  blog_posts: ${blogCount}`);
  console.log('\n🎉 Image migration complete!');
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
