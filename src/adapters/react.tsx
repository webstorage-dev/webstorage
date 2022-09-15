import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Change,
  DefaultStorage,
  WebStorage as Storage,
  WebStorageConfig,
} from "../index.js";

type UnionToIntersection<Union> =
  // `extends unknown` is always going to be the case and is used to convert the
  // `Union` into a [distributive conditional
  // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  (
    Union extends unknown
      ? // The union type is used as the only argument to a function since the union
        // of function arguments is an intersection.
        (distributedUnion: Union) => void
      : // This won't happen.
        never
  ) extends // Infer the `Intersection` type since TypeScript represents the positional
  // arguments of unions of functions as an intersection of the union.
  (mergedIntersection: infer Intersection) => void
    ? Intersection
    : never;

const WebStorageContext = createContext<Storage | undefined>(undefined);

export function WebStorage({
  children,
  ...props
}: WebStorageConfig & { children?: ReactNode | undefined }) {
  const [storage] = useState(() => new Storage(props));

  return (
    <WebStorageContext.Provider value={storage}>
      {children}
    </WebStorageContext.Provider>
  );
}
WebStorage.displayName = "WebStorage";

export type UseWebStorage<
  Storage extends { [key: string]: unknown } = DefaultStorage
> = UnionToIntersection<
  {
    [Key in keyof Storage]: (
      key: Key
    ) => [Storage[Key], (val: Storage[Key]) => void];
  }[keyof Storage]
>;

export function useWebStorage<Key extends string>(
  key: Key
): [unknown, (val: unknown) => void] {
  const storage = useContext(WebStorageContext);
  if (!storage) {
    throw new Error(
      "'<WebStorage />' not found in component tree. Make sure that a parent renders <WebStorage /> for any component that uses 'useWebStorage'"
    );
  }
  const [state, setState] = useState(() => storage.get(key));
  useEffect(() => {
    function onChange(change: Change) {
      if (change.key === key) {
        setState(change.value);
      }
    }
    storage.on("change", onChange);
    return () => storage.off("change", onChange);
  }, []);
  const setStorage = useCallback((val: unknown) => storage.set(key, val), []);

  return [state, setStorage];
}
