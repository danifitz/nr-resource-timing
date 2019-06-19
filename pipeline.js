const fs = require('fs')
const minify = require('minify')

let toMinify = [
  'nr-resource-timing-snippet.js'
]

toMinify.forEach( (element) => {
    minify(`./src/${element}`)
        .then( (data) => {
            fs.writeFile(`./dist/${element.substring(0, element.lastIndexOf('.'))}.min.js`, data, (err) => {
                if (err) console.log(err);
                console.log(`Minified ${element}`);
            });
        })
        .catch(console.error);
})
