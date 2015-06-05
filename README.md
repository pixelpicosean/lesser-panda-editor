# Mithril Level Editor (Experimental and WIP)

A experiment level editor using Mithril frameowrk.

## Build

```shell
# Install dependencies
npm install

# Start a server and watch changes
gulp
```

## Coding Rules

- Standalone components should be REAL components, just like the `Input`
- Try to create a separate "view-model" for components instead of using "fat controller"
- The above one also means: there should have a controller AND a view-model

### Why "Controller" with "ViewModel"?

Controllers should be designed as a context for "pure functions", by using a separate
view-model to keep states of instances of that component, so states are easier to share
between these instances. This structure encourages to design methods as pure functions
which will make components more "re-usable" and easier to troubleshot.
