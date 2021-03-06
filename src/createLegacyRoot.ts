import type { Container as PixiContainer } from "@pixi/display";
import { LegacyRoot } from "react-reconciler/constants";

import { ReactPixiInstance } from "./ReactPixiInstance";
import { ReactPixiRenderer } from "./ReactPixiRenderer";
import { ReactPixiRoot } from "./ReactPixiRoot";
import { onRecoverableError } from "./utils/onRecoverableError";

const createLegacyRoot = (container: PixiContainer) => {
  const instance = new ReactPixiInstance(() => container, false);
  instance.instance = container;

  return new ReactPixiRoot(
    ReactPixiRenderer.createContainer(
      instance,
      LegacyRoot,
      null,
      false,
      false,
      "",
      onRecoverableError,
      null,
    ),
  );
};

export { createLegacyRoot };
