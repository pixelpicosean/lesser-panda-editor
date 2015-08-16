# LesserPanda Game Editor (WIP)

A simple game editor for LesserPanda. It will become a collection of small
editor components instead of a rich all-in-one solution.

## Usage

1. Install Gulp globally: `npm install -g gulp`
2. Run `npm install` and then `jspm install` in the root directory
3. Run `gulp` or `npm start` to start the local dev server

### Note

Make sure that the `src/css` and `src/img` folder exist, they
are ignored by Git but required for building tasks.

## Generating documentation

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
