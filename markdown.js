module.exports = function markdown(context) {
  return `---
layout: ${context.layout}
title: >
  ${context.title}
target: ${context.target}
date: ${context.date}
tags: [webmentions]
generator: ${context.generator}
hidden: true
---

${renderContent(context)}
`;
};

function renderContent(context) {
  switch (context.generator) {
    case "twitter.com":
      return twitterContent(context);
    case "news.ycombinator.com":
      return hnContent(context);
    case "spotify.com":
      return spotifyContent(context);
    default:
      return context.content;
  }
}

function twitterContent(context) {
  return `
<blockquote>
  <p>
    ${unescape(context.content)}
  </p>
  <cite>‒<span class="p-author p-name">${context.vendor.username}</span>
    on
    <a href="${context.target}" rel="external nofollow">${context.date}</a>
  </cite>
</blockquote>
`;
}

function hnContent(context) {
  return `
<blockquote class="p-in-reply-to h-cite">
  <p class="p-content">${context.vendor.parentText}</p>
  <cite class="p-author">‒<a href="${context.vendor.parentUrl}"
      rel="nofollow external">${context.vendor.parentUsername}</a>
  </cite>
</blockquote>

<p>${context.content}</p>
`;
}

function spotifyContent(context) {
  return `
<a href="${context.target}" title="context.title" rel="external noopener nofollow">
  <img src="${context.vendor.albumCoverUrl}" alt="${context.title}">
</a>
`;
}
