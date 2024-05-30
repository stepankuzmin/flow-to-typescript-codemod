import dedent from "dedent";
import {transform,} from "./utils/testing";

jest.mock("../runner/migration-reporter/migration-reporter.ts");

describe("$ObjMap", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  it("$ObjMap", async () => {
    const src = dedent`type T =
      $ObjMap<Props, <T, R>(p: Property<T, R>) => TransitionablePropertyValue<T, R>>;`;

    const expected = dedent`type T = {
      [Key in keyof Props]: Props[Key] extends Property<infer T, infer R> ? TransitionablePropertyValue<T, R> : never;
    };`;

    expect(await transform(src)).toBe(expected);
  });
});
