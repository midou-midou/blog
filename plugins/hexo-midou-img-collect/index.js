'use strict';

const fs = require('fs');
const path = require('path');

const IMAGE_EXT = /\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)$/i;

let afterGenerateExecuted = false;
hexo.extend.filter.register('after_generate', function (data) {
  if (afterGenerateExecuted) return data;
  afterGenerateExecuted = true;
  const postsDir = path.join(hexo.source_dir, '_posts');
  const imagesDir = path.join(hexo.source_dir, 'image');

  console.info('开始复制图片到image文件夹')
  // Ensure images directory exists
  fs.mkdirSync(imagesDir, { recursive: true });

  // Recursively find all image files under _posts, skipping dot dirs
  const walk = function (dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file.startsWith('.')) continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results.push(...walk(fullPath));
      } else if (IMAGE_EXT.test(file)) {
        results.push(fullPath);
      }
    }
    return results;
  };

  const imageFiles = walk(postsDir);

  for (const imgPath of imageFiles) {
    // Relative path from _posts, e.g. midou-notes/CSS/层叠/image.png
    const relFromPosts = path.relative(postsDir, imgPath);
    const destPath = path.join(imagesDir, relFromPosts);

    // Ensure dest parent dir exists then copy
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(imgPath, destPath);
  }

  return data;
}, 1);

// Replace relative img src paths (starting with ./) with /images path
hexo.extend.filter.register('after_post_render', function (data) {

  // Match <img src="./..." or <img src="../..." and rewrite to /images/...
  // Resolve relative path based on the post's source file location
  const postsDir = path.join(hexo.source_dir, '_posts');
  const postRelPath = data.source; // e.g. /CSS/层叠/层叠.md
  const postDir = path.dirname( postRelPath); // directory of the post 

  data.content = data.content.replace(/<img\s[^>]*src="(\/\.[^"]+)"[^>]*>/gi, function (match, src) {
    // Resolve the relative src against the post's directory

    const resolved = path.join(postDir.replace(/^_posts\//, ''), src.replace(/^\//, ''))

    const newSrc = path.join('/image', resolved)
    return match.replace('src="' + src + '"', 'src="' + newSrc + '"');
  });

  return data;
}, 9);
