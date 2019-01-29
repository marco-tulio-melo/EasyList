const path = require('path');
 
module.exports = {
  mode: 'production',
  entry: './www/js/app/index.js',
  output: {
    path: path.resolve(__dirname, './www/dist'),
    filename: 'bundle.js'
  }

};