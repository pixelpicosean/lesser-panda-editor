# LesserPanda Game Editor (WIP)

A simple game editor for LesserPanda. It will become a collection of small
editor components instead of a rich all-in-one solution.

## Usage


### Note


## Generating documentation

Make sure that the `src/css` and `src/img` folder exist, they
are ignored by Git but required for building tasks.
Run `npm run docs` to generate documentation for your JavaScript and SASS automatically in the `docs` folder.

## Building

Run `gulp build` or `npm run build` to build the app for distribution in the `dist` folder.

## Keep in Mind

- Try to use FRP(Functional Reactive Programming) as more as possible
- Standalone components should be REAL components, just like the `Input`
- Try to create a separate "view-model" for components instead of using "fat controller"
- The above one also means: there should have a controller AND a view-model

### Why "Controller" with "ViewModel"?

Controllers should be designed as a context for "pure functions", by using a separate
view-model to keep states of components, so states are easier to share
between components. This structure encourages to design methods as pure functions
which will make components more "re-usable" and easier to troubleshot.
## What's inside?

There are some concerns that legitimately belong only on the server, or only on the client, so there are `client/` and `server/` directories for code that is specific to one or the other. Shared code goes in `shared/`:

* `source/shared`    - Shared code.
* `source/client` - For browser-only code.
* `source/server` - For server-only code.


## Index

The `server/index` route serves dynamic content. Static assets are served from the `build` folder using `express.static`.


## Scripts

Some of these scripts may require a Unix/Linux environment. OS X and Linux come with appropriate terminals ready to roll. On Windows, you'll need git installed, which comes with Git Bash. That should work. If you have any trouble, please [report the issue](https://github.com/cloverfield-tools/universal-react-boilerplate/issues/new).

The `package.json` file comes with the following scripts that you may find useful:

* `npm start` runs a client-only devserver with hot loading
* `npm run build` rebuilds the client
* `npm run watch` runs a dev console that reports lint and unit test errors on save
* `npm run server` runs the actual server process

To run a script, open the terminal, navigate to the boilerplate directory, and type:

```
npm run <name of script>
```


### Start

Start the dev server.

You can optionally leave `run` out of the `start` and `test` script invocations, so these are equivalent:

```
npm run start
npm start
```

## 
Log messages will be written to the console (stdout) in JSON format for convenient queries using tools like [Splunk](http://www.splunk.com/). You should be able to pipe the output to a third party logging service for aggregation without including that log aggregation logic in the app itself.


### Developer feedback console:

```
npm run watch
```

The dev console does the following:

* Checks for syntax errors with `eslint` using idiomatic settings from `.eslintrc`
* Runs the unit tests and reports any test failures.
* Watches for file changes and re-runs the whole process.


## Requiring modules

To require modules relative to the app root, just put them in `source` and require them just like you would require a module installed by npm. For example, if you had a file called `source/routes/index.js` you can require it with:

```
import routes from 'routes';
```

This is a lot cleaner than using relative paths and littering your code with stuff like `../../../module/path/module.js`.

This requires the `NODE_PATH` environment variable to be set to `source`. For example from the `package.json`:

```js
  scripts: {
    "server": "NODE_PATH=source babel-node source/server/index.js",
    "test": "NODE_PATH=source babel-node source/test/index.js",
  }
```

We also need to tell webpack configs (located in the project root) about the source path:

```js
  resolve: {
    root: __dirname + '/source'
  }
```

### Why?

* You can move things around more easily.
* Every file documents your app's directory structure for you. You'll know exactly where to look for things.
* Dazzle your coworkers.

If you find yourself using the same file in a lot of modules, it's probably a better idea to split it out into its own module -- preferably open source. Then you can just install it like any other module so it can live in `node_modules`.
