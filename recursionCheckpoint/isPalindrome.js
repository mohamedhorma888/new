/**
 * Checks if a word is a palindrome using recursion
 * A palindrome reads the same forwards and backwards
 * 
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is a palindrome, false otherwise
 */
function isPalindrome(word) {
  // Base case: empty word or single character is a palindrome
  if (word.length <= 1) {
    return true;
  }

  // Compare characters at both ends of the word
  if (word[0] === word[word.length - 1]) {
    // Characters match, recursively check the rest of the word
    return isPalindrome(word.slice(1, -1));
  } else {
    // Characters don't match, not a palindrome
    return false;
  }
}

// Test cases
console.log(isPalindrome("gag"));      // true
console.log(isPalindrome("kayak"));    // true
console.log(isPalindrome("php"));      // true
console.log(isPalindrome("radar"));    // true
console.log(isPalindrome("hello"));    // false
console.log(isPalindrome("a"));        // true (single character)
console.log(isPalindrome(""));         // true (empty string)
console.log(isPalindrome("racecar"));  // true
