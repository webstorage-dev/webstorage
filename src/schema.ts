export interface Schema<Storage extends Record<string, unknown>> {
  meta: {
    account: string;
    store: string;
    version: 1;
  };
  data: {
    [Key in keyof Storage]?:
      | { value: Storage[Key]; lastModified: string }
      | undefined;
  };
}
