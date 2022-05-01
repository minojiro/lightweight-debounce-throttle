# Lightweight Debounce Throttle

Lightweight TypeScript native debounce and throttle

## Usage

### Install

```bash
# With NPM:
npm install lightweight-debounce-throttle

# With Yarn:
yarn add lightweight-debounce-throttle

# With PNPM:
pnpm add lightweight-debounce-throttle
```

### Debounce

```ts
import { debounce } from "lightweight-debounce-throttle";

const { exec } = debounce(
  (message) => {
    console.log(message);
  }, // callback
  1000 // delay time (milliseconds. optional, defaults to 500)
);
window.addEventListener("resize", (e) => {
  exec(`Your window width is ${e.target.innerWidth}px!`);
});
```

### Throttle

```ts
import { throttle } from "lightweight-debounce-throttle";

const { exec } = throttle(
  (message) => {
    console.log(message);
  }, // callback
  1000 // delay time (milliseconds. optional, defaults to 500)
);
button.addEventListener("click", () => {
  apiCall()
});
```
