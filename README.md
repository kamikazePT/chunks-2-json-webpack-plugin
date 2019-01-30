# chunks-2-json-webpack-plugin
Plugin for webpack 4, that outputs build files to JSON

## Instalation 

```
npm i --save-dev kamikazept-chunks-2-json-webpack-plugin
```

## Use case

Webpack is a great tool and has without a doubt revolutionized the way we build frontend applications. However usually, due to the (great) caching strategy, chunk files will have hash appended to their file name. And if you want to use your build in an env, that does not know 
anything about this, it becomes complicated to inject the build in your app.

Therefore this plugin was build, as it will output your chunks in a JSON file, that will 
allow other apps to understand the structure of the build. 


## Usage example

#### Input

```javascript

const Chunks2JsonPlugin = require('kamikazept-chunks-2-json-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath : '/dist/'
  },
  plugins: [
    new Chunks2JsonPlugin()
  ]
};

```

#### Output

```JSON
{
  "chunk-vendors": {
    "js": ["/js/chunk-vendors.fc40696c.js"],
    "js.map": ["/js/chunk-vendors.fc40696c.js.map"]
  },
  "app": {
    "css": ["/css/app.eb829ccc.css"],
    "js": ["/js/app.dd31cdcb.js"],
    "js.map": ["/js/app.dd31cdcb.js.map"]
  }
}
```

## Options

| Option | Description |
| ------------- |-------------|
| excludeFile | `RegExp` or `function(filename, chunk definition object) => bool`. Exclude dynamic imported chunks and HMR chunks (file names ending with `.hot-update.js`) by default . |
| chunkGroupName | `function(filename, chunk definition object) => string`, generate chunk group name. Group by file extension (or `ext.map`) by default. |
| outputDir | Output folder name. If the folder does not exist, we'll try to create it. Current working directory by default.  |
| filename | Output file name. `build-manifest.json` by default. |

## Questions? 

Feel free to open an issue. 