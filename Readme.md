# Kibbeling
Kibbeling is a restful api for serve your Markdown has a json. Useful for Static Website Generated.
Can be extended trough an `api` folder and support `generate` for cache your response statically.

## Installing

```
npm install kibbeling
```

## CLI usage
```
./node_modules/.bin/kibbeling
```

## Programmatic usage

You can require kibbeling in your `node` applications.
```
const Kib = require('kibbeling')
const server = new Kib({ port: 3030, host: 'example.com' })
server.start((err) => {
  if (err) throw err
  console.log('Server running at:', server.info.uri)
})
```
Kibbeling is a layer on top of `hapijs` and once is initialized return an instance of it.
For add new routes or extends other server functionalities please have a look to the [hapi Documentation](https://hapijs.com).

# Options

- **port**
  The *port* for the service. `Default: 3051`
  ```
    // CLI
    -p 3051
  ```

- **host**
  The *hostname* for the service. `Default: localhost`
  ```
    // CLI
    -h localhost
  ```

- **contentDir**
  The content folder where the services would try to serve markdowns. `Default: content`
  ```
    // CLI
    -c content
  ```

- **apiDir**
  Set *api folder* where Kibbeling would try to add [routes](https://hapijs.com/api#serverrouteoptions). `Default: api`
  ```
    // CLI
    -a api
  ```

- **generate**
  Set destination folder for statically cache your api response from Kibbeling `Default: false`
  ```
    // CLI
    -g api
  ```
