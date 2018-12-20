// @ts-check
class CompactPrefixTree {
  /**
   * Create a CompactPrefixTree from the given list of words
   * @param {string[]} words
   */
  constructor(words = []) {
    if (!Array.isArray(words)) {
      throw new TypeError(`Expected string[], got ${typeof words}`);
    }
    /** @type {Set<string>} */
    this.words = new Set();

    /** @type {import(".").Trie} */
    this.T = {};

    for (const word of words) {
      this.add(word);
    }
  }

  /**
   * Add a word to the trie
   * @param {string} word
   */
  add(word) {
    if (typeof word !== "string") {
      throw new TypeError(`Expected string, got ${typeof word}`);
    }
    if (!word.length) return;
    this.words.add(word);
    add(word, this.T);
    return this;
  }

  /**
   * Get the longest prefix of word
   * @param {string} word
   */
  prefix(word) {
    return getPrefix(word, this.T);
  }

  /**
   * Get all entries from the trie
   * @returns {Set<string>}
   */
  get items() {
    if (this.words.size && Object.keys(this.T)) {
      return this.words;
    }
    return getWordsFromTrie(this.T);
  }
}

module.exports = {
  add,
  CompactPrefixTree,
  default: CompactPrefixTree,
  getPrefix,
  getWordsFromTrie,
};

/**
 * Add a word to Trie
 * @param {string} word word to add
 * @param {import(".").Trie} T plain JS object with prefixes
 */
function add(word, T) {
  let l = word.length;
  if (!l) return;

  // search for existing prefixes
  while (l--) {
    const prefix = word.substr(0, l + 1);
    if (T !== null && T.hasOwnProperty(prefix)) {
      // found prefix, move into subtrie
      if (T[prefix] === null) {
        // if one word is a pure subset of another word,
        // the prefix should also point to the subset
        T[prefix] = { "": null };
      }
      return add(word.substr(l + 1), T[prefix]);
    }
  }

  // no prefix found. insert word and check for prefix collision
  const siblings = Object.keys(T);
  l = word.length;

  const hasSiblings = siblings.some(sibling => {
    let s = 0;
    while (s < l && sibling[s] == word[s]) s++;
    const commonPrefix = s < l && s > 1 ? sibling.substr(0, s) : "";

    if (commonPrefix) {
      // rearrange the trie to move word with prefix collision
      // into new common prefix subtrie
      T[commonPrefix] = {};
      add(sibling.substr(s), T[commonPrefix]);
      T[commonPrefix][sibling.substr(s)] = T[sibling];
      add(word.substr(s), T[commonPrefix]);
      delete T[sibling];
      return true;
    }
    return false;
  });

  // no siblings at this level. take a new branch.
  if (!hasSiblings) {
    T[word] = null;
  }
}

/**
 * Get longest prefix of word in Trie
 * @param {string} word word whose prefix is to be searched
 * @param {import(".").Trie} T tree
 */
function getPrefix(word, T) {
  const len = word.length;
  let prefix = "";
  let i = 0;
  while (T !== null && i < len) {
    let key = "";
    while (!T.hasOwnProperty(key) && i < len) {
      key += word[i++];
    }
    if (!T.hasOwnProperty(key)) break;
    prefix += key;
    T = T[key] || null;
  }
  return { prefix, isProper: T === null };
}

/**
 * Get all entries from the trie
 * @param {import(".").Trie} T
 * @returns {Set<string>}
 */
function getWordsFromTrie(T) {
  const words = new Set();
  _getWords(T, words, "");
  return words;
}

/**
 * Get all entries from the trie
 * @param {import(".").Trie} T
 * @param {Set<string>} words
 * @param {string} prefix
 */
function _getWords(T, words, prefix) {
  for (const pre of Object.keys(T)) {
    const word = prefix + pre;
    words.add(word);
    if (T.hasOwnProperty(pre) && T[pre] !== null) {
      words.delete(word);
      _getWords(T[pre], words, word);
    }
  }
}
