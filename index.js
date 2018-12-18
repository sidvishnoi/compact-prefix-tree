// @ts-check
class CompactPrefixTree {
  /**
   * Create a CompactPrefixTree from the given list of words
  //  * @param {string[]} words
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
    const prefix = getPrefix(word, this.T);
    const isProper = this.words.has(prefix);
    return {
      prefix,
      isProper
    };
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
  default: CompactPrefixTree,
  getPrefix,
  getWordsFromTrie,
  CompactPrefixTree,
};

/**
 * Add a word to Trie
 * @param {string} word word to add
 * @param {object} T plain JS object with prefixes
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
    const commonPrefix = (s < l && s > 1) ? sibling.substr(0, s) : "";

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
 * @param {string} word
 * @param {object} T
 */
function getPrefix(word, T) {
  return _getPrefix(word, T, "");
}

/**
 *
 * @param {string} word
 * @param {object} T
 * @param {string} pre
 */
function _getPrefix(word, T, pre) {
  if (T === null) return pre;
  let l = word.length;
  if (l === 0) return "";
  let i = 0;
  let prefix = "";
  while (i < l && !T.hasOwnProperty(prefix)) {
    prefix += word[i++];
  }
  return pre + _getPrefix(word.substr(i), T[prefix], prefix);
}

/**
 * Get all entries from the trie
 * @param {object} T
 * @returns {Set<string>}
 */
function getWordsFromTrie(T) {
  const words = new Set();
  _getWords(T, words, "");
  return words;
}

/**
 * Get all entries from the trie
 * @param {object} T
 * @param {Set<string>} words
 * @param {string} prefix
 */
function _getWords(T, words, prefix) {
  for (const pre of Object.keys(T)) {
    const word = prefix + pre;
    words.add(word);
    if (T.hasOwnProperty(pre) && T[pre] !== null && Object.keys(T[pre]).length) {
      words.delete(word);
      _getWords(T[pre], words, word);
    }
  }
}
