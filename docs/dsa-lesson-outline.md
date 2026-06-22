# DSA Lesson Outline

This outline defines the first Data Structures and Algorithms curriculum for LearnByDoing. Each lesson should support the product loop from the PRD: read the concept, edit runnable code, and inspect a synchronized visualization.

## Lesson Design Principles

- Teach one core idea per lesson.
- Start from the learner's mental model before introducing implementation details.
- Prefer small, traceable examples over broad abstract explanations.
- Include at least one "change the input and predict the result" activity.
- Make time and space complexity visible through the example.
- End with a short practice prompt that reuses the same pattern in a new context.

## Standard Lesson Template

Each lesson should include:

- **Title**: Clear concept name, such as "Two Pointers on Sorted Arrays".
- **Learning goals**: 2-4 concrete outcomes.
- **Concept explanation**: The core idea, when to use it, and what invariant makes it work.
- **Worked example**: A small input traced step by step.
- **Code sandbox**: Editable JavaScript or TypeScript starter code.
- **Visualizer states**: Ordered animation steps with highlighted values, pointers, queue entries, stack frames, or table cells.
- **Complexity note**: Time and space complexity with a short justification.
- **Common mistakes**: Off-by-one cases, mutation mistakes, missing base cases, or incorrect visited-state handling.
- **Practice task**: A focused challenge with expected behavior.
- **Reflection check**: One question that asks the learner to explain the idea in their own words.

## Curriculum Path

### 1. Arrays and Strings

Goal: Build comfort with indexed data, scanning, and local state.

1. Array traversal and indexing
   - Visual: active index moving left to right.
   - Code: compute sum, max, and count by predicate.
   - Practice: count values greater than a threshold.

2. Prefix sums
   - Visual: running total array building one cell at a time.
   - Code: range sum query.
   - Practice: find the highest scoring subarray of fixed length.

3. Sliding window
   - Visual: expanding and shrinking window boundaries.
   - Code: maximum sum subarray of size `k`.
   - Practice: longest substring with at most `k` distinct characters.

4. Two pointers
   - Visual: left and right pointers converging.
   - Code: pair sum in a sorted array.
   - Practice: remove duplicates from a sorted array.

5. String frequency maps
   - Visual: character counts updating as the scan moves.
   - Code: valid anagram.
   - Practice: first non-repeating character.

### 2. Recursion and Backtracking

Goal: Make call stacks, base cases, and branching choices visible.

1. Recursion fundamentals
   - Visual: stack frames pushing and popping.
   - Code: factorial and array sum.
   - Practice: reverse a string recursively.

2. Tree-shaped recursion
   - Visual: recursive calls forming a branching tree.
   - Code: generate binary strings of length `n`.
   - Practice: generate all subsets.

3. Backtracking choices
   - Visual: choose, explore, unchoose cycle.
   - Code: permutations.
   - Practice: combination sum with positive numbers.

### 3. Linked Lists

Goal: Understand references, pointer rewiring, and traversal safety.

1. Singly linked list traversal
   - Visual: current pointer advancing through nodes.
   - Code: find length and search value.
   - Practice: get value at index.

2. Insert and delete nodes
   - Visual: next pointers changing before and after the operation.
   - Code: insert after a node.
   - Practice: remove first matching value.

3. Fast and slow pointers
   - Visual: two pointers moving at different speeds.
   - Code: find middle node.
   - Practice: detect a cycle.

### 4. Stacks and Queues

Goal: Connect simple data structures to parsing, history, and breadth-first processing.

1. Stack basics
   - Visual: push and pop from the same end.
   - Code: valid parentheses.
   - Practice: remove adjacent duplicates.

2. Queue basics
   - Visual: enqueue at back, dequeue from front.
   - Code: simulate a print queue.
   - Practice: first task completed after `n` steps.

3. Monotonic stack
   - Visual: stack preserving increasing or decreasing order.
   - Code: next greater element.
   - Practice: daily temperatures.

### 5. Sorting and Searching

Goal: Teach comparison, partitioning, and search-space reduction.

