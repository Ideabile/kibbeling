const { resolve } = require('path')
const CWD = resolve(process.cwd())

const defaultConfigs = {
  port: 3051,
  host: 'localhost',
  apiDir: resolve(CWD, 'api'),
  contentDir: resolve(CWD, 'content'),
  generate: false
}

const getConfig = (name) => {
  return process.env[`KIB_${name.toUpperCase()}`] || process.env[`npm_package_config_kib_${name}`] || defaultConfigs[name]
}

module.exports = {

  port: getConfig('port'),

  host: getConfig('host'),

  apiDir: getConfig('apiDir'),

  contentDir: getConfig('contentDir'),

  generate: getConfig('generate')

}
