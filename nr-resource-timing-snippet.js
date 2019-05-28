// indicates if the script should log to the console
const logToConsole = 1;
const measureAssetBudgets = 1;

function getPaintTimings() {
    if (
      !("performance" in window) ||
      !("getEntriesByType" in window.performance) ||
      !(window.performance.getEntriesByType("paint") instanceof Array)
    ) {
        consoleLogger(logToConsole, "performance NOT supported by Browser");
    } 
    else 
    { 
          let performance = window.performance;
          let performanceEntries = performance.getEntriesByType('paint');
          performanceEntries.forEach( (performanceEntry, i, entries) => {
            to_seconds = 0;
            to_seconds = performanceEntry.startTime / 1000;
            newrelic.setCustomAttribute(performanceEntry.name, to_seconds);
            consoleLogger(logToConsole, performanceEntry.name + " - seconds: " + to_seconds + ", milliseconds: " + performanceEntry.startTime);
          });
    }
  }

// Measures timings of page resources (CSS, JS, Images)
// Timings get added to the PageAction event type in New Relic Insights
function getResourceTimings() {
    // let's make sure the agent is present
    if(newrelic != undefined && typeof newrelic == 'object') {
        consoleLogger(logToConsole, 'loaded')
        if(
            !("performance" in window) ||
            !("getEntriesByType" in window.performance) ||
            !(window.performance.getEntriesByType('resource') instanceof Array)
         ) {
            consoleLogger(logToConsole, "performance NOT supported by Browser");
        } else {
            let performance = window.performance
            let performanceEntries = performance.getEntriesByType('resource')

            // iterate over resource entries
            performanceEntries.forEach(function(resource, arrayIndex) {
                
                // Measure JavaScript resource performance
                if(resource.initiatorType == 'script') {
                    consoleLogger(logToConsole, 'sending NR JS Resource Timing ' + arrayIndex)
                    
                    // collect some attributes to send to New Relic (all in Seconds)
                    var attributes = {}
                    attributes.name = resource.name
                    attributes.duration = resource.duration / 1000
                    attributes.transferSize = resource.transferSize / 1000
                    attributes.responseEnd = resource.responseEnd / 1000
        
                    newrelic.addPageAction('jsResourceTiming', attributes)
                }

                // Measure Image resource performance
                if(resource.initiatorType == 'img') {
                    consoleLogger(logToConsole, 'sending NR Image Resource Timing ' + arrayIndex)
                    
                    // collect some attributes to send to New Relic
                    // there's a lot more available but this is MVP
                    var attributes = {}
                    attributes.name = resource.name
                    attributes.duration = resource.duration / 1000
                    attributes.transferSize = resource.transferSize / 1000
                    attributes.responseEnd = resource.responseEnd / 1000
                    
                    // adding as a page action allows us to add a bunch of attributes for each image
                    newrelic.addPageAction('imageResourceTiming', attributes)
                }

                // Measure CSS resource performance
                if(resource.initiatorType == 'css') {
                    consoleLogger(logToConsole, 'sending NR CSS Resource Timing ' + arrayIndex)

                    // collect some attributes to send to New Relic
                    // there's a lot more available but this is MVP
                    var attributes = {}
                    attributes.name = resource.name
                    attributes.duration = resource.duration / 1000
                    attributes.transferSize = resource.transferSize / 1000
                    attributes.responseEnd = resource.responseEnd / 1000

                    newrelic.addPageAction('cssResourceTiming', attributes)
                }
            })
        }
    } else {
        consoleLogger(logToConsole, "-> NR custom Image Resource Timing script - newrelic object not found, make sure the new relic agent is present on this page")
    }
}

// Calculate Asset budgets for the page i.e. total no. images, js, css and their size
// Gets added to PageView event type in New Relic Insights
function getAssetBudgets() { 
    if (
      !("performance" in window) ||
      !("getEntriesByType" in window.performance) ||
      !(window.performance.getEntriesByType("resource") instanceof Array)
    ) 
    {
      consoleLogger(logToConsole, "performance NOT supported by Browser" );
    } 
    else 
    { 
        var assets = 0; var assets_all_size = 0;
        var image_count = 0; var image_all_size = 0;
        var script_count = 0; var script_all_size = 0;
        var css_count = 0; var css_all_size = 0;
        var other_count = 0; var other_all_size = 0;
        var cache_count = 0;
        var resources = window.performance.getEntriesByType("resource");
  
        for (var index in resources) 
        {
          var name = resources[index]["name"];
          var transferSize = resources[index]["transferSize"] / 1000;
          var duration = resources[index]["duration"] / 1000;
          var responseEnd = resources[index]["responseEnd"] / 1000;        
          assets++;
          assets_all_size += transferSize; 
          
          if(transferSize == 0) {
            cache_count++;
          }
          if (resources[index]["initiatorType"] == "img") {
            image_count++;
            image_all_size += transferSize;
  
          }
          else if (resources[index]["initiatorType"] == "script") {
            script_count++;
            script_all_size += transferSize;
          }
          else if (resources[index]["initiatorType"] == "css") {
            css_count++;
            css_all_size += transferSize;
          }
          else {
            other_count++;
            other_all_size += transferSize;          
          }
        }
          if (typeof newrelic == 'object') {
            // 12 new attributes to play with         
            newrelic.setCustomAttribute('budgetTotalAssets', assets);
            newrelic.setCustomAttribute('budgetTotalAssetsSize', assets_all_size);
            newrelic.setCustomAttribute('budgetTotalImages', image_count);
            newrelic.setCustomAttribute('budgetTotalImagesSize', image_all_size);
            newrelic.setCustomAttribute('budgetTotalScripts', script_count);
            newrelic.setCustomAttribute('budgetTotalScriptsSize', script_all_size);
            newrelic.setCustomAttribute('budgetTotalCSS', css_count);
            newrelic.setCustomAttribute('budgetTotalCSSSize', css_all_size);
            newrelic.setCustomAttribute('budgetTotalOther', other_count);
            newrelic.setCustomAttribute('budgetTotalOtherSize', other_all_size);
            newrelic.setCustomAttribute('budgetCachedAssets', cache_count);
          }
          consoleLogger(logToConsole,"Total Assets: " + assets + " | Total Assets Size: " + assets_all_size + "kB");
          consoleLogger(logToConsole,"Total Images: " + image_count + " | Total Images Size: " + image_all_size + "kB");
          consoleLogger(logToConsole,"Total Scripts: " + script_count + " | Total Scripts Size: "+ script_all_size + "kB");
          consoleLogger(logToConsole,"Total Css: " + css_count + " | Total CSS Size: " + css_all_size + "kB");
          consoleLogger(logToConsole,"Total Other: " + other_count + " | Total Other Size: " + other_all_size + "kB");
          consoleLogger(logToConsole,"Cached Resources : " + cache_count);
    }
  }


function consoleLogger(isLoggingOn, msg) {
  if (isLoggingOn == 1) { console.log('-> NR First Paint & Resource Timing script: ' + msg + ' ->'); }
}

window.addEventListener('load', function() {
    var t0 = performance.now()
    getPaintTimings()
    getResourceTimings()
    if(measureAssetBudgets) getAssetBudgets()
    var t1 = performance.now()
    var totalTime = (t1 - t0) / 1000;
    consoleLogger("Overhead of this script: " + totalTime + "seconds - it began at : " + t0 + " and ended at : " +t1)
})