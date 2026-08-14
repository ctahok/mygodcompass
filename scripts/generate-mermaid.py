#!/usr/bin/env python3
"""Parse ontology.ts and emit a Mermaid flowchart of the full question tree. v2 (block-based)."""
import re, json

import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "src", "data", "ontology.ts")
OUT = os.path.join(BASE, "public", "ontology-tree.mmd")
OUT_JSON = "/tmp/ontology_stats.json"

src = open(SRC, encoding="utf-8").read()
nodes_part, terminals_part = src.split("export const TERMINALS", 1)

BLOCK_RE = re.compile(r'^  ([a-zA-Z_]\w*): \{(.*?)\n  \},?$', re.M | re.S)

def en_of(block_text, key):
    m = re.search(key + r': \{\s*en: "((?:[^"\\]|\\.)*)"', block_text, re.S)
    return m.group(1).replace('\\"', '"') if m else ""

def parse_blocks(part):
    blocks = {}
    for nid, body in BLOCK_RE.findall(part):
        node_id = nid
        m = re.search(r'node_id: "(\w+)"', body)
        if m:
            node_id = m.group(1)
        question = en_of(body, "question") or en_of(body, "title")
        opts = []
        if "options:" in body:
            opt_section = body.split("options: [", 1)[1]
            chunks = re.split(r'\n\s*\{', opt_section)
            for ch in chunks[1:]:
                lbl = en_of(ch, "label")
                nxt = re.search(r'next_node: "(\w+)"', ch)
                opts.append({"label": lbl, "next": nxt.group(1) if nxt else None})
        blocks[node_id] = {"node_id": node_id, "question": question, "options": opts}
    return blocks

nodes = parse_blocks(nodes_part)
terminals = parse_blocks(terminals_part)

known = set(nodes) | set(terminals)
dangling = [(nid, o["label"], o["next"]) for nid, b in nodes.items() for o in b["options"]
            if o["next"] not in known]

# --- Mermaid generation ---
def esc(s):
    return s.replace("&", "&amp;").replace('"', "&quot;")

mmd = ["flowchart TD",
       "    %% Auto-generated from src/data/ontology.ts — do not edit by hand"]
for nid, b in nodes.items():
    mmd.append(f'    {nid}["{esc(b["question"] or nid)}"]')
for tid, b in terminals.items():
    mmd.append(f'    {tid}(["{esc(b["question"] or tid)}"])')
for nid, b in nodes.items():
    for o in b["options"]:
        if o["next"]:
            mmd.append(f'    {nid} -->|"{esc(o["label"])}"| {o["next"]}')

mmd_text = "\n".join(mmd) + "\n"
open(OUT, "w", encoding="utf-8").write(mmd_text)

stats = {
    "question_nodes": len(nodes),
    "terminal_nodes": len(terminals),
    "total_options": sum(len(b["options"]) for b in nodes.values()),
    "dangling_edges": dangling,
    "max_fanout": sorted(((len(b["options"]), nid) for nid, b in nodes.items()), reverse=True)[:3],
}
json.dump(stats, open(OUT_JSON, "w"), ensure_ascii=False, indent=2)
print(json.dumps(stats, ensure_ascii=False, indent=2))
print("Wrote", OUT, f"({len(mmd_text)} bytes, {len(mmd)} lines)")
