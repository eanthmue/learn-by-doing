# Learning Goals

- Treat a hard substring problem as scanning fixed-width event codes in a long stream.
- Build a required frequency checklist for a bundle that can appear in any order.
- Slide a word-sized window while updating only the entering and leaving codes.
- Reset on unrelated codes and shrink when one required code appears too many times.
- Explain why each starting alignment must be scanned separately.

# Concept

## Real Problem: Detect Suspicious Action Bundles

Think of a bank's security system recording customer actions as three-letter event codes on a ticker tape: `pay` (payment), `log` (login), and `adm` (admin access). To catch a security breach, the security team wants to flag when a user performs all three actions in any order, with no other events in between. For example, a stream like `paylogadmseelogadmpay` records `pay`, then `log`, then `adm`, then `see`, and so on.

The order of actions in the bundle can vary: `pay log adm` and `log adm pay` should both be flagged. However, we cannot allow any unrelated actions (like `see`) in the middle, and every required action must appear the exact number of times. How do we spot these quick bundles of actions in a continuous stream of codes without wasting computation?

## The Concrete Stream

Use `stream = paylogadmseelogadmpay` and a required bundle `[pay, log, adm]`. Each event code has width `3`, so the aligned chunks in our first pass are `pay | log | adm | see | log | adm | pay`.

Let's trace how the sliding window processes these chunks step-by-step for the alignment starting at index `0`:

- **Step 1 (Index 0)**: The scanner reads `pay`. It matches our required checklist, so we add it to our window counts: `{ pay: 1 }`. Matched count is `1`. Window bounds: `[0, 2]`.
- **Step 2 (Index 3)**: The scanner reads `log`. It matches our checklist, so we add it: `{ pay: 1, log: 1 }`. Matched count is `2`. Window bounds: `[0, 5]`.
- **Step 3 (Index 6)**: The scanner reads `adm`. It matches our checklist, so we add it: `{ pay: 1, log: 1, adm: 1 }`. Matched count is `3`.
  - **Match Found!** Our window counts match the required checklist exactly. We record the start index `0`.
  - **Shrink to keep moving**: We slide the left edge forward by removing the oldest chunk `pay` (index 0). Our window counts become `{ log: 1, adm: 1 }`. Matched count decreases to `2`. The left boundary is now at index `3`. Window bounds: `[3, 8]`.
- **Step 4 (Index 9)**: The scanner reads `see`. Since `see` is not on the checklist, it breaks our contiguous block.
  - **Reset**: Any window containing `see` is invalid. Keeping old counts would corrupt future checks. We clear our window counts completely `{}` and reset matched count to `0`. The left edge jumps past `see` to index `12`.
- **Step 5 (Index 12)**: The scanner reads `log`. We add it to our counts: `{ log: 1 }`. Matched count is `1`. Window bounds: `[12, 14]`.
- **Step 6 (Index 15)**: The scanner reads `adm`. We add it: `{ log: 1, adm: 1 }`. Matched count is `2`. Window bounds: `[12, 17]`.
- **Step 7 (Index 18)**: The scanner reads `pay`. We add it: `{ log: 1, adm: 1, pay: 1 }`. Matched count is `3`.
  - **Match Found!** We record start index `12`.
  - **Shrink to keep moving**: We remove the oldest chunk `log` (index 12). Our window counts become `{ adm: 1, pay: 1 }`. Matched count is `2`. The left boundary is now at index `15`.

## Why This Is Still Sliding Window

In simpler sliding window problems, you might keep a running sum of numbers. Here, we keep a running checklist of word frequencies. When a new word enters from the right, its count goes up. When a word leaves from the left, its count goes down.

The window is valid only while no code appears too many times. If the bundle needs one `pay` but our window has two, we shrink the left side (removing words) until our window counts are safe again.

::: pattern
build the required checklist

for each possible chunk alignment (from 0 to wordLength - 1):
  clear the current window
  scan one word-sized chunk at a time
  reset when the chunk is unrelated
  shrink when a required chunk appears too many times
  record left when the window has the whole bundle
