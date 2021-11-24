import {
  ObservablePoint as PixiObservablePoint,
  Point as PixiPoint,
} from "@pixi/math";

const isPoint = (value: unknown): value is PixiPoint | PixiObservablePoint => {
  return value instanceof PixiPoint || value instanceof PixiObservablePoint;
};

export { isPoint };
