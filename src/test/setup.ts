import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore test stub
window.ResizeObserver = FakeResizeObserver;

class FakeAudioContext {
  createOscillator() {
    return { connect() {}, start() {}, stop() {}, frequency: { value: 0 }, type: "" };
  }
  createGain() {
    return {
      connect() {},
      gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
    };
  }
  get destination() { return {}; }
  get currentTime() { return 0; }
  close() { return Promise.resolve(); }
}
// @ts-ignore test stub
window.AudioContext = FakeAudioContext;
// @ts-ignore test stub
window.webkitAudioContext = FakeAudioContext;
