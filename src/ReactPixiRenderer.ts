import Reconciler from "react-reconciler";

import { ReactPixiHostConfig } from "./ReactPixiHostConfig";

const ReactPixiRenderer = Reconciler(ReactPixiHostConfig);

ReactPixiRenderer.injectIntoDevTools({
  rendererPackageName: "@neetly/react-pixi-renderer",
  version: "2.0.0",
  bundleType: process.env.NODE_ENV === "development" ? 1 : 0,
});

export { ReactPixiRenderer };
