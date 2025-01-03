import BaseEventEmitter from "eventemitter3";

class EventEmitter<T extends Record<string, any>> {
  private emitter: BaseEventEmitter;

  constructor() {
    this.emitter = new BaseEventEmitter();
  }

  // Type-safe `on` method to listen for events
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    this.emitter.on(String(event), listener);
    return this;
  }

  // Type-safe `off` method to remove listeners
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    this.emitter.off(String(event), listener);
    return this;
  }

  // Type-safe `emit` method to trigger events
  emit<K extends keyof T>(
    event: K,
    ...args: T[K] extends void ? [] : [T[K]]
  ): boolean {
    return this.emitter.emit(String(event), ...(args as [any]));
  }
}

type EventMap = {
  tick: void; // Example event with no payload
  stop: void; // Example event with no payload
  custom: { message: string }; // Event with payload
};

// Example of extending SimpleEventEmitter with a custom class
class Timer extends EventEmitter<EventMap> {
  private start: number;
  private current: number;
  private elapsed: number;
  private delta: number;
  private ticker: number | undefined;

  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.tick();
  }

  // Tick function for timer updates
  tick() {
    const current = Date.now();
    this.delta = Math.min(60, current - this.current);
    this.elapsed = current - this.start;
    this.current = current;

    this.emit("tick"); // Emitting 'tick' event with no payload
    this.ticker = requestAnimationFrame(this.tick.bind(this));
  }

  // Stop the timer
  stop() {
    if (this.ticker !== undefined) {
      cancelAnimationFrame(this.ticker);
    }
    this.emit("stop"); // Emitting 'stop' event with no payload
  }

  // Trigger custom event with payload
  triggerCustom(message: string) {
    this.emit("custom", { message: message }); // Emitting 'custom' event with payload
  }
}

// Usage Example
const timer = new Timer();

// Listening for events
timer.on("tick", () => {
  console.log("Tick event triggered"); // No data for 'tick'
});

timer.on("stop", () => {
  console.log("Stop event triggered"); // No data for 'stop'
});

timer.on("custom", (data) => {
  console.log(`Custom event triggered with message: ${data.message}`); // Access data for 'custom'
});

// Trigger custom event
timer.triggerCustom("Timer is running!");

// Stop the timer after 5 seconds
setTimeout(() => timer.stop(), 5000);
