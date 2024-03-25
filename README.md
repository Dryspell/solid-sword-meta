## What is this?

This is a demo project showing how to host and develop [ExcaliburJS](https://excaliburjs.com/docs/) games on a SolidStart site.

## Breakout

[Breakout](<https://en.wikipedia.org/wiki/Breakout_(video_game)>) is an old game from 1976 and serves as the "Hello World" [project](https://excaliburjs.com/docs/getting-started) for ExcaliburJS.

## Breakout UI

The Breakout HelloWorld does not have any UI elements to go with it and it is not obvious to an _Excalibur_ newcomer how to implement UI that can hook into the game loop and game state. This sample code is intended to provide an example of how to do that using commonplace SolidJS JSX.

### How does this UI hook into the game state?

Compared to the NextJS version using React, the SolidJS version is much less complicated, owing mostly to the fact that the reactive Signals native to solid don't require us to run the "render" function many times. Solid by nature has granular updates and doesn't need to diff the DOM the way React does.

```typescript
const [gameState, setGameState] = createSignal({ score: 0, lives: 3 });

// ...

render(
 () => (
  <UI
   gameState={gameState}
   setGameState={setGameState}
   game={game}
   actions={{ generateRandomBrick }}
  />
 ),
 document.getElementById(gameUiId)!
);
```

Here everything just seems to work smoothly with the biggest difference being due to the differences between SolidJS and React. Since Solid doesn't cause re-renders, we don't need to worry about potentially blowing out the DOM and losing state.

## Getting Started

Clone the repo, run

```shell
pnpm i
```

then run

```shell
pnpm run dev
```
