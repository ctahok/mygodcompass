#!/usr/bin/env python3
"""Parse ontology.ts (v2 multi-axis graph) and emit a Mermaid flowchart."""
import re
import json
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "src", "data", "ontology.ts")
OUT = os.path.join(BASE, "public", "ontology-tree.mmd")
OUT_JSON = "/tmp/ontology_stats.json"

src = open(SRC, encoding="utf-8").read()

# Regex to find node blocks: id: { ... }
NODE_BLOCK_RE = re.compile(r'^  ([a-zA-Z_]\w*): \{(.*?)\n  \},?$', re.M | re.S)

def en_of(block_text, key):
    """Extract English text from a LocalizedText field."""
    m = re.search(key + r': \{\s*en: "((?:[^"\\]|\\.)*)"', block_text, re.S)
    return m.group(1).replace('\\"', '"') if m else ""

def extract_choices(text):
    """Extract choices array from a node body, handling nested brackets."""
    idx = text.find('choices: [')
    if idx < 0:
        return ""
    idx += len('choices: [')
    depth = 1
    for i, ch in enumerate(text[idx:]):
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                return text[idx:idx+i]
    return ""

def parse_choice_blocks(choices_text):
    """Parse individual choice objects from choices array text."""
    choices = []
    i = 0
    while i < len(choices_text):
        # Find next choice start
        if choices_text[i] == '{':
            depth = 1
            start = i
            i += 1
            while i < len(choices_text) and depth > 0:
                if choices_text[i] == '{':
                    depth += 1
                elif choices_text[i] == '}':
                    depth -= 1
                i += 1
            if depth == 0:
                choice_text = choices_text[start:i]
                # Parse this choice
                cid_match = re.search(r'id:\s*"(\w+)"', choice_text)
                label = en_of(choice_text, "label")
                next_nodes = []
                next_match = re.search(r'next:\s*\[(.*?)\]', choice_text, re.S)
                if next_match:
                    next_str = next_match.group(1)
                    next_nodes = re.findall(r'"(\w+)"', next_str)
                if cid_match:
                    choices.append({
                        "id": cid_match.group(1),
                        "label": label,
                        "next": next_nodes,
                    })
        else:
            i += 1
    return choices

def parse_nodes(part):
    """Parse all node blocks from the NODES record."""
    nodes = {}
    for nid, body in NODE_BLOCK_RE.findall(part):
        # Extract prompt (question)
        prompt = en_of(body, "prompt")
        # Extract choices
        choices_text = extract_choices(body)
        choices = parse_choice_blocks(choices_text)
        nodes[nid] = {
            "node_id": nid,
            "prompt": prompt,
            "choices": choices,
        }
    return nodes

nodes = parse_nodes(src)

known = set(nodes.keys())
dangling = []
for nid, node in nodes.items():
    for c in node["choices"]:
        for nxt in c["next"]:
            if nxt not in known:
                dangling.append((nid, c["label"], nxt))

# --- Mermaid generation ---
def esc(s):
    return s.replace("&", "&").replace('"', '\\"')

mmd = [
    "flowchart TD",
    "    %% Auto-generated from src/data/ontology.ts — do not edit by hand"
]
for nid, node in nodes.items():
    label = esc(node["prompt"] or nid)
    mmd.append(f'    {nid}["{label}"]')

for nid, node in nodes.items():
    for c in node["choices"]:
        for nxt in c["next"]:
            edge_label = esc(c["label"])
            if edge_label:
                mmd.append(f'    {nid} -->|"{edge_label}"| {nxt}')
            else:
                mmd.append(f'    {nid} --> {nxt}')

mmd_text = "\n".join(mmd) + "\n"
open(OUT, "w", encoding="utf-8").write(mmd_text)

stats = {
    "question_nodes": len(nodes),
    "terminal_nodes": 0,  # v2 has no separate terminals; profiles are computed
    "total_options": sum(len(n["choices"]) for n in nodes.values()),
    "dangling_edges": dangling,
    "max_fanout": sorted(((len(n["choices"]), nid) for nid, n in nodes.items()), reverse=True)[:3],
}
json.dump(stats, open(OUT_JSON, "w"), ensure_ascii=False, indent=2)
print(json.dumps(stats, ensure_ascii=False, indent=2))
print("Wrote", OUT, f"({len(mmd_text)} bytes, {len(mmd)} lines)")