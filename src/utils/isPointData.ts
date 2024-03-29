import type { IPointData as PixiPointData } from "@pixi/core";

const isPointData = (value: unknown): value is PixiPointData => {
  return Boolean(
    value &&
      typeof (value as PixiPointData).x === "number" &&
      typeof (value as PixiPointData).y === "number",
  );
};

export { isPointData };
