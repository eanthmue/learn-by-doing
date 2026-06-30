# Learning Goals

- Trace a fixed-size window as it moves across an array.
- Explain why one value enters while one value leaves on each slide.
- Update a running window sum without adding the whole window again.
- Choose sliding window when nearby answers share most of the same data.

# Concept

## What is a Sliding Window?

Think of a sliding window like a bus traveling down a street. At each stop, one new passenger boards at the front door, and one passenger exits from the back. To know the total number of passengers on the bus, you don't count everyone from scratch at every stop. You simply take the previous count, add 1 (for the entering passenger), and subtract 1 (for the leaving passenger).

This is the core secret of the sliding window. We maintain a frame (the window) of a fixed size over a sequence, and as it slides right, we update our running result in constant time by only processing the elements that change at the edges.

Let's look at a concrete example with `nums = [2, 1, 5, 1, 3, 2, 6]` and a window size `k = 3`:

**Start (Initial window):** We sum the first 3 values: `2 + 1 + 5 = 8`. Our best sum so far is `8`.

**Slide 1:** We slide to the next window `[1, 5, 1]`. The value `2` leaves on the left, and `1` enters on the right. The new sum is `8 - 2 + 1 = 7`. The best sum remains `8`.

**Slide 2:** We slide to `[5, 1, 3]`. The value `1` leaves on the left, and `3` enters on the right. The new sum is `7 - 1 + 3 = 9`. This beats our previous best, so best becomes `9`.

**Slide 3:** We slide to `[1, 3, 2]`. The value `5` leaves on the left, and `2` enters on the right. The new sum is `9 - 5 + 2 = 6`. The best sum remains `9`.

**Slide 4:** We slide to the next window `[3, 2, 6]`. The value `1` leaves on the left, and `6` enters on the right. The new sum is `6 - 1 + 6 = 11`. This beats our previous best, so best becomes `11`.

::: array-diagram
:::

## Why Not Add Every Window From Scratch?

The slow way treats every window like a brand-new problem. For each start position, it adds all the values in the window again, even though most of those values were already counted.

The sliding window keeps the shared middle values. Each slide does only two operations:

- **Subtract** the value that moved out on the left

- **Add** the value that moved in on the right

This keeps the window sum correct while doing constant work per step.

::: pattern
build the first window sum
best = first window sum

for each next right edge:
add the entering value
subtract the leaving value
update best if this window is better
:::

## How the Code Example Works

The code example solves one concrete question: "What is the largest sum of any window with exactly `k` values?" For the lesson visualizer, `k` is `3`.

First, the code checks whether the window size is possible. If `k` is `0`, negative, or larger than the array, there is no full window to inspect, so the function returns `null`.

Next, it builds the first full window by summing the first `k` elements. With `nums = [2, 1, 5, 1, 3, 2, 6]`, it adds `2`, `1`, and `5`, so `windowSum` becomes `8`.

After that, the loop starts at index `right = k`. In each iteration, `nums[right]` enters the window from the right, and the element at `nums[right - k]` leaves the window on the left. We add the entering value, subtract the leaving value, and update `best` if the new sum is larger.

## Why does `right - k` find the leaving value?

Since our window size is exactly `k`, when our right edge is at index `right`, the window contains elements from index `right - k + 1` up to `right`.

The element that was _just_ inside the window at the previous step, but has now been left behind, sits exactly at index `right - k`. Subtracting `nums[right - k]` removes this old left edge and keeps our window size perfectly at `k`.

## The Problem It Solves

- **The Naive Way**: Recalculating the sum of each window of size `k` from scratch. For an array of size $n$, this requires doing $k$ additions for each of the $n - k + 1$ windows, resulting in $O(n \cdot k)$ time complexity. If $n = 100,000$ and $k = 50,000$, this naive approach requires billions of operations and will freeze your application.

- **The Scalable Way**: Using a sliding window to reuse the sum of the previous window. Since each slide only adds and subtracts at the edges, it takes $O(1)$ constant time per step, reducing the total time complexity to $O(n)$ regardless of how large $k$ is.

- **The Tradeoff**: We do slightly more upfront work to build the first window, in exchange for $O(1)$ updates for all subsequent windows. No extra memory is used ($O(1)$ space).

## A Quick Rule of Thumb

Reach for sliding window when the question says **"subarray"**, **"substring"**, **"contiguous"**, or **"at most/at least a certain length"**, and the next candidate answer overlaps heavily with the previous candidate answer (differing by only a single element on each edge).

# Complexity

| Metric | Value | Reason                                                                              |
| ------ | ----- | ----------------------------------------------------------------------------------- |
| Time   | O(n)  | Each input value enters the running sum once and leaves it at most once.            |
| Space  | O(1)  | The algorithm keeps only a few counters and sums, no matter how large the input is. |

# Common Mistakes

## Recomputing the whole window

Using nested loops to compute each window sum from scratch defeats the purpose of the sliding window, reverting the time complexity back to $O(n \cdot k)$ and causing performance bottlenecks.

Bad:

```js
for (let start = 0; start <= nums.length - k; start++) {
  let sum = 0;
  for (let i = start; i < start + k; i++) {
    sum += nums[i];
  }
}
```

Good:

```js
windowSum += nums[right];
windowSum -= nums[right - k];
```

## Forgetting to remove the leaving value

If you only add the entering value without subtracting the leaving value, your window sum will keep growing indefinitely rather than sliding, producing incorrect results.

Bad:

```js
windowSum += nums[right];
```

Good:

```js
windowSum += nums[right];
windowSum -= nums[right - k];
```

## Starting best at zero

If the input array contains only negative numbers, all window sums will be negative. Starting `best` at `0` would cause the function to incorrectly return `0` because `0` is greater than any negative sum, even though `0` is not a valid window sum.

Bad:

```js
let best = 0;
```

Good:

```js
let best = windowSum;
```

# Practice

## Find the best fixed-size window

Write `maxFixedWindowSum(nums, k)` so it returns the largest sum of any contiguous group of exactly `k` values. Return `null` when `k` is not a valid window size for the input.

Examples:

- `maxFixedWindowSum([2, 1, 5, 1, 3, 2, 6], 3)` -> `11`
- `maxFixedWindowSum([4, -1, 2, 10], 2)` -> `12`
- `maxFixedWindowSum([-5, -2, -8], 2)` -> `-7`
- `maxFixedWindowSum([5], 2)` -> `null`

# Reflection

When the window slides one step, why is it enough to subtract one leaving value and add one entering value instead of summing every value inside the window again?
