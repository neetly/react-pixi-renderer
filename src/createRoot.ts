import type { Container as PixiContainer } from "@pixi/display";

import { ReactPixiInstance } from "./ReactPixiInstance";
import { ReactPixiReconciler } from "./ReactPixiReconciler";
import { ReactPixiRoot } from "./ReactPixiRoot";
import { ReactRootTag } from "./ReactRootTag";

const createRoot = (container: PixiContainer) => {
  const instance = new ReactPixiInstance(() => container);
  instance.instance = container;

  return new ReactPixiRoot(
    ReactPixiReconciler.createContainer(
      instance,
      ReactRootTag.ConcurrentRoot,
      false,
      null,
    ),
  );
};

export { createRoot };
