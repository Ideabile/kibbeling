const { resolve } = require('path')
const frontMatter = require('front-matter')

const md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
})

md.use(require('markdown-it-video'))
md.use(require('markdown-it-highlightjs'))

const { readdirSync } = require('fs')

const { exists, isFile, getFile, isMarkdown } = require('./f')
const { contentDir } = require('./configs')

const GetFileContent = file => {
  let obj = frontMatter(getFile(file))
  obj.body = md.render(obj.body)
  if(obj.frontmatter) delete obj.frontmatter
  return obj
}

const MapFiles = (path, file) => {
  const fullPath = resolve(path, file)

  // Markdown
  if (exists(fullPath) && isFile(fullPath) && isMarkdown(fullPath)) {
    let obj = Object.assign(GetFileContent(fullPath), { name: file.replace('.md', ''), type: 'content' })
    delete obj.body
    return obj
  }

  // Directory
  if (exists(fullPath) && !isFile(fullPath)) {
    return { name: file, type: 'directory' }
  }

  return false
}

const ListDirectory = path => {
  return readdirSync(path)
    .map(MapFiles.bind(null, path))
    .filter( file => !!file )
}

// Request Handler
const handler = (Request, Response) => {
  let contentPath = Request.params.contentPath || ''
  let _path = resolve(contentDir, contentPath.replace('.json', ''))

  // We found a .md file
  if (exists(`${_path}.md`) && isFile(`${_path}.md`)) {
    return Response(
      GetFileContent(`${_path}.md`)
    )

  // We found a dir
  } else if (exists(_path) && !isFile(_path)) {
    return Response(
      ListDirectory(_path)
    )
  }

  return Response.continue()
}

module.exports = [
  { method: 'GET', path: '/content.json', handler },
  { method: 'GET', path: '/content/{contentPath*}', handler }
]
