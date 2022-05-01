import { debounce, throttle, InvalidTimeError } from "./";
import { describe, it, expect, vi, beforeEach } from "vitest";

const SHORT_TIME = 1;

const sleep = (t: number) => new Promise((r) => setTimeout(r, t));

describe("debounce", () => {
  it("Multiple calls in time, only the last call to be executed after time.", async () => {
    const fn = vi.fn();
    const { exec } = debounce(fn, SHORT_TIME);
    exec(1);
    exec(2);
    expect(fn).toBeCalledTimes(0);
    await sleep(SHORT_TIME);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(2);
  });

  it("Cancel.", async () => {
    const fn = vi.fn();
    const { exec, cancel } = debounce(fn, SHORT_TIME);
    exec(1);
    cancel();
    await sleep(SHORT_TIME);
    expect(fn).toBeCalledTimes(0);
  });

  it("Execute immediately at any given time.", async () => {
    const fn = vi.fn();
    const { exec, cancel, flush } = debounce(fn, SHORT_TIME);
    exec(1);
    flush();
    expect(fn).toBeCalledTimes(1);
    await sleep(SHORT_TIME);
    expect(fn).toBeCalledTimes(1);
  });

  it("Immediate execution at any given time must be executed only once.", async () => {
    const fn = vi.fn();
    const { exec, flush } = debounce(fn, SHORT_TIME);
    exec(1);
    flush();
    flush();
    await sleep(SHORT_TIME);
    expect(fn).toBeCalledTimes(1);
  });

  it("Error when specifying a time of less than 0 ms.", async () => {
    expect(() => throttle(vi.fn(), 0)).toThrowError(InvalidTimeError);
  });
});

describe("throttle", () => {
  it("If multiple calls are made within a time period, only the first call will be executed immediately", async () => {
    const fn = vi.fn();
    const { exec, reset } = throttle(fn, SHORT_TIME);
    exec(1);
    exec(2);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(1);
    await sleep(SHORT_TIME);
    expect(fn).toBeCalledTimes(1);
  });

  it("Calls made after hours shall also be executed immediately", async () => {
    const fn = vi.fn();
    const { exec } = throttle(fn, SHORT_TIME);
    exec(1);
    await sleep(SHORT_TIME);
    exec(2);
    expect(fn).toBeCalledTimes(2);
    expect(fn).toBeCalledWith(2);
  });

  it("Reset allows you to call and execute again, even if no time has elapsed.", async () => {
    const fn = vi.fn();
    const { exec, reset } = throttle(fn, SHORT_TIME);
    exec(1);
    reset();
    exec(2);
    expect(fn).toBeCalledTimes(2);
    expect(fn).toBeCalledWith(2);
  });

  it("Error when specifying a time of less than 0 ms.", async () => {
    expect(() => throttle(vi.fn(), 0)).toThrowError(InvalidTimeError);
  });
});
