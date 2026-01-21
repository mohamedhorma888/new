// Decision Making: Leap Year Checker
function isLeapYear(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        return true;
    } else {
        return false;
    }
}

// Decision Making: Ticket Pricing
function getTicketPrice(age) {
    if (age <= 12) {
        return 10;
    } else if (age >= 13 && age <= 17) {
        return 15;
    } else {
        return 20;
    }
}

// Recursion: Fibonacci Sequence
function fibonacci(n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

// Recursion: Palindrome Checker
function isPalindrome(str) {
    // Remove spaces, punctuation, and convert to lowercase
    str = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (str.length <= 1) {
        return true;
    }
    if (str[0] === str[str.length - 1]) {
        return isPalindrome(str.slice(1, -1));
    } else {
        return false;
    }
}

// Test the functions
console.log("Leap Year 2020:", isLeapYear(2020)); // true
console.log("Leap Year 1900:", isLeapYear(1900)); // false
console.log("Leap Year 2000:", isLeapYear(2000)); // true

console.log("Ticket Price for age 10:", getTicketPrice(10)); // 10
console.log("Ticket Price for age 15:", getTicketPrice(15)); // 15
console.log("Ticket Price for age 25:", getTicketPrice(25)); // 20

console.log("Fibonacci 5:", fibonacci(5)); // 5
console.log("Fibonacci 10:", fibonacci(10)); // 55

console.log("Palindrome 'A man a plan a canal Panama':", isPalindrome("A man a plan a canal Panama")); // true
console.log("Palindrome 'hello':", isPalindrome("hello")); // false