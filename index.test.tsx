import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { useClassState } from "./index";

describe("useClassState", () => {
  function renderUseClassStateHook<T>(initialState?: T) {
    return renderHook(() => useClassState(initialState));
  }

  it("should be able to use undefined as state", () => {
    const { result: hook } = renderUseClassStateHook(undefined);
    expect(hook.current[0]).toBe(undefined);

    act(() => {
      hook.current[1](undefined);
    });

    expect(hook.current[0]).toBe(undefined);
  });

  it("should use undefined as state when initial state is absent", () => {
    const { result: hook } = renderUseClassStateHook();
    expect(hook.current[0]).toBe(undefined);
  });

  it("should be able to use null as state", () => {
    const { result: hook } = renderUseClassStateHook(null);
    expect(hook.current[0]).toBe(null);

    act(() => {
      hook.current[1](null);
    });

    expect(hook.current[0]).toBe(null);
  });

  it("should be able to use object as state", () => {
    const { result: hook } = renderUseClassStateHook({ a: 123, b: "abc" });
    expect(hook.current[0]).toEqual({ a: 123, b: "abc" });

    act(() => {
      hook.current[1]({ a: 456, b: "def" });
    });

    expect(hook.current[0]).toEqual({ a: 456, b: "def" });
  });

  class State {
    public a: number;
    private b: string;

    public constructor(data: { a: number; b: string }) {
      this.a = data.a;
      this.b = data.b;
    }

    public increment() {
      this.a = this.a + 1;
    }

    public equal(state: State) {
      return this.a === state.a && this.b === state.b;
    }
  }

  it("should be able to use class as state", () => {
    const { result: hook } = renderUseClassStateHook(
      new State({ a: 123, b: "abc" }),
    );
    expect(hook.current[0]).toBeInstanceOf(State);
    expect(hook.current[0].equal(new State({ a: 123, b: "abc" })));

    act(() => {
      hook.current[1](new State({ a: 456, b: "def" }));
    });

    expect(hook.current[0]).toBeInstanceOf(State);
    expect(hook.current[0].equal(new State({ a: 456, b: "def" })));
  });

  it("should only trigger re-render when class state is updated by hook", () => {
    function Page(props: { initialState: State }) {
      const [state, setState] = useClassState(props.initialState);
      return (
        <div>
          <p>{state.a}</p>
          <button onClick={() => state.increment()}>Update class</button>
          <button
            onClick={() => {
              setState(state);
            }}
          >
            Update state
          </button>
        </div>
      );
    }
    render(<Page initialState={new State({ a: 123, b: "abc" })} />);
    expect(screen.queryByText(123)).not.toBe(null);

    fireEvent.click(screen.getByText(/update class/i));
    expect(screen.queryByText(123)).not.toBe(null);

    fireEvent.click(screen.getByText(/update state/i));
    expect(screen.queryByText(124)).not.toBe(null);
  });
});