1. Linear search vs binary search
   - Visual: active search range shrinking.
   - Code: binary search in a sorted array.
   - Practice: find first value greater than or equal to target.

2. Bubble sort as a visual baseline
   - Visual: adjacent comparisons and swaps.
   - Code: bubble sort.
   - Practice: count swaps.

3. Merge sort
   - Visual: split arrays and merge sorted halves.
   - Code: merge two sorted arrays, then merge sort.
   - Practice: sort objects by score.

4. Quick sort partitioning
   - Visual: pivot, boundary, and scan pointer.
   - Code: partition around pivot.
   - Practice: find kth largest using partition logic.

### 6. Hash Tables and Sets

Goal: Use hashing to trade space for faster lookup.

1. Set membership
   - Visual: values moving into a lookup set.
   - Code: contains duplicate.
   - Practice: intersection of two arrays.

2. Hash map counting
   - Visual: key counts updating during traversal.
   - Code: most frequent value.
   - Practice: group anagrams.

3. Complement lookup
   - Visual: seen values and needed complements.
   - Code: two sum.
   - Practice: count pairs with target sum.

### 7. Trees

Goal: Make hierarchical traversal and recursive structure intuitive.

1. Binary tree anatomy
   - Visual: nodes, children, leaves, and root.
   - Code: count nodes.
   - Practice: max depth.

2. Depth-first traversal
   - Visual: preorder, inorder, and postorder visit order.
   - Code: recursive DFS.
   - Practice: collect leaf values.

3. Breadth-first traversal
   - Visual: queue of nodes by level.
   - Code: level order traversal.
   - Practice: right side view.

4. Binary search trees
   - Visual: compare and branch left or right.
   - Code: search in BST.
   - Practice: insert into BST.

### 8. Graphs

Goal: Teach nodes, edges, traversal, and visited-state discipline.

1. Graph representations
   - Visual: adjacency list and drawn graph side by side.
   - Code: build adjacency list from edges.
   - Practice: count neighbors.

2. Graph DFS
   - Visual: recursive exploration with visited nodes.
   - Code: connected component traversal.
   - Practice: count connected components.

3. Graph BFS
   - Visual: frontier expanding level by level.
   - Code: shortest path in unweighted graph.
   - Practice: minimum moves on a grid.

4. Topological sort
   - Visual: in-degree counts decreasing.
   - Code: course schedule ordering.
   - Practice: detect whether all tasks can be completed.

### 9. Heaps and Priority Queues

Goal: Show how priority ordering supports efficient repeated selection.

1. Heap shape and ordering
   - Visual: binary heap tree and backing array.
   - Code: parent and child index calculations.
   - Practice: verify whether an array is a min-heap.

2. Push and pop operations
   - Visual: bubble up and sink down.
   - Code: implement min-heap insert and remove.
   - Practice: keep the top `k` largest values.

### 10. Dynamic Programming

Goal: Turn repeated recursion into cached or tabulated state.

1. Memoization
   - Visual: recursion tree collapsing into cached results.
   - Code: Fibonacci with memoization.
   - Practice: climbing stairs.

2. Tabulation
   - Visual: DP table filling from known base cases.
   - Code: minimum cost climbing stairs.
   - Practice: house robber.

3. 2D DP
   - Visual: grid/table dependencies.
   - Code: unique paths.
   - Practice: longest common subsequence.

## First MVP Lesson Set

Build these first to prove the lesson engine:

1. Array traversal and indexing
2. Two pointers
3. Stack basics
4. Binary search
5. Tree breadth-first traversal
6. Graph BFS
7. Memoization

This set covers sequential scans, pointer state, stack behavior, search-space reduction, queue-based traversal, graph visited state, and cached recursion.

## Content Readiness Checklist

- Lesson has a single primary concept.
- Starter code runs without edits.
- Example input is small enough to trace visually.
- Visualizer state list matches the code path.
- Learner can change at least one input value.
- Complexity explanation names the variable size, such as `n`, `v`, or `e`.
- Practice task has clear expected output.
- Common mistakes include at least one boundary case.
