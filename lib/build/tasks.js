const fs = require('fs')
const path = require('path')

const chokidar = require('chokidar')
const colour = require('ansi-colors')
const del = require('del')
const fse = require('fs-extra')
const glob = require('glob')
const nodemon = require('nodemon')
const sass = require('sass')

const extensions = require('../extensions/extensions')

const buildConfig = require('./config.json')
const { projectDir, packageDir } = require('../path-utils')
const { paths } = buildConfig

const tempPath = path.join(projectDir, '.tmp')
const tempSassPath = path.join(tempPath, 'sass')

const docsAssetsPaths = glob.sync('docs/*/assets')
  .map((docsAssetsPath) => {
    const publicPath = path.join(paths.public, docsAssetsPath, '..')
    return {
      assets: [docsAssetsPath, publicPath],
      sass: [path.join(docsAssetsPath, 'sass'), path.join(publicPath, 'stylesheets')]
    }
  })

function generateAssets () {
  clean()
  sassExtensions()
  docsAssetsPaths.forEach((paths) => {
    generateCss(...paths.sass)
    copyAssets(...paths.assets)
  })
}

function devServer () {
  watch()
  return runNodemon()
}

async function buildWatchAndServe () {
  generateAssets()
  devServer()
}

function clean () {
  // doesn't clean extensions.scss, should it?
  del.sync(['public/**', '.port.tmp'])
}

function sassExtensions () {
  let fileContents = '$govuk-extensions-url-context: "/extension-assets"; '
  fileContents += extensions.getFileSystemPaths('sass')
    .map(filePath => `@import "${filePath.split(path.sep).join('/')}";`)
    .join('\n')
  fse.ensureDirSync(tempSassPath, { recursive: true })
  fs.writeFileSync(path.join(tempPath, '.gitignore'), '*')
  fs.writeFileSync(path.join(tempSassPath, '_extensions.scss'), fileContents)
}

function generateCss (sassPath, cssPath) {
  if (!fs.existsSync(sassPath)) return
  console.log('compiling CSS...')
  fs.mkdirSync(cssPath, { recursive: true })
  fs.readdirSync(sassPath).forEach(file => {
    if (!file.endsWith('.scss')) return

    try {
      const result = sass.renderSync({
        file: `${sassPath}/${file}`,
        quietDeps: true,
        loadPaths: [__dirname],
        sourceMap: true,
        style: 'expanded'
      })

      const cssFilename = file.replace('.scss', '.css')
      fs.writeFileSync(`${cssPath}/${cssFilename}`, result.css)
    } catch (err) {
      console.error(err.message)
      console.error(err.stack)
    }
  })
}

function copyAssets (sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) return
  console.log('copying assets...')
  const filterFunc = (src) => !src.startsWith(path.join(sourcePath, 'sass'))

  // shouldn't have to ensure the directory exists, but copy errors with EEXIST otherwise
  fse.ensureDirSync(targetPath, { recursive: true })
  fse.copySync(sourcePath, targetPath, { filter: filterFunc })
}

function watchSass (sassPath, cssPath) {
  if (!fs.existsSync(sassPath)) return
  chokidar.watch(sassPath, {
    ignoreInitial: true
  }).on('all', (event, path) => {
    console.log(`watch ${sassPath}`)
    console.log(event, path)
    generateCss(sassPath, cssPath)
  })
}

function watchAssets (sourcePath, targetPath) {
  chokidar.watch([
    path.join(sourcePath, '**'),
    `!${path.join(sourcePath, 'sass', '**')}`
  ], {
    ignoreInitial: true
  }).on('all', (event, path) => {
    console.log(`watch ${sourcePath}`)
    console.log(event, path)
    copyAssets(sourcePath, targetPath)
  })
}

function watch () {
  docsAssetsPaths.forEach((paths) => {
    watchSass(...paths.sass)
    watchAssets(...paths.assets)
  })
}

function runNodemon () {
  // Warn about npm install on crash
  const onCrash = () => {
    console.log(colour.cyan('[nodemon] For missing modules try running `npm install`'))
  }

  // Remove .port.tmp if it exists
  const onQuit = () => {
    try {
      fs.unlinkSync(path.join(__dirname, '/../.port.tmp'))
    } catch (e) {}
    console.log('quit')
    process.exit(0)
  }

  return nodemon({
    watch: [
      path.join(projectDir, '.env'),
      path.join(projectDir, '**', '*.js'),
      path.join(projectDir, '**', '*.json')
    ],
    script: path.join(packageDir, 'listen-on-port.js'),
    ignore: [
      'public/*',
      'cypress/*',
      `${paths.docsAssets}*`,
      'node_modules/*'
    ]
  })
    .on('crash', onCrash)
    .on('quit', onQuit)
}

module.exports = {
  buildWatchAndServe,
  devServer,
  generateAssets
}
