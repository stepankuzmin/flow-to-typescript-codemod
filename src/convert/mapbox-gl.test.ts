import dedent from "dedent";
import { transform } from "./utils/testing";

jest.mock("../runner/migration-reporter/migration-reporter.ts");

describe("mapbox-gl", () => {
  it("transform `gl-matrix`", async () => {
    const src = `import type {Vec4} from 'gl-matrix';`;
    const expected = `import type {vec4} from 'gl-matrix';`;
    expect(await transform(src)).toBe(expected);
    expect(await transform(`let _: Mat2;`)).toBe(`let _: mat2;`);
  });

  it("deduplicate import from `gl-matrix`", async () => {
    const src = dedent`
    import {vec3} from 'gl-matrix';
    import type {Vec3} from 'gl-matrix';
    `;

    const expected = dedent`
    import {vec3} from 'gl-matrix';
    `;

    expect(await transform(src)).toBe(expected);
  });

  it("deduplicate multiple imports from `gl-matrix`", async () => {
    const src = dedent`
    import {vec3} from 'gl-matrix';
    import type {Mat2, Vec3} from 'gl-matrix';
    `;

    const expected = dedent`
    import {vec3} from 'gl-matrix';
    import type {mat2} from 'gl-matrix';
    `;

    expect(await transform(src)).toBe(expected);
  });

  it("transform `@mapbox/geojson-types`", async () => {
    const src = `import type {GeoJSON} from '@mapbox/geojson-types';`;
    const expected = ``;
    expect(await transform(src)).toBe(expected);
    expect(await transform(`let _: GeoJSONFeature;`)).toBe(`let _: GeoJSON.Feature;`);
    expect(await transform(`export interface QueryFeature extends GeoJSONFeature {};`)).toBe(`export interface QueryFeature extends GeoJSON.Feature {};`);
  });

  it("transform `@mapbox/vector-tile`", async () => {
    const src = `import type {IVectorTile} from '@mapbox/vector-tile';`;
    const expected = `import type {VectorTile} from '@mapbox/vector-tile';`;
    expect(await transform(src)).toBe(expected);
    expect(await transform(`let _: IVectorTile;`)).toBe(`let _: VectorTile;`);
  });

  it("Flow Global Types", async () => {
    expect(await transform(`let _: $TypedArray;`)).toBe(`let _: ArrayBufferView;`);
    expect(await transform(`let _: $ArrayBufferView;`)).toBe(`let _: ArrayBufferView;`);
    expect(await transform(`let _: Position;`)).toBe(`let _: GeolocationPosition;`);
    expect(await transform(`let _: PositionError;`)).toBe(`let _: GeolocationPositionError;`);
  });

  it("void in return types", async () => {
    const src = dedent`
      export interface Handler {
          +wheel?: (e: WheelEvent, point: Point) => ?HandlerResult | void;
      }
      `;

      const expected = dedent`
      export interface Handler {
          readonly wheel?: (e: WheelEvent, point: Point) => HandlerResult | null | undefined | void;
      }
      `;

    expect(await transform(src)).toBe(expected);
  });

  it("avoid readonly objects", async () => {
    const src = dedent`
      const deltas = {
          zoom: 0,
          pitch: 0,
          bearing: 0
      };
      `;

      const expected = dedent`
      const deltas = {
          zoom: 0,
          pitch: 0,
          bearing: 0
      };
      `;

    expect(await transform(src)).toBe(expected);
  });
});
