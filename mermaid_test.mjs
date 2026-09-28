import mermaid from 'mermaid';

const src = `flowchart TD
  start["What kind of orientation best describes you?"]
  start -->|"I do not use religious or spiritual categories"| nonreligious
  start -->|"I use, or am open to, religious/spiritual/philosophical categories"| ultimate
  nonreligious["Do you nevertheless regard any reality, value, or experience as sacred, transcendent, or spiritually significant?"]
  nonreligious -->|"No - nothing is sacred or transcendent for me"| secular_profile
  nonreligious -->|"Yes or perhaps - I relate to something as sacred/transcendent"| rnatural_profile
  ultimate["Do you affirm an ultimate, sacred, divine, spiritual, or transcendent reality?"]
  ultimate -->|"Yes - I affirm an ultimate/sacred/divine reality"| reality
  reality["How do you understand ultimate or sacred reality?"]
  reality -->|"One ultimate reality"| agency
  agency["Is ultimate reality personal, impersonal, both, or beyond those categories?"]
  agency -->|"Personal or relational ultimate reality"| relation
  relation["How, if at all, does ultimate reality relate to people and the world?"]
  relation -->|"Creates or originates the world"| knowing
  knowing["How is religious or spiritual truth best known?"]
  knowing -->|"Scripture, prophets, or historical revelation"| candidate_traditions
  candidate_traditions["Based on your answers so far, these pathways appear most compatible. Which, if any, would you like to explore?"]
  candidate_traditions -->|"Explore the Baháʼí Faith"| bahai_detail
`;

mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
try {
  const { svg } = await mermaid.render('test-1', src);
  console.log("SUCCESS!", svg.substring(0, 50));
} catch (e) {
  console.error("ERROR!", e);
}