:::

## Why Scan Multiple Alignments?

If we didn't scan each alignment separately, we might start a window at index `0` and then check index `1`, `2`, `3` etc. However, because our event codes are exactly `3` characters long, doing so would cut through the middle of `pay` and read `ayl` (characters from indices 1, 2, and 3), which isn't a valid event code at all.

By scanning starting at offset `0`, offset `1`, and offset `2` separately, we ensure we only read complete event codes. Each scan acts like a separate conveyor belt starting position, reading labels in clean blocks of three.

## Why Reset on an Unknown Code?

When the scanner reads `see`, we know this code is not part of our required bundle. If we didn't reset, `see` would remain in our window and corrupt our counts. We would never reach a perfect match because `see` would always keep our matched count incorrect.

Resetting completely clears the window state, moves our left boundary past the invalid code, and lets us start fresh from the very next chunk.

## Why Shrink on Too Many Copies?

Suppose our required checklist needs `[pay, pay, log]`. If the window reads a third `pay` (e.g., `pay | pay | pay | log`), the window is invalid because it contains too many copies.

If we didn't shrink from the left to remove the extra `pay` codes, our counts would remain invalid forever, and we would miss any valid windows that start immediately after the first `pay`. Shrinking keeps the window counts honest and active.

## Tradeoffs and Rules of Thumb

- **The Problem It Solves**: Naive substring checking extracts all possible substrings of length `bundle.length * wordLength` and counts their words from scratch. This takes $O(n \cdot m)$ time. Using a sliding window reduces the time to $O(n)$ by updating counts incrementally.
- **The Tradeoff**: We spend $O(m)$ extra space to store the frequency map of the bundle, but we gain an optimal linear-time scan.
- **Rule of Thumb**: When you need to find substrings made of a set of equal-length words in any order, use a sliding window with separate alignment offsets to process chunks as discrete units.

# Complexity

| Metric | Value | Reason                                                                                                                |
| ------ | ----- | --------------------------------------------------------------------------------------------------------------------- |
| Time   | O(n)  | Each fixed-width chunk enters a window once and leaves at most once across the alignment scans.                       |
| Space  | O(m)  | The scanner stores counts for the required bundle, where `m` is the number of distinct event codes in the bundle.     |

# Common Mistakes

## Moving one character at a time inside an alignment

Bad:

```js
right += 1;
```

Good:

```js
right += wordLength;
```

## Forgetting to reset after an unrelated code

Bad:

```js
if (!required.has(word)) {
  continue;
}
```

Good:

```js
if (!required.has(word)) {
  window.clear();
  matchedWords = 0;
  left = right + wordLength;
  continue;
}
```

## Recording a match without checking exact counts

Bad:

```js
if (matchedWords >= bundle.length) {
  starts.push(left);
}
```

Good:

```js
while ((window.get(word) ?? 0) > (required.get(word) ?? 0)) {
  const leftWord = stream.slice(left, left + wordLength);
  window.set(leftWord, (window.get(leftWord) ?? 0) - 1);
  matchedWords -= 1;
  left += wordLength;
}

if (matchedWords === bundle.length) {
  starts.push(left);
}
```

# Practice

## Find every suspicious bundle

Write `findRiskBundles(stream, bundle)` so it returns every starting index where all event codes in `bundle` appear consecutively in `stream`, in any order, with exact counts. Every code in `bundle` has the same width.

Examples:

- `findRiskBundles("paylogadmseelogadmpay", ["pay", "log", "adm"])` -> `[0, 12]`
- `findRiskBundles("logpaypayadm", ["pay", "pay", "log"])` -> `[0]`
- `findRiskBundles("payseelogadm", ["pay", "log", "adm"])` -> `[]`

# Reflection

Why is an unrelated event code enough to clear the whole current window, while an extra copy of a required event only makes the left edge move forward?