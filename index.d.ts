export class CompactPrefixTree {
  /**
   * Create a CompactPrefixTree from the given list of words
   */
  constructor(words: string[]);

  /**
   * Add a word to the trie
   */
  add(word: string): this;

  /**
   * Get the longest prefix of word
   */
  prefix(word: string): string;

  /**
   * Get all entries from the trie
   */
  get items(): Set<string>;
}

export interface Trie {
  [prefix: string]: Trie | null;
}

/**
 * Add a word to Trie
 * @param word word to add
 * @param T plain JS object with prefixes
 */
declare function add(word: string, T: Trie): void;

/**
 * Get longest prefix of word in Trie
 * @param word word whose prefix is to be searched
 * @param T plain JS object with prefixes
 */
declare function getPrefix(
  word: string,
  T: Trie,
): { prefix: string; isProper: boolean };

/**
 * Get all entries from the trie
 * @param T plain JS object with prefixes
 */
declare function getWordsFromTrie(T: Trie): Set<string>;
