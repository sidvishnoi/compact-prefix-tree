# Compact Prefix Tree

A serializable compact prefix tree (also known as Radix tree or Patricia tree or space-optimized trie) implementation in JavaScript.

## Usage

### Installation

``` bash
npm install compact-prefix-tree
```

### General Usage

``` js
import { CompactPrefixTree } from "compact-prefix-tree";
// OR
const { CompactPrefixTree } = require("compact-prefix-tree/cjs");

const items = [
  "http://www.example.com/foo/",
  "http://www.example.com/baz/",
];

// create a trie from array of strings
const trie = new CompactPrefixTree(items);
// can add items later
trie.add("http://www.example.com/john/");

// look for a prefix of a word
const p1 = trie.prefix("http://www.example.com/john/doe");
// p1: { prefix: "http://www.example.com/john/", isProper: true }
const p2 = trie.prefix("http://www.example.com/bazinga");
// p2: { prefix: "http://www.example.com/", isProper: false }
// above is not proper as it doesn't exist in list of items provided
```

### Serialization

``` js
const { CompactPrefixTree, getWordsFromTrie } = require("compact-prefix-tree");
const items = [
  "http://www.example.com/foo/",
  "https://www.example.com/baz/",
];
const trie = new CompactPrefixTree(items);
const serialized = JSON.stringify(trie.T);
// {
//   "http": {
//     "://www.example.com/foo/": null,
//     "s://www.example.com/baz/": null
//   }
// }

const words = getWordsFromTrie(JSON.parse(serialized));
// Set(2) {"http://www.example.com/foo/" "https://www.example.com/baz/"}

const trie2 = new CompactPrefixTree(Array.from(words));
// assert(isEqual(trie.items, trie2.items));
```

## License

[MIT License] Copyright 2018 Sid Vishnoi (https://sidvishnoi.github.io)
