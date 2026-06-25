# Learning Goals

- Describe a graph as a set of nodes connected by edges.
- Convert a list of edges into an adjacency list.
- Convert a list of edges into an adjacency matrix.
- Compare adjacency lists and adjacency matrices for space and lookup speed.

# Concept

## What is a Graph?

Think of a graph as a map of connections. Each dot on the map is a **node** (also called a vertex), and each line connecting two dots is an **edge**.

Imagine five friends who text each other: Alice, Bob, Carol, David, and Eve. If Alice texts Bob, there is an edge between them.

**Bridging the Gap to Code:**
While humans use names, computers work best with numeric array indices. To build our graph, we first map each friend to a unique number (index):

- `0` → Alice (A)
- `1` → Bob (B)
- `2` → Carol (C)
- `3` → David (D)
- `4` → Eve (E)

Now, if Alice (`0`) texts Bob (`1`), our code stores the edge as `[0, 1]`.

Here is our graph expressed as an edge list of numeric pairs:

`edges = [[0,1], [0,2], [1,2], [1,3], [2,4], [3,4]]`

::: graph-diagram
:::

The first question you face with any graph problem is: how do you store these connections so your code can look them up quickly?

## Edge List — The Simplest Starting Point

The input above is already an **edge list**: a flat collection of pairs. Each pair `[a, b]` means "node a connects to node b."

Edge lists are compact and easy to read, but they are slow when you need to answer "which nodes are connected to node 2?" because you have to scan every single pair.

## Adjacency List — The Go-To Representation

An adjacency list gives each node its own list of neighbors. For node `0`, you look up its entry and immediately see `[1, 2]`. No scanning required.

Building one is straightforward. Walk through every edge, and for each pair `[a, b]`, push `b` into node `a`'s list and push `a` into node `b`'s list (for undirected graphs).

Using the edges above, the adjacency list looks like:

- Node 0 → `[1, 2]`
- Node 1 → `[0, 2, 3]`
- Node 2 → `[0, 1, 4]`
- Node 3 → `[1, 4]`
- Node 4 → `[2, 3]`

::: graph-diagram
:::

::: pattern
adjList = array of empty arrays, one per node
for each [a, b] in edges:
    adjList[a].push(b)
    adjList[b].push(a)
:::

## Adjacency Matrix — Fast Lookups, More Space

An adjacency matrix is a grid where `matrix[a][b] = 1` means "there is an edge from a to b" and `0` means "no edge."

For 5 nodes, you get a 5×5 grid. Checking "is node 1 connected to node 3?" is one instant lookup: `matrix[1][3]`.

The tradeoff is space: a graph with 1,000 nodes needs a 1,000×1,000 grid (one million entries), even if there are only a handful of edges.

For the same edges above, the matrix looks like:

- Row 0: `[0, 1, 1, 0, 0]`
- Row 1: `[1, 0, 1, 1, 0]`
- Row 2: `[1, 1, 0, 0, 1]`
- Row 3: `[0, 1, 0, 0, 1]`
- Row 4: `[0, 0, 1, 1, 0]`

::: graph-diagram
:::

::: pattern
matrix = n×n grid of zeros
for each [a, b] in edges:
    matrix[a][b] = 1
    matrix[b][a] = 1
:::

## When to Use Which

**Adjacency list** is the default choice in most real-world code. It uses space proportional to the number of edges, and lets you iterate over a node's neighbors in time proportional to the number of those neighbors.

**Adjacency matrix** is useful when the graph is dense (most possible edges exist), or when you need to check "is there an edge between X and Y?" extremely often and want that check to be instant.

**Edge list** is usually just the raw input format. You almost always convert it into one of the other two before doing real work.

# Complexity

| Metric | Value | Reason |
| --- | --- | --- |
| Time | O(n + e) | Building either representation visits each of the `n` nodes and `e` edges once. |
| Space | O(n + e) or O(n²) | An adjacency list stores one entry per edge endpoint, using `O(n + e)`. An adjacency matrix always uses `O(n²)` regardless of edge count. |

# Common Mistakes

## Forgetting to add both directions for undirected edges

Bad:

```js
adjList[a].push(b);
```

Good:

```js
adjList[a].push(b);
adjList[b].push(a);
```

## Using node values as indexes without mapping them first

Bad:

```js
adjList[node.label].push(neighbor);
```

Good:

```js
adjList[nodeIndex].push(neighborIndex);
```

## Creating too small an adjacency list array

Bad:

```js
const adj = Array.from({ length: edges.length }, () => []);
```

Good:

```js
const adj = Array.from({ length: numNodes }, () => []);
```

💡 **Long-term Retention Tip:** In production systems, you rarely get clean 0 to N integers. You usually get UUIDs or strings. The very first step an engineer takes before running graph algorithms (like BFS or Shortest Path) is setting up a hash map to translate those identifiers into performance-friendly integers!

# Practice

## Build both representations from edges

Write a function `buildGraphRepresentations(numNodes, edges)` that returns an object with two properties: `adjList` (an array of arrays) and `matrix` (a 2D array of 0s and 1s). Each edge `[a, b]` is undirected.

Examples:

- `buildGraphRepresentations(3, [[0,1],[1,2]]).adjList` -> `[[1],[0,2],[1]]`
- `buildGraphRepresentations(3, [[0,1],[1,2]]).matrix` -> `[[0,1,0],[1,0,1],[0,1,0]]`
- `buildGraphRepresentations(2, []).adjList` -> `[[],[]]`
- `buildGraphRepresentations(1, []).matrix` -> `[[0]]`

# Reflection

If your graph has 10,000 nodes but only 20 edges, which representation wastes less memory and why?
