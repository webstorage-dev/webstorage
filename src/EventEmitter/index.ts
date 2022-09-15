type EventArguments<T> = T extends (...args: infer Args) => void ? Args : never;

type EventListener<Events> = {
  [Event in keyof Events]?: Events[Event][];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export class EventEmitter<Events extends Record<string, Function>> {
  private listeners = {} as EventListener<Events>;

  on = <Event extends keyof Events>(
    event: Event,
    listener: Events[Event]
  ): void => {
    this.listeners[event] ??= [];
    this.listeners[event]?.push(listener);
  };
  off = <Event extends keyof Events>(
    event: Event,
    listener: Events[Event]
  ): void => {
    this.listeners[event] = this.listeners[event]?.filter(
      (x) => x !== listener
    );
  };
  emit = <Event extends keyof Events>(
    event: Event,
    ...args: EventArguments<Events[Event]>
  ): void => {
    this.listeners[event]?.forEach((cb) => {
      cb(...args);
    });
  };
}
