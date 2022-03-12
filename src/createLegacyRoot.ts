import type { Container as PixiContainer } from "@pixi/display";

import { ReactPixiInstance } from "./ReactPixiInstance";
import { ReactPixiRenderer } from "./ReactPixiRenderer";
import { ReactPixiRoot } from "./ReactPixiRoot";
import { ReactRootTag } from "./ReactRootTag";

const createLegacyRoot = (container: PixiContainer) => {
  const instance = new ReactPixiInstance(() => container, false);
  instance.instance = container;

  return new ReactPixiRoot(
    ReactPixiRenderer.createContainer(
      instance,
      ReactRootTag.LegacyRoot,
      false,
      null,
    ),
  );
};

export { createLegacyRoot };
