# LesserPanda Game Editor (WIP)

A simple game editor for LesserPanda. It will become a collection of small
editor components instead of a rich all-in-one solution.

## Build

```shell
# Install dependencies
npm install

# Start a server and watch changes
gulp
```

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
