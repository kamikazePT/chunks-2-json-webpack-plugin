const fs = require('fs');
const path = require('path');
const isnil = require('lodash.isnil');

/**
 * Modified from https://github.com/mrTimofey/chunks-2-json-webpack-plugin/blob/master/index.js
 */

const pluginName = 'Chunks2JsonWebpackPlugin';

const defaultOptions = {
  // ignore files emitted by HMR and dynamic import by default
  excludeFile: (filename, chunk) => isnil(chunk.name) || /\.hot-update\.js$/.test(filename),
  // group chunks by extension
  chunkGroupName: filename => /\.([a-z0-9]+(\.map)?)(\?.*)?$/.exec(filename)[1],
  outputDir: path.normalize(process.cwd(), 'dist'),
  filename: 'build-manifest',
  isProduction: false
};

class Chunks2JsonWebpackPlugin {
  constructor(options) {
      this.options = Object.assign({}, defaultOptions, options);
      this.result = {};
  }

  apply(compiler) {
    compiler.hooks.emit.tap(pluginName, compilation => {
      const publicPath = compiler.options.output.publicPath;
      this.result = {};
      compilation.chunks.forEach(chunk => {
        chunk.files.forEach(filename => {
          const exclude = typeof this.options.excludeFile === 'function' ?
            this.options.excludeFile(filename, chunk) :
            this.options.excludeFile.test(filename);

          if (!exclude) {
            if (!this.result[chunk.name]) {
              this.result[chunk.name] = {};
            }

            const ext = this.options.chunkGroupName(filename, chunk);
            if (!this.result[chunk.name][ext]) this.result[chunk.name][ext] = [];
            this.result[chunk.name][ext].push(path.normalize(publicPath + filename));
          }
        });
      });
      this.saveJson();
    });
  }

  saveJson() {
    try {
        fs.mkdirSync(this.options.outputDir, { recursive: true });
    } catch (e) {
      console.log(e);
      // we don't care if it already exists, just continue...
    }

    const file = path.resolve(this.options.outputDir, this.options.filename + '.json');
    const blob = JSON.stringify(this.result, null, this.options.isProduction ? null : 2);
    
    fs.writeFileSync(file, blob, { flag: 'w' });
  }
}

module.exports = Chunks2JsonWebpackPlugin;