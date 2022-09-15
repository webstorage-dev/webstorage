import { Schema } from "./schema";

export const API = {
  URL: "https://api.webstorage.dev",
  get: (data: Schema<Record<string, unknown>>) => {
    return fetch(API.URL, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        account: data.meta.account,
        store: data.meta.store,
      },
    });
  },
  set: (data: Schema<Record<string, unknown>>) => {
    return fetch(API.URL, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        account: data.meta.account,
        store: data.meta.store,
      },
      body: JSON.stringify(data),
    });
  },
};
