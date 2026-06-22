# Array Traversal and Indexing

## Learning Goals

1. Explain what an array index is and how it maps to a position in memory.
2. Traverse an array from start to end using a `for` loop and track a running result.
3. Apply a predicate function during traversal to count or filter values.
4. Predict the output of a traversal given a specific input array.

---

## Concept Explanation

An **array** is an ordered list of values. Each value sits at a numbered position called an **index**. In JavaScript, the first index is `0`, the second is `1`, and so on up to `length - 1`.

```
Index:   0    1    2    3    4
Value: [ 10,  25,   3,  42,   8 ]
```

**Traversal** means visiting every element exactly once, usually from index `0` to the last index. During the visit you can read each value and combine it into a result — a sum, a maximum, a count, or a new array.

The pattern looks like this:

```
let result = <initial value>
for each index i from 0 to length - 1:
    update result using array[i]
return result
```

### When to use it

Use a single-pass traversal whenever the answer depends on **every element** and each element can be processed independently. If you only need part of the array or elements depend on far-away positions, a different pattern (sliding window, two pointers) may be more efficient — but traversal is almost always the first tool to reach for.

### The invariant

At the end of iteration `i`, `result` reflects the correct answer for the sub-array `array[0..i]`. When `i` reaches `length - 1`, `result` holds the answer for the entire array.

---

## Worked Example

**Input**: `[4, 7, 2, 9, 1]`

**Task**: Find the maximum value.

| Step | `i` | `array[i]` | `max` before | Comparison        | `max` after |
|------|-----|------------|--------------|-------------------|-------------|
| init | —   | —          | `-Infinity`  | —                 | `-Infinity` |
| 1    | 0   | 4          | `-Infinity`  | `4 > -Infinity` ✓ | 4           |
| 2    | 1   | 7          | 4            | `7 > 4` ✓         | 7           |
| 3    | 2   | 2          | 7            | `2 > 7` ✗         | 7           |
| 4    | 3   | 9          | 7            | `9 > 7` ✓         | 9           |
| 5    | 4   | 1          | 9            | `1 > 9` ✗         | 9           |

**Result**: `9`

---

## Code Sandbox

```javascript
/**
 * Computes the sum of all values in the array.
 */
function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

/**
 * Finds the maximum value in the array.
 * Returns -Infinity for an empty array.
 */
function max(arr) {
  let best = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > best) {
      best = arr[i];
    }
  }
  return best;
}

/**
 * Counts how many values satisfy the given predicate.
 *
 * Example predicate: (value) => value % 2 === 0   (even numbers)
 */
function countByPredicate(arr, predicate) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      count += 1;
    }
  }
  return count;
}

// --- Try it out ---
const numbers = [4, 7, 2, 9, 1];

console.log("Sum:", sum(numbers));              // 23
console.log("Max:", max(numbers));              // 9
console.log("Evens:", countByPredicate(
  numbers, (v) => v % 2 === 0
));                                             // 1
```

> **Try changing the input!** Replace `numbers` with `[10, 20, 30]` or `[-3, 0, 5]` and predict each output before you run the code.

---

## Visualizer States

The visualizer shows the array as a row of boxes. An **active index** highlight moves left to right, and a **result** badge updates on each step.

### Sum of `[4, 7, 2, 9, 1]`

| Frame | Active Index | Highlighted Value | `total` |
|-------|-------------|-------------------|---------|
| 0     | —           | —                 | 0       |
| 1     | 0           | **4**             | 4       |
| 2     | 1           | **7**             | 11      |
| 3     | 2           | **2**             | 13      |
| 4     | 3           | **9**             | 22      |
| 5     | 4           | **1**             | 23      |
| 6     | done        | —                 | **23**  |

### Max of `[4, 7, 2, 9, 1]`

| Frame | Active Index | Highlighted Value | `best` | Updated? |
|-------|-------------|-------------------|--------|----------|
| 0     | —           | —                 | -∞     | —        |
| 1     | 0           | **4**             | 4      | ✓        |
| 2     | 1           | **7**             | 7      | ✓        |
| 3     | 2           | **2**             | 7      | ✗        |
| 4     | 3           | **9**             | 9      | ✓        |
| 5     | 4           | **1**             | 9      | ✗        |
| 6     | done        | —                 | **9**  | —        |

---

## Complexity Note

| Metric | Value  | Reason |
|--------|--------|--------|
| Time   | **O(n)** | The loop visits each of the `n` elements exactly once. |
| Space  | **O(1)** | Only a single accumulator variable (`total`, `best`, or `count`) is stored, regardless of input size. |

A single-pass traversal is the fastest possible way to inspect every element — you cannot do better than O(n) when the answer depends on all values.

---

## Common Mistakes

### 1. Off-by-one on the loop bound

```javascript
// ❌ Bug: skips the last element
for (let i = 0; i < arr.length - 1; i++) { ... }

// ✅ Correct: visits every index from 0 to length - 1
for (let i = 0; i < arr.length; i++) { ... }
```

### 2. Wrong initial value for max

```javascript
// ❌ Bug: if all values are negative, max stays 0
let best = 0;

// ✅ Correct: -Infinity loses to any real number
let best = -Infinity;

// ✅ Also correct: initialise with the first element and start loop at i = 1
let best = arr[0];
for (let i = 1; i < arr.length; i++) { ... }
```

### 3. Using index when you mean value

```javascript
// ❌ Bug: adds indices (0 + 1 + 2 + ...) instead of values
total += i;

// ✅ Correct
total += arr[i];
```

### 4. Forgetting to handle an empty array

```javascript
// When arr.length === 0, the loop body never runs.
// Make sure your initial value is a sensible answer for the empty case.
// For sum → 0 is fine.
// For max → -Infinity (or return undefined / throw explicitly).
```

---

## Practice Task

### Count values greater than a threshold

Write a function `countAbove(arr, threshold)` that returns how many values in `arr` are **strictly greater than** `threshold`.

**Expected behavior**:

```javascript
countAbove([3, 8, 1, 10, 5], 4)   // → 3   (8, 10, 5 are above 4)
countAbove([1, 2, 3], 10)          // → 0
countAbove([], 5)                  // → 0
countAbove([7, 7, 7], 7)           // → 0   (strictly greater, not equal)
```

**Starter code**:

```javascript
function countAbove(arr, threshold) {
  // Your code here
}
```

**Hint**: This is the same shape as `countByPredicate` — loop through every index, check a condition, and increment a counter.

---

## Reflection Check

> In your own words, explain why the initial value of the accumulator matters. What would go wrong if you initialised `max` to `0` and the input array contained only negative numbers?
