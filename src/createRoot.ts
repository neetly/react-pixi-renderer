import type { Container as PixiContainer } from "@pixi/display";
import { ConcurrentRoot } from "react-reconciler/constants";

import { ReactPixiInstance } from "./ReactPixiInstance";
import { ReactPixiRenderer } from "./ReactPixiRenderer";
import { ReactPixiRoot } from "./ReactPixiRoot";
import { onRecoverableError } from "./utils/onRecoverableError";

const createRoot = (container: PixiContainer) => {
  const instance = new ReactPixiInstance(() => container, false);
  instance.instance = container;

  return new ReactPixiRoot(
    ReactPixiRenderer.createContainer(
      instance,
      ConcurrentRoot,
      null,
      false,
      false,
      "",
      onRecoverableError,
      null,
    ),
  );
};

export { createRoot };
