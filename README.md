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

## Sample Tactics

This is a [demo game](https://excaliburjs.com/sample-tactics/) [source](https://github.com/excaliburjs/sample-tactics) by Excalibur's creator [Erik Onarheim](https://github.com/eonarheim) that previously used [Lit](https://lit.dev/docs/) to create UI components, in particular the AudioMenu and UnitMenu. This section demonstrates how to swap out the Lit components for Solid JSX components while still maintaining the "manager" classes that governed the components. To see how these managers are unnecessary, refer to the [refactor](#sample-tactics-refactor) section

The most interesting scripts to compare the differences with the source code are [ui-manager](./src/components/sampleTactics/src/ui-manager.tsx) and its components [UnitMenu](./src/components/sampleTactics/src/ui-components/UnitMenu.tsx), [audio-manager](./src/components/sampleTactics/src/audio-manager.tsx) and its component [AudioMenu](./src/components/sampleTactics/src/ui-components/AudioMenu.tsx). Overall the difference from the source code affects around 6 files.

## Sample Tactics Refactor

This is a further refactor of the Sample Tactics from above and showcases how to remove the [ui-manager](./src/components/sampleTactics/src/ui-manager.tsx) and [audio-manager](./src/components/sampleTactics/src/audio-manager.tsx) scripts completely and replace them with much more self-managed and compact components. The substance of the [UnitMenu](./src/components/SampleTacticsRefactor/src/ui-components/UnitMenu.tsx) is mostly contained in 15 lines:

```typescript
<div
 class={`${styles.menu} ${styles.show}`}
 style={{
  left: `${unitMenuPosition().left}px`,
  top: `${unitMenuPosition().top}px`,
 }}
>
 <div class={styles.titleBar}></div>
 <div class={styles.options}>
  {menuOptions?.map((option) => (
   <button class={styles.button} onClick={option.onClick}>
    {option.text}
   </button>
  ))}
 </div>
</div>
```

and no longer has need of a "manager" class. Instead it is rendered on demand like this:

```typescript
const disposeMenu = render(
 () => (
  <UnitMenu
   unit={cell.unit!}
   game={this.engine}
   menuOptions={[
    {
     key: "move",
     text: "Move",
     onClick: () => {
      this.selectionManager.selectUnit(cell.unit!, "move");
      disposeMenu();
     },
    },
    {
     key: "attack",
     text: "Attack",
     onClick: () => {
      this.selectionManager.selectUnit(cell.unit!, "attack");
      disposeMenu();
     },
    },
    {
     key: "pass",
     text: "Pass",
     onClick: () => {
      cell.unit?.pass();
      this.selectionManager.reset();
      this.humanMove.resolve();
      disposeMenu();
     },
    },
   ].filter((option) =>
    option.key === "attack"
     ? cell.unit?.canAttack()
     : option.key === "move"
     ? cell.unit?.canMove()
     : true
   )}
  />
 ),
 document.getElementById(gameUiId)!
);
```

Here, calling the `disposeMenu` function that is returned from the render removes the component from the DOM so if it is desired to, one could push that function into a containing array or hoist it some other way if it was need to execute a mass disposal. See [human-player](./src/components/SampleTacticsRefactor/src/human-player.tsx) for the implementation.

For the implementation in the [tutorial](src/components/SampleTacticsRefactor/src/levels/tutorial.tsx), we kept the "OOP" / Class style, writing:

```typescript
//? This does an initial render of the menu and stores the dispose function
const menu = {
  show: () => {
    const dispose = render(
      () => <UnitMenu unit={unit1} game={this.engine} />,
      document.getElementById(gameUiId)!
    );
    menu.hide = dispose;
  },
  hide: () => {},
};
menu.show();
// ...
menu.hide();
```

With this syntax, it does feel pretty nice to call the hide and show functions but the reader should understand that calling "show" or "hide" like this actually adds and removes the component from the DOM. If wanting a more persistent DOM element, one should provide props that have static references to values (preferably signals) and updating those values/signals as needed, just as demonstrated with the "Breakout UI" demo.

## Getting Started

Clone the repo, run

```shell
pnpm i
```

then run

```shell
pnpm run dev
```
