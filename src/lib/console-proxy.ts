type ConsoleProxySubscription = (...args: any[]) => void
type ConsoleProxyUnsubscriber = () => void;

class _ConsoleProxy {
  private _nextId = 0;
  private readonly _subscriptions = new Map<number, ConsoleProxySubscription>();

  subscribe(fn: ConsoleProxySubscription): ConsoleProxyUnsubscriber {
    const id = this._nextId++;
    this._subscriptions.set(id, fn);
    return () => this._subscriptions.delete(id);
  }

  _onLog(...args: any[]) {
    this._subscriptions.forEach(subscription => {
      subscription(...args);
    });
  }
}

export const ConsoleProxy = new _ConsoleProxy();

(() => {
  const { log, warn, error } = console;

  console.log = function (...args: any[]) {
    ConsoleProxy._onLog(...args);
    log.apply(console, args);
  };

  console.warn = function (...args: any[]) {
    ConsoleProxy._onLog(...args);
    warn.apply(console, args);
  };

  console.error = function (...args: any[]) {
    ConsoleProxy._onLog(...args);
    error.apply(console, args);
  };
})();
