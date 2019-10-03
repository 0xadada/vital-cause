const Handlebars = require('handlebars');

const TEMPLATE = `---
hidden: true
layout: {{layout}}
title: {{title}}
target: {{target}}
date: {{date}}
tags: [webmentions]
generator: {{generator}}
---


{{#equals generator "app.getpocket.com"}}
{{content}}
{{/equals}}

{{#equals generator "twitter.com"}}
<blockquote class="external-citation">
  <p>
    {{content}}
  </p>
  <cite>‒<span class="p-author p-name">{{vendor.username}}</span>
    on
    <a href="{{target}}" rel="external nofollow" target="_blank">{{date}}</a>
  </cite>
</blockquote>
{{/equals}}

{{#equals generator 'news.ycombinator.com'}}
<blockquote class="p-in-reply-to h-cite external-citation">
  <p class="p-content">{{vendor.parentText}}</p>
  <cite class="p-author">‒<a href="{{vendor.parentUrl}}"
    rel="nofollow external noopener" target="_blank">{{vendor.parentUsername}}</a>
  </cite>
</blockquote>
{{/equals}}

{{#equals generator "spotify.com"}}
<a href="{{target}}" title="{{title}}" rel="external noopener nofollow" target="_blank">
  <img src="{{vendor.albumCoverUrl}}" alt="{{title}}">
</a>
{{/equals}}

{{#equals generator "youtube.com"}}
{{{content}}}
{{/equals}}
`;

module.exports = function markdown(context) {
  // remove line-breaks from title
  context.title = context.title.replace(/(\r\n|\n|\r)/gm, '');

  // create an `{{#equals}}` helper
  Handlebars.registerHelper('equals', function(arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  // render the template
  let render = Handlebars.compile(TEMPLATE);
  return render(context);
};
