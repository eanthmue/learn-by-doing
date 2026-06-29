# Learning Goals

- Explain how Depth-First Search (DFS) follows one path deeply before trying another path.
- Use a visited set to avoid walking in circles.
- Trace recursive Depth-First Search (DFS) order on an undirected graph.
- Identify when Depth-First Search (DFS) is a good fit for reachability and component problems.

# Concept

## Follow One Hallway First

Think of Depth-First Search (DFS) like exploring a building with connected rooms. You pick a room, walk through the first unopened door, and keep going until that path runs out. Only then do you walk back to the most recent room that still has an unopened door.

Use this concrete graph:

`0` connects to `1` and `2`. `1` connects to `3` and `4`. `2` connects to `4`. `3` connects to `5`. `4` connects to `5`.

::: graph-diagram
:::

Starting at node `0`, DFS might visit nodes in this order: `0, 1, 3, 5, 4, 2`. It does not visit node `2` immediately after node `0` because it first follows the path through node `1` as far as it can.

## The Problem It Solves

Without Depth-First Search (DFS), a reachability question can turn into messy repeated scanning. 

Think of building a search engine web crawler. The internet is a giant graph where web pages are nodes, and links on those pages are the edges. If your web crawler starts on a homepage and follows links to index the web, it will quickly get stuck without a systematic traversal strategy:
- **Endless Loops:** Page A links to Page B, which links to Page C, which links back to Page A. Without keeping track of pages you have already visited, your crawler would circle this loop forever, crashing or running out of memory.
- **Wasted Work:** Multiple different pages might link to the same popular page. Without a way to remember that you already crawled it, you would download and process the same page over and over.

Depth-First Search (DFS) solves this by giving the traversal a simple rule: visit a page, mark it as visited, extract its links, and recursively explore each link. The visited memory (our "visited set") is what keeps cycles and duplicate links from trapping the crawler.

## Step-by-Step Trace

Start at `0`. Mark `0` visited, then try its first neighbor, `1`.

At `1`, mark `1` visited. Its neighbor `0` is already visited, so skip it. Then move to `3`.

At `3`, mark `3` visited. Its neighbor `1` is already visited, so skip it. Then move to `5`.

At `5`, mark `5` visited. Skip `3` because it is already visited. Move to `4`.

At `4`, mark `4` visited. Skip `1`. Move to `2`.

At `2`, mark `2` visited. Both `0` and `4` are already visited, so this path is finished. Now DFS walks back through the earlier rooms until every reachable neighbor has been checked.

## Why the Visited Set Matters

Graphs can loop back on themselves. In the example, `4` connects to `5`, and `5` connects back to `4`. If DFS does not remember visited nodes, it can bounce between the same nodes forever.

The visited set answers one safety question before each real visit: "Have I already handled this node?" If yes, stop that branch immediately. That one check keeps the search finite on graphs with cycles.

::: pattern
visited = empty set
order = empty list

visit(node):
    if node is already visited:
        stop this branch
    mark node visited
    add node to order
    for each neighbor of node:
        visit(neighbor)
:::

## When to Reach for DFS

DFS is a strong default when you need to know what is reachable from a starting point, count connected groups, detect cycles, or try choices that may require backing up. The tradeoff is that DFS follows depth first, so it does not promise the shortest path in an unweighted graph. If the shortest number of edges matters, use BFS instead.

# Complexity

| Metric | Value | Reason |
| --- | --- | --- |
| Time | O(V + E) | With an adjacency list and a visited set, DFS visits each vertex once and checks each edge through the neighbor lists. |
| Space | O(V) | The visited set, result order, and active recursive path can each grow with the number of vertices. |

# Common Mistakes

## Marking a node visited too late

Bad:

```js
function visit(node) {
  for (const neighbor of graph[node]) {
    visit(neighbor);
  }
  visited.add(node);
}
```

Good:

```js
function visit(node) {
  if (visited.has(node)) return;
  visited.add(node);
  for (const neighbor of graph[node]) {
    visit(neighbor);
  }
}
```

## Forgetting the visited check

Bad:

```js
function visit(node) {
  order.push(node);
  for (const neighbor of graph[node]) {
    visit(neighbor);
  }
}
```

Good:

```js
function visit(node) {
  if (visited.has(node)) return;
  visited.add(node);
  order.push(node);
}
```

## Expecting DFS to find the shortest path

Bad:

```js
const path = dfs(graph, start, target);
// Assume this path uses the fewest edges.
```

Good:

```js
const path = dfs(graph, start, target);
// Use DFS for reachability. Use BFS when fewest edges matters.
```

# Practice

## Return DFS visit order

Write a function `dfsOrder(adjList, start)` that returns the order in which nodes are first visited. Use a visited set so each node appears at most once.

Examples:

- `dfsOrder([[1,2],[0,3],[0],[1]], 0)` -> `[0,1,3,2]`
- `dfsOrder([[1],[0],[]], 2)` -> `[2]`
- `dfsOrder([[]], 0)` -> `[0]`
- `dfsOrder([], 0)` -> `[]`

# Reflection

Where would DFS waste effort or give the wrong kind of answer if a problem asks for the shortest path by number of edges?
