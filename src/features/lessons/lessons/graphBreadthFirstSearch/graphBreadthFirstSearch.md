# Learning Goals

- Explain how Breadth-First Search (BFS) expands from a starting node one layer at a time.
- Use a queue and visited set together so each reachable node is processed once.
- Trace BFS order on an undirected graph with cycles.
- Recognize why BFS finds the fewest-edge path in an unweighted graph.

# Concept

## Spread Out in Rings

Think of Breadth-First Search (BFS) like asking friends for directions in waves. First you ask the people standing right next to you. Then you ask everyone they can reach in one step. Then you ask the next ring of people. You never jump ahead to a far-away person until all closer people have had a turn.

Use this concrete graph:

`0` connects to `1` and `2`. `1` connects to `3` and `4`. `2` connects to `4`. `3` connects to `5`. `4` connects to `5`.

::: graph-diagram
:::

Starting at node `0`, BFS visits nodes in this order: `0, 1, 2, 3, 4, 5`. Nodes `1` and `2` come before `3`, `4`, and `5` because they are only one edge away from the start.

## The Problem It Solves

Without BFS, shortest-path questions in an unweighted graph are easy to answer incorrectly. A search that follows one path deeply may reach the target, but that path might use more edges than necessary.

Think of a subway map where stations are nodes and direct rides are edges. If every ride counts the same, BFS has the right rhythm: check all stations one ride away, then all stations two rides away, then all stations three rides away. The first time BFS reaches a station, it has used the fewest possible rides.

The queue is what keeps that rhythm honest. New neighbors wait at the back of the line, so older, closer nodes are processed first.

## Step-by-Step Trace

Start at `0`. Mark `0` visited and put it in the queue.

Remove `0` from the front. Add `0` to the visit order. Its neighbors `1` and `2` are new, so mark both visited and place them at the back of the queue.

Remove `1`. Add `1` to the order. Neighbor `0` is already visited, so skip it. Neighbors `3` and `4` are new, so enqueue them.

Remove `2`. Add `2` to the order. Neighbor `0` is already visited. Neighbor `4` is also already visited because `1` discovered it first, so do not enqueue it again.

Remove `3`, then `4`, then `5`. Each time, skip neighbors that were already visited. The final order is `0, 1, 2, 3, 4, 5`.

## Why Mark Before Enqueueing

Mark a node visited as soon as it enters the queue, not later when it leaves the queue. In the example, both `1` and `2` can point toward `4`. If `4` is not marked when it is first discovered, two different parents can add `4` to the queue, and the lesson trace becomes noisy duplicate work.

The visited set answers: "Has this node already claimed a place in the line?" If yes, skip it. That keeps the queue small and prevents cycles from repeating forever.

::: pattern
visited = set containing start
queue = start
order = empty list

while queue still has nodes:
    remove the front node
    add it to order
    for each neighbor:
        if neighbor is already visited:
            skip it
        mark neighbor visited
        add neighbor to the back of the queue
:::

## When to Reach for BFS

BFS is a strong fit when the graph is unweighted and the question cares about the smallest number of edges: shortest routes, minimum moves, friend-of-friend levels, and level-order exploration. The tradeoff is memory. BFS can keep a wide layer in the queue, while DFS usually keeps only the active path.

# Complexity

| Metric | Value | Reason |
| --- | --- | --- |
| Time | O(V + E) | With an adjacency list and a visited set, BFS visits each vertex once and checks each edge through the neighbor lists. |
| Space | O(V) | The visited set, queue, output order, and level notes can grow with the number of vertices. |

# Common Mistakes

## Marking visited after dequeueing

Bad:

```js
for (const neighbor of graph[node]) {
  if (!visited.has(neighbor)) {
    queue.push(neighbor);
  }
}
visited.add(node);
```

Good:

```js
for (const neighbor of graph[node]) {
  if (visited.has(neighbor)) continue;
  visited.add(neighbor);
  queue.push(neighbor);
}
```

## Using a stack by accident

Bad:

```js
const node = stack.pop();
for (const neighbor of graph[node]) {
  stack.push(neighbor);
}
```

Good:

```js
const node = queue[head];
head += 1;
for (const neighbor of graph[node]) {
  queue.push(neighbor);
}
```

## Forgetting invalid starts

Bad:

```js
function bfsOrder(graph, start) {
  const queue = [start];
}
```

Good:

```js
function bfsOrder(graph, start) {
  if (start < 0 || start >= graph.length) return [];
  const queue = [start];
}
```

# Practice

## Return BFS visit order

Write a function `bfsOrder(adjList, start)` that returns the order in which nodes are first removed from the queue. Use a visited set so each node appears at most once.

Examples:

- `bfsOrder([[1,2],[0,3],[0],[1]], 0)` -> `[0,1,2,3]`
- `bfsOrder([[1],[0],[]], 2)` -> `[2]`
- `bfsOrder([[]], 0)` -> `[0]`
- `bfsOrder([], 0)` -> `[]`

# Reflection

What part of the queue trace tells you that a node was reached with the fewest possible number of edges?
