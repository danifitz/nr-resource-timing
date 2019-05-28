# Overview

This JavaScript snippet can be placed your website to capture resource timings which can then
be queried in New Relic Insights. The snippet uses the [Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API) to capture the metrics associated with assets loaded on the page

This snippet will ask capture `First Paint` and `First Contentful Paint` from supported browsers.

Finally, we also capture Asset Budgets. This is the total number and size of all the CSS, JS and Images on a page.

## Usage

Add the code in `nr-resource-timing-snippet.js` inside a `<script></script>` tag in the `<head>` of your page(s)

First Paint and Asset Budgets are captured as attributes of the `PageView` event in Insights. Individual
resource timings such as the duration and the size of a specific image are captured as a `PageAction` event.

Resource timings use the `actionName` attributed on the `PageAction` event to indicate if it's a `jsResourceTiming`,
`imgResourceTiming` or `cssResourceTiming` event, for example to get all `jsResourceTiming` events in the last 30 minutes:

`SELECT count(*) FROM PageAction WHERE actionName = 'jsResourceTiming' SINCE 30 minutes ago`