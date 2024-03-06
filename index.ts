import "reflect-metadata";
import { instanceToPlain, plainToClassFromExist } from "class-transformer";
import { useRef, useState } from "react";

export function useClsState<S>(initialState?: S): [S, (state: S) => void] {
  const [internalState, setInternalState] = useState(
    instanceToPlain(initialState),
  );
  const stateClassRef = useRef(
    initialState instanceof Object ? initialState.constructor : null,
  );
  function setState(state: S) {
    stateClassRef.current = state instanceof Object ? state.constructor : null;
    setInternalState(instanceToPlain(state));
  }
  if (!stateClassRef.current) {
    return [internalState as S, setState];
  }
  const state = Reflect.construct(Object, [], stateClassRef.current);
  return [plainToClassFromExist(state, internalState) as S, setState];
}
