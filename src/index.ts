import { API } from "./api.js";
import { EventEmitter } from "./EventEmitter/index.js";
import { Schema } from "./schema.js";
import { debounce } from "./utils/index.js";

// todo:
// deletes
// version changes

export type DefaultStorage = Record<string, unknown>;

export interface WebStorageConfig {
  account: string;
  store: string;
}

type Meta<Storage extends DefaultStorage> = Schema<Storage>["meta"] & {
  keys: Record<keyof Storage, { lastModified: string } | undefined>;
};

export interface Change<T extends DefaultStorage = DefaultStorage> {
  key: keyof T;
  lastModified: string;
  value: T[keyof T];
}

export class WebStorage<Storage extends DefaultStorage = DefaultStorage> {
  private account: string;
  private store: string;
  private meta: Meta<Storage>;
  private pendingUpdates: Schema<Storage>["data"] = {};
  private ee = new EventEmitter<{
    change: (change: Change<Storage>) => void;
  }>();

  constructor({ account, store }: WebStorageConfig) {
    this.account = account;
    this.store = store;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.meta =
      (this._get(this.prefix("meta")) as Meta<Storage> | undefined) ??
      ({
        version: 1,
        keys: {},
        account,
        store,
      } as Meta<Storage>);

    requestIdleCallback(() => {
      void this.synchronize();
    });
  }

  get = <Key extends keyof Storage>(key: Key): Storage[Key] => {
    return this._get(key as string)?.value as Storage[Key];
  };

  set = <Key extends keyof Storage>(key: Key, value: Storage[Key]) => {
    const change = {
      key,
      value,
      lastModified: new Date().toISOString(),
    };
    this.onKeyChange(change);
    this._set(key as string, {
      value,
    });
    this.pendingUpdates[change.key] = {
      value,
      lastModified: change.lastModified,
    };
    this.syncLocalChanges();
  };

  on = this.ee.on;

  off = this.ee.on;

  private prefix = (key: string) => {
    return ["__webstorage__", this.account, this.store, key].join("");
  };

  private syncLocalChanges = debounce(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { keys, ...meta } = this.meta;
    const data = this.pendingUpdates;
    // clear pendingUpdates
    this.pendingUpdates = {};
    try {
      await API.set({ meta, data });
    } catch (e) {
      // restore pendingUpdates on failure, with any new updates
      // overwriting previous values
      this.pendingUpdates = { ...data, ...this.pendingUpdates };
    }
  }, 60_000);

  private _get(key: string): Schema<Storage>["data"][string] | undefined {
    const value = localStorage.getItem(this.prefix(key));
    if (!value) {
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(value);
      // eslint-disable-next-line no-empty
    } catch {}
  }

  private _set = (key: string, value: unknown) => {
    localStorage.setItem(this.prefix(key), JSON.stringify(value));
  };

  private onKeyChange = (change: Change<Storage>) => {
    this.meta.keys[change.key] = {
      lastModified: change.lastModified,
    };
    this._set(this.prefix("meta"), this.meta);
    this.ee.emit("change", change);
  };

  private synchronize = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { keys: _keys, ...meta } = this.meta;
    const res = await API.get({ meta, data: {} });
    if (res.ok) {
      const remote = (await res.json()) as Schema<Storage>;
      for (const key in remote.data) {
        const remoteData = remote.data[key];
        const localLastModified = this.meta.keys[key]?.lastModified;
        if (
          remoteData &&
          (!localLastModified || localLastModified < remoteData.lastModified)
        ) {
          this.onKeyChange({ key, ...remoteData });
          this._set(key, remote);
        }
      }
      for (const key in this.meta.keys) {
        const localData = this.meta.keys[key];
        const remoteLastModified = remote.data[key]?.lastModified;
        if (
          localData &&
          (!remoteLastModified || remoteLastModified < localData.lastModified)
        ) {
          this.pendingUpdates[key as keyof Storage] = {
            value: this.get(key),
            lastModified: localData.lastModified,
          };
        }
      }
    }

    if (Object.keys(this.pendingUpdates).length) {
      this.syncLocalChanges();
    }
  };
}
