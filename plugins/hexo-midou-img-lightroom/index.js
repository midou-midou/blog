'use strict';

// Filter: after_post_render - 用 <a class="glightbox"> 包裹 <img>
hexo.extend.filter.register('after_post_render', function (data) {
  const config = hexo.theme.config['midou-lightroom'] || {};
  if (!config.enable) return data;

  // 匹配 <a...><img...></a>（已包裹的跳过）和单独的 <img...>（需要包裹）
  data.content = data.content.replace(
    /(<a[^>]*>)?\s*(<img\s[^>]*src="([^"]+)"[^>]*\/?>)\s*(<\/a>)?/gi,
    function (match, openA, imgTag, src, closeA) {
      if (openA && closeA) {
        // 已经在 <a> 标签内，不重复包裹
        return match;
      }
      return '<a class="glightbox" href="' + src + '">' + imgTag + '</a>';
    }
  );

  return data;
}, 10);

