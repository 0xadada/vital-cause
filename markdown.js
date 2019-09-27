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

${
  context.generator === "twitter.com"
    ? twitterContent(context)
    : context.content
}
`;
};

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
