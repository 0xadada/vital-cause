const sanitize = require("sanitize-html");

module.exports = function markdown(context) {
  let cleanTitle = sanitize(context.title.replace(/(\r\n|\n|\r)/gm, ""));
  return `---
layout: ${context.layout}
title: >
  ${cleanTitle}
target: ${context.target}
date: ${context.date}
tags: [webmentions]
generator: ${context.generator}
hidden: true
---

${render(context)}`;
};

function render(context) {
  switch (context.generator) {
    case "twitter.com":
      return twitterContent(context);
    case "news.ycombinator.com":
      return hnContent(context);
    case "spotify.com":
      return spotifyContent(context);
    default:
      return sanitize(context.content);
  }
}

function twitterContent(context) {
  return `
<blockquote>
  <p>
    ${unescape(sanitize(context.content))}
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
  <p class="p-content">${sanitize(context.vendor.parentText)}</p>
  <cite class="p-author">‒<a href="${context.vendor.parentUrl}"
      rel="nofollow external">${context.vendor.parentUsername}</a>
  </cite>
</blockquote>

<p>${sanitize(context.content)}</p>
`;
}

function spotifyContent(context) {
  return `
<a href="${context.target}" title="context.title" rel="external noopener nofollow">
  <img src="${context.vendor.albumCoverUrl}" alt="${context.title}">
</a>
`;
}
