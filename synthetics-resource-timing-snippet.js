$browser.get('https://newrelic.com').then(function(){
  return $browser.findElement($driver.By.css('h1')).then(function(element){
    return $browser.executeScript(function() {
        let performance = window.performance;
        let performanceEntries = performance.getEntriesByType('paint');
        return performanceEntries;
    }).then(function(r){
      r.forEach( (performanceEntry, i, entries) => {
        console.log("The time to " + performanceEntry.name + " was " + performanceEntry.startTime + " milliseconds.");
      });
    });
  });
});
