import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { types } from "recast";
import { TransformerInput } from "./transformer";

const flowComments = [
  "@flow",
  "$FlowFixMe",
  "$FlowIssue",
  "$FlowExpectedError",
  "$FlowIgnore",
];

const filterComments = (comments: readonly t.Comment[] | null | undefined) => {
  return comments
    ?.filter(
      (comment) => !flowComments.some((c) => comment.value.includes(c))
    )
    .map((comment) => {
      if (comment.value.includes("@noflow")) {
        return {
          ...comment,
          value: comment.value.replace(/@noflow/, "@ts-nocheck"),
        };
      }

      return comment;
    });
}

/**
 * Scan through top level programs, or code blocks and remove Flow-specific comments
 */
const removeComments = (
  path:
    | NodePath<t.Program>
    | NodePath<t.BlockStatement>
    | NodePath<t.ClassBody>
    | NodePath<t.StaticBlock>
    | NodePath<t.ObjectProperty>
    | NodePath<t.ObjectExpression>
) => {
  if (path.type === "ObjectProperty") {
    const {node}: {node: types.namedTypes.Node} = path;
    node.comments = filterComments(node.comments as t.Comment[]) || node.comments;
    return;
  }

  if (path.type === "ObjectExpression") {
    const {innerComments} = path.node;
    path.node.innerComments = filterComments(innerComments) || path.node.innerComments;
    return;
  }

  if (path.node.body.length === 0) {
    return;
  }

  const nodes: Array<types.namedTypes.Node> = path.node.body;

  for (const rootNode of nodes) {
    const { comments } = rootNode;
    rootNode.comments = filterComments(comments as t.Comment[]) || rootNode.comments;
  }
};

/**
 * Search the top level program, and blocks like functions and if statements for comments
 */
export function removeFlowComments({ file }: TransformerInput) {
  traverse(file, {
    enter(path) {
      const {node}: {node: types.namedTypes.Node} = path;
      if (node.comments) {
        node.comments = filterComments(node.comments as t.Comment[]) || node.comments;
      }
    },
    Program(path) {
      removeComments(path);
    },
    BlockStatement(path) {
      removeComments(path);
    },
    ClassBody(path) {
      removeComments(path);
    },
    StaticBlock(path) {
      removeComments(path);
    },
    ObjectExpression(path) {
      removeComments(path);
    },
    ObjectProperty(path) {
      removeComments(path);
    }
  });
}
