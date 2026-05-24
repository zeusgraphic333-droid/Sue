export {};

declare global {
  interface Window {
    customScrollProgress: number;
    // We also expose the initWebGL function for future implementation
    initWebGL?: (canvas: HTMLCanvasElement) => void;
  }
}
