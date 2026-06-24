const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// User config identity values
const USER = {
  user_id: "gautamjain_14/11/2003",
  email_id: "gautam0336.be@chitkara.edu.in",
  college_roll_number: "2310990336"
};

// Tree depth calculator
function getDepth(obj) {
  const keys = Object.keys(obj);
  if (keys.length === 0) return 0;
  let max = 0;
  for (const k of keys) {
    max = Math.max(max, getDepth(obj[k]));
  }
  return 1 + max;
}

app.post("/bfhl", (req, res) => {
  try {
    console.log(req.body);
    console.log(req.body.data);

    const arr = req.body.data;
    if (!Array.isArray(arr)) {
      return res.status(400).json({
        error: "data must be an array"
      });
    }

    const invalid = [];
    const dups = new Set();
    const seen = new Set();
    const parent = {};
    const active = [];

    // 1. Parsing & Validation
    for (const item of arr) {
      if (typeof item !== "string") {
        invalid.push(String(item));
        continue;
      }
      const str = item.trim();
      if (!/^[A-Z]->[A-Z]$/.test(str)) {
        invalid.push(str);
        continue;
      }
      const [u, v] = str.split("->");
      if (u === v) {
        invalid.push(str);
        continue;
      }

      const edge = `${u}->${v}`;
      if (seen.has(edge)) {
        dups.add(edge);
        continue;
      }
      seen.add(edge);

      // Multi-parent rule: Keep first parent, ignore subsequent ones
      if (parent[v] !== undefined) {
        continue;
      }
      parent[v] = u;
      active.push([u, v]);
    }

    // 2. Build adjacency, find active nodes
    const nodes = new Set();
    for (const [u, v] of active) {
      nodes.add(u);
      nodes.add(v);
    }

    const adj = {};
    for (const [u, v] of active) {
      if (!adj[u]) adj[u] = [];
      adj[u].push(v);
    }

    const inDegree = {};
    for (const n of nodes) {
      inDegree[n] = 0;
    }
    for (const [u, v] of active) {
      inDegree[v] = (inDegree[v] || 0) + 1;
    }

    // 3. Find connected components (undirected)
    const adjUndirected = {};
    for (const n of nodes) {
      adjUndirected[n] = [];
    }
    for (const [u, v] of active) {
      adjUndirected[u].push(v);
      adjUndirected[v].push(u);
    }

    const visited = new Set();
    const comps = [];
    for (const n of nodes) {
      if (!visited.has(n)) {
        const comp = [];
        const q = [n];
        visited.add(n);
        while (q.length > 0) {
          const curr = q.shift();
          comp.push(curr);
          for (const neighbor of adjUndirected[curr] || []) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              q.push(neighbor);
            }
          }
        }
        comps.push(comp);
      }
    }

    const hierarchies = [];
    let totalTrees = 0;
    let totalCycles = 0;
    let maxDepth = -1;
    let largestTreeRoot = "";

    // 4. Build hierarchy and detect cycles per component
    for (const comp of comps) {
      const roots = comp.filter((n) => inDegree[n] === 0);
      let root;
      if (roots.length > 0) {
        root = roots[0];
      } else {
        root = comp.sort()[0];
      }

      let hasCycle = false;
      const path = new Set();

      function dfs(node) {
        path.add(node);
        const children = adj[node] || [];
        const childObj = {};
        for (const child of children) {
          if (path.has(child)) {
            hasCycle = true;
          } else {
            childObj[child] = dfs(child);
          }
        }
        path.delete(node);
        return childObj;
      }

      const tree = {};
      tree[root] = dfs(root);

      if (hasCycle) {
        totalCycles++;
        hierarchies.push({
          root,
          tree: {},
          has_cycle: true
        });
      } else {
        totalTrees++;
        const depth = getDepth(tree);
        hierarchies.push({
          root,
          tree,
          depth
        });

        if (depth > maxDepth) {
          maxDepth = depth;
          largestTreeRoot = root;
        } else if (depth === maxDepth) {
          if (root < largestTreeRoot) {
            largestTreeRoot = root;
          }
        }
      }
    }

    res.json({
      user_id: USER.user_id,
      email_id: USER.email_id,
      college_roll_number: USER.college_roll_number,
      hierarchies,
      invalid_entries: invalid,
      duplicate_edges: Array.from(dups),
      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: largestTreeRoot
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error: " + err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
