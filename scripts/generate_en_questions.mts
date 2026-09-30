import fs from "fs";
import { NODES } from "../src/data/ontology.ts";

let out = "# The Ontological Compass — Questions & Options (EN / Current AZ)\n\n";
out += "> Instructions: Review and update the Azerbaijani (AZ) translations below, or edit the table cells. You can save your translations in this file or provide them as `az_questions.md`.\n\n---\n\n";

for (const [nodeId, node] of Object.entries(NODES)) {
  out += `## Node: \`${nodeId}\`\n\n`;
  out += `### Question\n`;
  out += `- **EN:** ${node.prompt?.en || ""}\n`;
  out += `- **AZ (Current):** ${node.prompt?.az || ""}\n`;
  out += `- **AZ (New):** \n\n`;

  if (node.help?.en) {
    out += `### Help / Description\n`;
    out += `- **EN:** ${node.help.en}\n`;
    out += `- **AZ (Current):** ${node.help.az || ""}\n`;
    out += `- **AZ (New):** \n\n`;
  }

  out += `### Options\n\n`;
  out += `| ID | EN Option | Current AZ | New AZ |\n`;
  out += `| :--- | :--- | :--- | :--- |\n`;

  for (const choice of node.choices) {
    const enLabel = (choice.label?.en || "").replace(/\|/g, "\\|");
    const azLabel = (choice.label?.az || "").replace(/\|/g, "\\|");
    out += `| \`${choice.id}\` | ${enLabel} | ${azLabel} |  |\n`;
  }

  out += `\n---\n\n`;
}

fs.writeFileSync("en_questions.md", out, "utf8");
console.log("Wrote en_questions.md with " + Object.keys(NODES).length + " nodes.");
