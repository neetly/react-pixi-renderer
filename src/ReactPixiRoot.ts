import type { ReactNode } from "react";

import { ReactPixiReconciler } from "./ReactPixiReconciler";

class ReactPixiRoot {
  constructor(private readonly container: unknown) {}

  render(children: ReactNode) {
    ReactPixiReconciler.updateContainer(children, this.container, null, null);
  }

  unmount() {
    ReactPixiReconciler.updateContainer(null, this.container, null, null);
  }
}

export { ReactPixiRoot };
