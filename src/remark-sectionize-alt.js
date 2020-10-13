const findAfter = require("unist-util-find-after");
const visit = require("unist-util-visit-parents");
const is = require("unist-util-is");

// Based on 'remark-sectionize' but modified to only care
// about top level headings, i.e. 'h1', and also to wrap the
// first few paragrphs (before the first heading) in a section
// also.

const DEPTH = 1;

module.exports = plugin;

function plugin() {
  return transform;
}

function transform(tree) {
  const firstNode = tree.children[0];
  visit(
    tree,
    (node) =>
      is(firstNode, node) || (node.type === "heading" && node.depth === DEPTH),
    sectionize
  );
}

function sectionize(node, ancestors) {
  const start = node;
  const depth = DEPTH;
  const parent = ancestors[ancestors.length - 1];

  const isEnd = (node) =>
    (node.type === "heading" && node.depth <= depth) || node.type === "export";
  const end = findAfter(parent, start, isEnd);

  const startIndex = parent.children.indexOf(start);
  const endIndex = parent.children.indexOf(end);

  const between = parent.children.slice(
    startIndex,
    endIndex > 0 ? endIndex : undefined
  );

  const section = {
    type: "section",
    depth: depth,
    children: between,
    data: {
      hName: "section",
    },
  };

  parent.children.splice(startIndex, section.children.length, section);
}
