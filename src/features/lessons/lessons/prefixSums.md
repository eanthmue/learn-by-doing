# Learning Goals

- Build a prefix sum array from left to right using a running total.
- Explain why prefix sums include an extra leading zero.
- Answer inclusive range-sum queries with one subtraction.
- Choose prefix sums when many queries reuse the same input array.

# Concept

## What is a Prefix Sum?

Think of a prefix sum array as a running total of your numbers, but shifted by one position.

If your input array is `nums = [3, -2, 5, 1, 6]`:

- Before you look at any numbers, your total is `0`.
- After adding `3`, your total is `3`.
- After adding `-2`, your total is `1` (`3 + (-2)`).
- After adding `5`, your total is `6` (`1 + 5`), and so on.

When you build the prefix array, you store these running totals. It looks like this:

`prefix = [0, 3, 1, 6, 7, 13]`

::: array-diagram
:::

## Why the Leading Zero is Necessary

The extra `0` at the very beginning is a clever design choice to prevent your code from crashing or needing extra if/else statements when querying ranges.

Notice the mapping between the arrays:

- `prefix[0]` = Sum of the first 0 elements (always 0)
- `prefix[1]` = Sum of the first 1 element (3)
- `prefix[2]` = Sum of the first 2 elements (3 + -2 = 1)
- `prefix[5]` = Sum of the first 5 elements (the whole array = 13)

Because of this shift, `prefix[i]` always represents the sum of everything before index `i`. The sum from `left` to `right` is `prefix[right + 1] - prefix[left]`.

::: pattern
prefix = [0]
for each index i from 0 to length - 1:
    prefix[i + 1] = prefix[i] + nums[i]

sum(left, right) = prefix[right + 1] - prefix[left]
:::

## The Problem It Solves

Imagine you have an array of 1,000,000 numbers, and you are asked to find the sum of elements from index 100,000 to 800,000.

**The Naive Way**: You run a for loop from 100,000 to 800,000 and add them up. If you only have to do this once, a loop is fine.

**The Scalability Issue**: What if your application needs to answer 100,000 different range queries on that same array? Running a loop every single time means your code will slow down to a crawl.

## The Tradeoff (Time vs. Space)

**Upfront Cost**: You loop through the array exactly once to build the prefix array. This takes `O(n)` time and `O(n)` extra space to store the results.

**The Payoff**: Once that prefix array is built, you throw away the loops entirely. For every future query, you just look up two numbers in the array and subtract them (`prefix[right + 1] - prefix[left]`).

Because array lookups and subtraction take a constant fraction of a second, every single query now runs in `O(1)` constant time.

## A Quick Rule of Thumb

You should use a prefix sum if your scenario meets these two conditions:

- **The data is static**: The numbers in the original array aren't changing (if elements change constantly, your prefix array becomes outdated and you have to rebuild it).
- **High query volume**: You need to ask "what is the sum of this sub-range?" multiple times.

If you are only asking for a sum once, just use a normal loop. If you are asking many times, prefix sum is the clear winner.

# Complexity

| Metric | Value | Reason |
| --- | --- | --- |
| Time | O(n + q) | Building the prefix array visits `n` values once, then each of the `q` range queries takes constant time. |
| Space | O(n) | The prefix array stores one number for each input position, plus an extra leading `0`. |

# Common Mistakes

## Forgetting the extra leading zero

Bad:

```js
prefix[0] = nums[0];
```

Good:

```js
const prefix = [0];
```

## Using right instead of right + 1

Bad:

```js
return prefix[right] - prefix[left];
```

Good:

```js
return prefix[right + 1] - prefix[left];
```

## Rebuilding prefix for every query

Bad:

```js
queries.map((query) => rangeSum(buildPrefixSums(nums), query[0], query[1]))
```

Good:

```js
const prefix = buildPrefixSums(nums);
```

# Practice

## Answer many range-sum queries

Write a function `rangeSums(nums, queries)` that returns an array of sums. Each query is a pair `[left, right]` and both endpoints are included.

Examples:

- `rangeSums([3, -2, 5, 1, 6], [[1, 3]])` -> `[4]`
- `rangeSums([2, 4, 6], [[0, 2], [1, 1]])` -> `[12, 4]`
- `rangeSums([], [])` -> `[]`
- `rangeSums([5], [[0, 0]])` -> `[5]`

# Reflection

Why does `prefix[right + 1] - prefix[left]` remove exactly the values before `left` while keeping the values through `right`?
