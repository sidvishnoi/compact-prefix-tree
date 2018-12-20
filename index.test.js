const { CompactPrefixTree, getWordsFromTrie } = require(".");

const testItems = [
  "http://www.w3.org/TR/mixed-content/",
  "http://www.w3.org/TR/referrer-policy/",
  "http://www.w3.org/TR/SRI/",
  "http://www.w3.org/TR/upgrade-insecure-requests/",
  "https://console.spec.whatwg.org/",
  "https://dom.spec.whatwg.org/",
  "https://drafts.css-houdini.org/box-tree-api-1/",
  "https://drafts.css-houdini.org/css-animationworklet-1/",
  "https://drafts.css-houdini.org/css-layout-api-1/",
  "https://drafts.css-houdini.org/css-paint-api-1/",
  "https://drafts.css-houdini.org/css-properties-values-api-1/",
  "https://drafts.css-houdini.org/css-typed-om-1/",
  "https://drafts.css-houdini.org/font-metrics-api-1/",
  "https://drafts.css-houdini.org/worklets/",
  "https://drafts.csswg.org/css-2007/",
  "https://drafts.csswg.org/css-2010/",
  "https://drafts.csswg.org/css-2015/",
  "https://drafts.csswg.org/css-2017/",
  "https://drafts.csswg.org/css-2018/",
  "https://drafts.csswg.org/css-align-3/",
  "https://drafts.csswg.org/css-animations-1/",
  "https://drafts.csswg.org/css-animations-2/",
];
const sampleTrie = {
  "http": {
    "://www.w3.org/TR/": {
      "mixed-content/": null,
      "referrer-policy/": null,
      "SRI/": null,
      "upgrade-insecure-requests/": null
    },
    "s://": {
      "console.spec.whatwg.org/": null,
      "dom.spec.whatwg.org/": null,
      "drafts.css": {
        "-houdini.org/": {
          "box-tree-api-1/": null,
          "css-": {
            "animationworklet-1/": null,
            "layout-api-1/": null,
            "paint-api-1/": null,
            "properties-values-api-1/": null,
            "typed-om-1/": null
          },
          "font-metrics-api-1/": null,
          "worklets/": null
        },
        "wg.org/css-": {
          "20": {
            "07/": null,
            "10/": null,
            "15/": null,
            "17/": null,
            "18/": null
          },
          "align-3/": null,
          "animations-": {
            "1/": null,
            "2/": null
          }
        }
      }
    }
  }
};

test("contructor: throws if argument passed is invalid", () => {
  expect(() => new CompactPrefixTree("abc")).toThrow();
  expect(() => new CompactPrefixTree([1])).toThrow();
});

test("contructor: accepts string[]", () => {
  expect(() => new CompactPrefixTree()).not.toThrow();
  expect(() => new CompactPrefixTree(["abc"])).not.toThrow();

  const items = ["abc", "abcde"];
  const trie = new CompactPrefixTree(items);
  expect(trie).toBeInstanceOf(CompactPrefixTree);
});

test("constructor: builds trie", () => {
  const trie = new CompactPrefixTree(["abc", "abcde"]);
  expect(trie.items).toEqual(new Set(["abc", "abcde"]));
  expect(Object.keys(trie.T)).toEqual(["abc"]);
  expect(Object.keys(trie.T.abc)).toEqual(["", "de"]);
});

test("add: allows adding new items in trie", () => {
  const trie = new CompactPrefixTree(["abc"]);
  expect(trie.items).toEqual(new Set(["abc"]));
  expect(Object.keys(trie.T)).toEqual(["abc"]);
  trie.add("abcde");
  expect(trie.items).toEqual(new Set(["abc", "abcde"]));
  expect(Object.keys(trie.T.abc)).toEqual(["", "de"]);
});

test("prefix: finds longest prefix if exists", () => {
  const trie = new CompactPrefixTree([
    "http://www.example.com/foo/",
    "http://www.example.com/john/",
    "http://www.example.com/baz/",
  ]);

  const p1 = trie.prefix("http://www.example.com/foo/");
  expect(p1.prefix).toEqual("http://www.example.com/foo/");
  expect(p1.isProper).toBeTruthy();

  const p2 = trie.prefix("http://www.example.com/john/doe");
  expect(p2.prefix).toEqual("http://www.example.com/john/");
  expect(p2.isProper).toBeTruthy();

  const p3 = trie.prefix("http://www.example.com/bazinga");
  expect(p3.prefix).toEqual("http://www.example.com/");
  expect(p3.isProper).toBeFalsy();
});

test("getWordsFromTrie: gets words from JSON", () => {
  const words = getWordsFromTrie(sampleTrie);
  expect(words.size).toEqual(testItems.length);
  expect(words).toEqual(new Set(testItems));
});

test("mixed: can build a complex trie", () => {
  const trie = new CompactPrefixTree(testItems);
  expect(trie.items.size).toEqual(testItems.length);
  expect(Object.keys(trie.T)).toEqual(["http"]);
  expect(Object.keys(trie.T.http)).toEqual(["://www.w3.org/TR/", "s://"]);
  expect(Object.keys(trie.T.http["s://"])).toEqual([
    "console.spec.whatwg.org/",
    "dom.spec.whatwg.org/",
    "drafts.css",
  ]);
  expect(trie.T.http["s://"]["console.spec.whatwg.org/"]).toEqual(null);
  expect(trie.T).toEqual(sampleTrie)
});
