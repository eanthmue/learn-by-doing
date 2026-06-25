# Learning Goals

- Explain what an array index is and how it maps to a position.
- Traverse an array from start to end using a for loop and track a running result.
- Apply a predicate function during traversal to count or filter values.
- Predict the output of a traversal given a specific input array.

# Concept

An **array** is a collection of values, where each value sits at a numbered position called an **index**. The first index is `0`, the second is `1`, and so on up to `length - 1`.

::: array-diagram
:::

**Traversal** means visiting every element exactly once, usually from index `0` to the last index. During the visit you can read each value and combine it into a result: a sum, a maximum, a count, or sometimes a new array.

::: pattern
let result = <initial value>
for each index i from 0 to length - 1:
    update result using array[i]
return result
:::

## When to use it

Use a single-pass traversal whenever the answer depends on _every element_ and each element can be processed independently. If you only need part of the array or elements depend on far-away positions, a different pattern such as sliding window or two pointers may be more efficient, but traversal is almost always the first tool to reach for.

## The invariant

At the end of iteration `i`, `result` reflects the correct answer for the sub-array `array[0..i]`. When `i` reaches `length - 1`, `result` holds the answer for the entire array.

# Complexity

| Metric | Value | Reason |
| --- | --- | --- |
| Time | O(n) | The loop visits each of the `n` elements exactly once. |
| Space | O(1) | The shown accumulator examples store only a single running value regardless of input size. Traversals that build a new output array use `O(n)` output space. |

# Common Mistakes

## Off-by-one on the loop bound

Bad:

```js
for (let i = 0; i < arr.length - 1; i++)
```

Good:

```js
for (let i = 0; i < arr.length; i++)
```

## Wrong initial value for max

Bad:

```js
let best = 0; // stays 0 if all values are negative
```

Good:

```js
let best = -Infinity;
```

## Using index when you mean value

Bad:

```js
total += i; // adds indices, not values
```

Good:

```js
total += arr[i];
```

# Practice

## Count values greater than a threshold

Write a function `countAbove(arr, threshold)` that returns how many values are **strictly greater than** `threshold`.

Examples:

- `countAbove([3, 8, 1, 10, 5], 4)` -> `3`
- `countAbove([1, 2, 3], 10)` -> `0`
- `countAbove([], 5)` -> `0`
- `countAbove([7, 7, 7], 7)` -> `0`

# Reflection

In your own words, explain why the initial value of the accumulator matters. What would go wrong if you initialized `max` to `0` and the input array contained only negative numbers?
