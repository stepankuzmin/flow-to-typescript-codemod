import dedent from "dedent";
import { transform } from "./utils/testing";

const standardProgram = `const myFunction = (i: number) => i + i;`;

describe("remove-flow-pragmas", () => {
  const expected = dedent`${standardProgram}`;
  it("should remove standard inline flow pragmas", async () => {
    const src = dedent`
    // @flow

    ${standardProgram}
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove standard block flow pragmas", async () => {
    const src = dedent`
    /* @flow */

    ${standardProgram}
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove the comment even if it has extra comment marks", async () => {
    const src = dedent`
      // ///// / / / / / /// // // /// ////////// /// // /////// @flow

      ${standardProgram}
      `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should replace noflow with the ts-nocheck", async () => {
    const src = dedent`
    // @noflow

    ${standardProgram}
    `;

    const expected = dedent`
    // @ts-nocheck

    ${standardProgram}
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should replace noflow with ts-nocheck in a block comment", async () => {
    const src = dedent`
      /* @noflow */

      ${standardProgram}
      `;

    const expected = dedent`
      /* @ts-nocheck */

      ${standardProgram}
      `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should replace noflow with ts-nocheck event if it has extra comment marks", async () => {
    const src = dedent`
        // ///// / / / / / /// // // /// ////////// /// // /////// @noflow

        ${standardProgram}
        `;

    const expected = dedent`
    // ///// / / / / / /// // // /// ////////// /// // /////// @ts-nocheck

    ${standardProgram}
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove suppressions", async () => {
    const src = dedent`
        // $FlowFixMe
        // $FlowFixMe.
        // $FlowFixMe[method-unbinding]
        // $FlowIssue
        // $FlowExpectedError
        // $FlowIgnore

        ${standardProgram}
        `;

    const expected = dedent`

    ${standardProgram}
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should leave non suppressions", async () => {
    const src = dedent`
        // $FlowNotSuppression
        // normal comment

        ${standardProgram}
        `;

    const expected = dedent`
    // $FlowNotSuppression
    // normal comment

    ${standardProgram}
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove suppressions inside code blocks", async () => {
    const src = dedent`
    // $FlowIgnore
    const myFunction = (i: number) => {
      // $FlowFixMe
      return i + i;
    };
    if (foo) {
      // $FlowIssue
      console.log('bar');
    }
    `;

    const expected = dedent`
    const myFunction = (i: number) => {
      return i + i;
    };
    if (foo) {
      console.log('bar');
    }
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove suppressions inside class methods", async () => {
    const src = dedent`
    class MyClass {
      // $FlowFixMe[method-unbinding]
      myMethod() {
        return 42;
      }
    }
    `;

    const expected = dedent`
    class MyClass {
      myMethod() {
        return 42;
      }
    }
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove suppressions inside object declarations", async () => {
    const src = dedent`
    const myObject = {
      // $FlowFixMe[incompatible-call]
      value: 42,
    };
    `;

    const expected = dedent`
    const myObject = {
      value: 42,
    };
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove suppressions inside logical expressions", async () => {
    const src = dedent`
    if (true ||
        // $FlowFixMe.
        true ||
        // $FlowFixMe.
        false) {
      console.log('ok');
    }
    `;

    const expected = dedent`
    if (true ||
        true ||
        false) {
      console.log('ok');
    }
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove suppressions inside function arguments", async () => {
    const src = dedent`
    fn(
      // $FlowFixMe[method-unbinding]
      arg
    );
    `;

    const expected = dedent`
    fn(
      arg
    );
    `;

    expect(await transform(src)).toEqual(expected);
  });

  it("should remove multiple suppressions", async () => {
    const src = dedent`
    const handler = () => {
      // $FlowIgnore - test
      const validWindowTarget = true;

      // $FlowIgnore - test
      const unknownWindowTarget = false;

      console.log(validWindowTarget.name);
    };
    `;

    const expected = dedent`
    const handler = () => {
      const validWindowTarget = true;

      const unknownWindowTarget = false;

      console.log(validWindowTarget.name);
    };
    `;

    expect(await transform(src)).toEqual(expected);
  });
});
