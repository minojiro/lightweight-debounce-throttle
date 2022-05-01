const INITIAL_THROTTLE_T = -1;

const DEFAULT_DELAY = 500;

export class InvalidTimeError extends Error {}

export const debounce = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number = DEFAULT_DELAY
) => {
  let t: number;
  let prepared: null | (() => void);

  if (delay <= 0) throw new InvalidTimeError();

  const cancel = () => {
    clearTimeout(t);
  };

  const flush = () => {
    cancel();
    if (prepared) {
      prepared();
      prepared = null;
    }
  };

  const exec = (...args: T) => {
    cancel();
    prepared = () => {
      callback(...args);
    };
    t = setTimeout(prepared, delay);
  };

  return { cancel, flush, exec };
};

export const throttle = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number = DEFAULT_DELAY
) => {
  let t: number;

  if (delay <= 0) throw new InvalidTimeError();

  const exec = (...args: T) => {
    const now = Date.now();
    if (t <= now) {
      callback(...args);
      t = now + delay;
    }
  };

  const reset = () => {
    t = INITIAL_THROTTLE_T;
  };

  reset();

  return { exec, reset };
};
