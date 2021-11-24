import type { ReactNode } from "react";

import { ReactPixiRenderer } from "./ReactPixiRenderer";

class ReactPixiRoot {
  constructor(private readonly container: unknown) {}

  render(children: ReactNode) {
    ReactPixiRenderer.updateContainer(children, this.container, null, null);
  }

  unmount() {
    ReactPixiRenderer.updateContainer(null, this.container, null, null);
  }
}

export { ReactPixiRoot };
