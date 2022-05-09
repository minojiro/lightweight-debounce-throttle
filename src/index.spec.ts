import { debounce, throttle, InvalidTimeError } from "./";
import { describe, it, expect, vi, beforeEach } from "vitest";

const SHORT_TIME = 1;

beforeEach(() => {
  vi.useFakeTimers();
});

describe("debounce", () => {
  it("Multiple calls in time, only the last call to be executed after time.", () => {
    const fn = vi.fn();
    const { exec } = debounce(fn, SHORT_TIME);
    exec(1);
    exec(2);
    expect(fn).toBeCalledTimes(0);
    vi.advanceTimersByTime(SHORT_TIME);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });

  it("Cancel.", () => {
    const fn = vi.fn();
    const { exec, cancel } = debounce(fn, SHORT_TIME);
    exec(1);
    cancel();
    vi.advanceTimersByTime(SHORT_TIME);
    expect(fn).toBeCalledTimes(0);
  });

  it("Execute immediately at any given time.", () => {
    const fn = vi.fn();
    const { exec, cancel, flush } = debounce(fn, SHORT_TIME);
    exec(1);
    flush();
    expect(fn).toBeCalledTimes(1);
    vi.advanceTimersByTime(SHORT_TIME);
    expect(fn).toBeCalledTimes(1);
  });

  it("Immediate execution at any given time must be executed only once.", () => {
    const fn = vi.fn();
    const { exec, flush } = debounce(fn, SHORT_TIME);
    exec(1);
    flush();
    flush();
    vi.advanceTimersByTime(SHORT_TIME);
    expect(fn).toBeCalledTimes(1);
  });

  it("Error when specifying a time of less than 0 ms.", () => {
    expect(() => throttle(vi.fn(), 0)).toThrowError(InvalidTimeError);
  });
});

describe("throttle", () => {
  it("If multiple calls are made within a time period, only the first call will be executed immediately", () => {
    const fn = vi.fn();
    const { exec } = throttle(fn, SHORT_TIME);
    exec(1);
    exec(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(1);
    expect(fn).toBeCalledTimes(1);
  });

  it("Calls made after hours shall also be executed immediately", () => {
    const fn = vi.fn();
    const { exec } = throttle(fn, SHORT_TIME);
    exec(1);
    vi.advanceTimersByTime(SHORT_TIME);
    exec(2);
    expect(fn).toBeCalledTimes(2);
    expect(fn).toBeCalledWith(2);
  });

  it("Reset allows you to call and execute again, even if no time has elapsed.", () => {
    const fn = vi.fn();
    const { exec, reset } = throttle(fn, SHORT_TIME);
    exec(1);
    reset();
    exec(2);
    expect(fn).toBeCalledTimes(2);
    expect(fn).toBeCalledWith(2);
  });

  it("Error when specifying a time of less than 0 ms.", () => {
    expect(() => throttle(vi.fn(), 0)).toThrowError(InvalidTimeError);
  });
});
