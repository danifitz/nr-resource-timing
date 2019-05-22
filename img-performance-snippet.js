console.log('-> NR custom Image Resource Timing script loaded ->')
if(window.performance === undefined) {
    console.log("-> NR custom Image Resource Timing script: performance NOT supported ->");
} else {
    window.performance.getEntriesByType('resource').forEach(function(resource, arrayIndex) {
        let resourceExtension = resource.name.substring(resource.name.lastIndexOf('.'), resource.name.length + 1)
        
        // Use a regular expression to see if the file extension matches common image types
        if(resourceExtension.match(/^(.jpg|.png|.gif|.svf|.tif)$/)) {
            console.log('-> Sending NR custom Image Resource Timing ->', arrayIndex)
            
            // collect some attributes to send to New Relic
            // there's a lot more available but this is MVP
            let attributes = {}
            attributes.imageLoadduration = resource.duration
            attributes.name = resource.name
            attributes.transferSize = resource.transferSize

            newrelic.addPageAction('imageResourceTiming', attributes)
        }
    })
}