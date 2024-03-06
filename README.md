# use-class-state

A `useState` hook that can accept class instance as state.

## Installation

```bash
npm install --save use-class-state
```

## Usage

`useClassState` is just like `useState`, with additional capability to accept class instance as state.

```tsx
import { useClassState } from "use-class-state"

class State {
  public constructor(
    public counter: number
  ) {}

  public increment() {
    this.counter = this.counter + 1
  }
}

function Page() {
  const [state, setState] = useClassState(new State(123))
  const increment = () => {
    // Update class instance will not trigger re-render
    state.increment()
    // Re-render is only triggered when calling state setter
    setState(state)
  }
  return (
    <div>
      <p>{state.counter}</p>
      <button onClick={() => increment()}Increment</button>
    </div>
  )
}
```

Be aware when using class instance as state, updating properties on the class instance will **NOT** trigger re-render. Re-render is only triggered when calling state setter.

## License

© Cyan Ho (pilagod), 2024-NOW.

Released under the [MIT License](https://github.com/pilagod/use-class-state/blob/main/LICENSE).
