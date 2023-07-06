+++
title = "Set Default pdf.js Settings in Firefox"
date  = 2021-12-09

[extra]
author = "Peter Kos"

[taxonomies]
tags = []
+++

I wanted a way to set some default parameters in Firefox's PDF viewer to view class lecture notes. No sidebar, `page-fit` view.

<!-- more -->


Turns out it's easy!

From [support.mozilla.org](https://support.mozilla.org/en-US/questions/1074524):
1. Navigate to `about:config` in a new tab
2. Change value of `pdfjs.defaultZoomValue` to `page-fit`
3. Change value of `pdfjs.sidebarViewOnLoad` to `0`

Done!

