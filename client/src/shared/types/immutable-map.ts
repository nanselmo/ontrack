import { Map } from "immutable";

interface ImmutableMap<T> extends Map<string, any> {
  get<K extends keyof T>(name: K): T[K]
}

export default ImmutableMap;
