import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";

let root: Root | null = null;

export function getClientRoot(rootId: string) {
  if (!root) {
    const container = document.querySelector(`#${rootId}`)!;
    root = createRoot(container);
  }
  return root;
}
