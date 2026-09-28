function mmd(s) {
  if (!s) return "";
  let text = s;
  // Replace quotes with Mermaid's quote entity
  text = text.replace(/"/g, "#quot;");
  // Replace anything that could break the string or Mermaid syntax with #code;
  // This includes parentheses, brackets, em-dashes, and semicolons.
  text = text.replace(/[\(\)\[\]—;<>]/g, c => "#" + c.charCodeAt(0) + ";");
  text = text.replace(/\n/g, "<br/>");
  return text;
}
console.log(mmd("Jewish; Christian; Muslim; (test) [test] <test> —"));
