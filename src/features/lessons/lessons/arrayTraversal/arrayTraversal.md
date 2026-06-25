# Learning Goals

- Explain what an array index is and how it maps to a position.
- Traverse an array from start to end using a for loop and track a running result.
- Apply a predicate function during traversal to count or filter values.
- Predict the output of a traversal given a specific input array.

# Concept

## What is Array Traversal?

Think of array traversal as reading a book page by page, from the very beginning to the end. Every time you turn to a new page, you update what you know about the story.

If your input array is `arr = [4, 7, 2, 9, 1]`, traversing means we visit each number one by one to find something out—like their total sum.

- Before looking at any numbers, your total is `0`.
- After visiting the first number `4`, your total is `4`.
- After visiting the next number `7`, your total is `11` (`4 + 7`).
- After visiting `2`, your total is `13` (`11 + 2`).
- After visiting `9`, your total is `22` (`13 + 9`).
- Finally, after visiting `1`, your total is `23` (`22 + 1`).

::: array-diagram
:::

When writing code to do this, you set a starting value (like `total = 0`), and then you loop through the array's positions (called **indices**) to update that value.

::: pattern
let result = <initial value>
for each index i from 0 to length - 1:
    update result using array[i]
return result
:::

## Why We Use a Starting Value

Setting the right starting value is critical, and it depends on what you're trying to find.

Notice the mapping between what we want and how we start:
- **Sum**: Start at `0` (adding `0` to a number doesn't change it).
- **Count**: Start at `0` (you haven't seen anything yet).
- **Maximum**: Start at a very small number like `-Infinity`.

If you were looking for the maximum value in `[-5, -10, -2]`, but you started your `max` at `0`, your code would falsely tell you the highest number is `0`—even though `0` isn't in the list! That's why we start `max` at `-Infinity` to ensure the very first number we read will always overwrite our starting value.

## The Problem It Solves

Imagine you have a list of 10,000 player scores, and you need to find the highest score. 

**The Naive Way**: You manually check `scores[0]`, `scores[1]`, `scores[2]`, writing out 10,000 lines of code. This is impossible to maintain and breaks if the number of players changes.

**The Scalable Way**: You write a single traversal loop that processes every score one by one. The code remains exactly the same whether you have 10 players or 10 million.

## The Cost (Time vs. Space)

**Time Cost**: You must visit every single element one by one. This means the time it takes grows directly with the size of the array, taking `O(n)` time.

**Space Efficiency**: Because you only keep track of a single running value (like a sum or a max), you don't need to create any new arrays. It takes `O(1)` constant space, meaning it uses almost zero extra memory no matter how huge the input array is.

## A Quick Rule of Thumb

You should use a basic array traversal if your scenario meets these two conditions:
- **You need to check everything:** The answer depends on looking at the entire array (like finding a sum, count, or maximum).
- **Independent elements:** Processing one element doesn't require knowing about elements far ahead or behind it.

If you only need to check a small part of the array, or if elements depend on each other (like finding pairs), other patterns like Sliding Window or Two Pointers will be better. But for simple aggregations, traversal is your best friend.

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
