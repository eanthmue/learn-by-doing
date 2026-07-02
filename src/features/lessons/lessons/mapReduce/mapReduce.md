# Learning Goals

- Explain map as transforming each input value into one output value.
- Explain reduce as combining many values into one final answer.
- Trace a map-then-reduce workflow on `[3, 1, 4]`.
- Choose a starting accumulator value that matches the reducing operation.

# Concept

## The Main Idea

Think of map and reduce as two simple passes over the same list. First you make a changed version of every item. Then you combine those changed items into one answer.

Let's use `[3, 1, 4]` and ask: "What is the sum after doubling every number?"

There are two jobs hiding inside that question:

- **Map job:** double each number, one at a time.
- **Reduce job:** add the doubled numbers into one total.

That means the full path is:

`[3, 1, 4]` -> map by doubling -> `[6, 2, 8]` -> reduce by adding -> `16`

## Real-World Use Case: Counting Server Errors

Imagine a server records one log line for each request:

- `200 GET /home`
- `500 POST /checkout`
- `404 GET /missing-page`
- `500 GET /api/profile`

The question is: "How many failed server requests happened?"

First, map each log line into the number we care about. A `500` error becomes `1` because it counts as a failed request. Everything else becomes `0` for this question.

- `200 GET /home` becomes `0`.
- `500 POST /checkout` becomes `1`.
- `404 GET /missing-page` becomes `0`.
- `500 GET /api/profile` becomes `1`.

Now the mapped list is `[0, 1, 0, 1]`. Then reduce that list by adding the values: `0 + 1 + 0 + 1 = 2`.

That is the same shape as the number example: map turns messy records into simple values, and reduce combines those values into the final answer.

## Map: Same Size, Changed Values

Map does not decide the final answer. It only transforms each value and keeps the list the same size.

Trace the map pass:

- Start with `3`. Double it to get `6`, so the mapped list is `[6, ?, ?]`.
- Move to `1`. Double it to get `2`, so the mapped list is `[6, 2, ?]`.
- Move to `4`. Double it to get `8`, so the mapped list is `[6, 2, 8]`.

The important clue: three inputs became three outputs. Map changes the values, not the number of values.

::: array-diagram
:::

## Reduce: Many Values Become One Answer

Reduce takes a list and carries a running answer through it. That running answer is called the accumulator. For a sum, the accumulator should start at `0` because adding `0` does not change the first real value.

Trace the reduce pass on `[6, 2, 8]`:

- Start with accumulator `0`.
- Add `6`, so the accumulator becomes `6`.
- Add `2`, so the accumulator becomes `8`.
- Add `8`, so the accumulator becomes `16`.

Now the list has been collapsed into one answer: `16`.

::: pattern
Map:
input list -> transformed list
one input value becomes one output value

Reduce:
transformed list -> single answer
accumulator starts with a chosen safe value
accumulator is updated once per value
:::

## Why Split the Work?

You could double and add in one pass, and sometimes that is perfectly fine. Map and reduce are useful when you want the two decisions to stay separate:

- Mapping answers: "What should each value become?"
- Reducing answers: "How should the values be combined?"

For the same mapped list `[6, 2, 8]`, reducing by sum gives `16`, reducing by maximum gives `8`, and reducing by product gives `96`. Separating the steps makes it easier to swap the combining rule without rewriting the transformation rule.

## Why the Starting Value Matters

The starting accumulator should behave like an empty answer for the operation.

For addition, start with `0`:

- `0 + 6 = 6`, so the first value is preserved.

For multiplication, start with `1`:

- `1 * 6 = 6`, so the first value is preserved.

If you used `0` for multiplication, the answer would be stuck at `0` forever because `0 * anything = 0`. That is why the starting value is not a detail; it protects the meaning of the reduce step.

# Complexity

| Metric | Value | Reason |
| --- | --- | --- |
| Time | O(n) | The map pass visits each value once, and the reduce pass visits each mapped value once. |
| Space | O(n) | The mapped list stores one transformed value for each input value. The reduce accumulator itself uses constant extra space. |

# Common Mistakes

## Expecting map to change the list size

Bad:

```text
map the list
skip values that do not matter
return a shorter list
```

Good:

```text
map the list
transform every input value once
return a list with the same number of values
```

## Choosing the wrong starting value for reduce

Bad:

```text
start product at 0
multiply by each value
return the product
```

Good:

```text
start product at 1
multiply by each value
return the product
```

# Practice

## Product of mapped values

Design a routine named `productOfSquares(values)` that squares each number in the list using map, and then multiplies all squared values using reduce. If the list is empty, the product should be `1`.

Examples:

- `productOfSquares([2, 3])` -> `36`
- `productOfSquares([3, 1, 2])` -> `36`
- `productOfSquares([])` -> `1`

# Reflection

In the example `[3, 1, 4]`, which part is the map step and which part is the reduce step? Why would multiplication need a different starting accumulator than addition?