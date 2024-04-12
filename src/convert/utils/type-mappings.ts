export const ReactTypes = {
  Node: "ReactNode",
  Child: "ReactChild",
  Children: "ReactChildren",
  Text: "ReactText",
  Fragment: "ReactFragment",
  FragmentType: "ComponentType",
  Portal: "ReactPortal",
  NodeArray: "ReactNodeArray",
  ElementProps: "ComponentProps",
  StatelessFunctionalComponent: `FC`,
} as const;

export const SyntheticEvents = {
  SyntheticEvent: "React.SyntheticEvent",
  SyntheticAnimationEvent: "React.AnimationEvent",
  SyntheticCompositionEvent: "React.CompositionEvent",
  SyntheticClipboardEvent: "React.ClipboardEvent",
  SyntheticUIEvent: "React.UIEvent",
  SyntheticFocusEvent: "React.FocusEvent",
  SyntheticKeyboardEvent: "React.KeyboardEvent",
  SyntheticMouseEvent: "React.MouseEvent",
  SyntheticDragEvent: "React.DragEvent",
  SyntheticWheelEvent: "React.WheelEvent",
  SyntheticPointerEvent: "React.PointerEvent",
  SyntheticTouchEvent: "React.TouchEvent",
  SyntheticTransitionEvent: "React.TransitionEvent",
} as const;

export const MomentTypes = {
  MomentDuration: "Duration",
} as const;

export const GeoJSONTypes = {
  GeoJSON: "GeoJSON.GeoJSON",
  GeoJSONPosition: "GeoJSON.Position",
  GeoJSONGeometry: "GeoJSON.Geometry",
  GeoJSONFeature: "GeoJSON.Feature",
  GeoJSONPoint: "GeoJSON.Point",
  GeoJSONMultiPoint: "GeoJSON.MultiPoint",
  GeoJSONLineString: "GeoJSON.LineString",
  GeoJSONMultiLineString: "GeoJSON.MultiLineString",
  GeoJSONPolygon: "GeoJSON.Polygon",
  GeoJSONMultiPolygon: "GeoJSON.MultiPolygon",
} as const;

export const MapboxVectorTileTypes = {
  IVectorTile: "VectorTile",
  IVectorTileLayer: "VectorTileLayer",
  IVectorTileFeature: "VectorTileFeature",
} as const;

export const GlMatrixTypes = {
  Mat2: "mat2",
  Mat3: "mat3",
  Mat4: "mat4",
  Vec2: "vec2",
  Vec3: "vec3",
  Vec4: "vec4",
  Quat: "quat",
} as const;
