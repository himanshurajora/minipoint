/**
 * A simple typed event emitter for per-object events.
 */
export class EventEmitter<TEventMap extends Record<string, any>> {
  private _listeners: Map<keyof TEventMap, Set<Function>> = new Map();

  /**
   * Register an event listener
   */
  on<K extends keyof TEventMap>(
    event: K,
    listener: (data: TEventMap[K]) => void,
  ): this {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event)!.add(listener);
    return this;
  }

  /**
   * Register a one-time event listener
   */
  once<K extends keyof TEventMap>(
    event: K,
    listener: (data: TEventMap[K]) => void,
  ): this {
    const wrapper = (data: TEventMap[K]) => {
      this.off(event, wrapper);
      listener(data);
    };
    return this.on(event, wrapper);
  }

  /**
   * Remove an event listener
   */
  off<K extends keyof TEventMap>(
    event: K,
    listener: (data: TEventMap[K]) => void,
  ): this {
    const listeners = this._listeners.get(event);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this._listeners.delete(event);
      }
    }
    return this;
  }

  /**
   * Emit an event
   */
  emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): this {
    const listeners = this._listeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        listener(data);
      }
    }
    return this;
  }

  /**
   * Remove all listeners (optionally for a specific event)
   */
  clear<K extends keyof TEventMap>(event?: K): this {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
    }
    return this;
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount<K extends keyof TEventMap>(event: K): number {
    return this._listeners.get(event)?.size ?? 0;
  }
}
