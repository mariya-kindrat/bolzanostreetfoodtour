/** Inserts a block at the cursor, padded with blank lines so Markdown keeps it as its own block. */
export function insertAtCursor(
  text: string,
  start: number,
  end: number,
  insert: string,
): { text: string; cursor: number } {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const lead =
    before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const trail =
    after === "" || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
  const inserted = `${lead}${insert}${trail}`;
  return { text: before + inserted + after, cursor: before.length + inserted.length };
}
