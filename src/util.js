var glob = require("glob")
const Spritesmith = require('spritesmith');
const mkdirp = require('mkdirp')
const fs = require("fs")
const path = require("path");

const getPaths = (globPath, cwd) => {
  return new Promise((resolve, reject) => {
    glob(globPath, {
      cwd
    }, function (er, files) {
      if (er) {
        console.err(er)
      } else {
        resolve(files)
      }
    })
  })
}

function spritesmithRun(src) {
  return new Promise((resolve, reject) => {
    Spritesmith.run({ src }, function handleResult(err, result) {
      if (err) {
        console.err(err)
      } else {
        resolve(result)
      }
    });
  })
}

async function writrFile(dir, image) {
  return new Promise((resolve, reject) => {
    mkdirp.sync(path.dirname(dir))
    fs.writeFile(dir, image, (err) => {
      if (err) {
        reject()
      } else {
        resolve()
      }
    })
  })


}

module.exports = {
  getPaths,
  spritesmithRun,
  writrFile
};