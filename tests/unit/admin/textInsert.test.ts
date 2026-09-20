import { describe, expect, it } from "vitest";
import { insertAtCursor } from "@/lib/admin/textInsert";

describe("insertAtCursor", () => {
  it("inserts into empty text without padding", () => {
    expect(insertAtCursor("", 0, 0, "![a](/x.jpg)")).toEqual({
      text: "![a](/x.jpg)",
      cursor: 12,
    });
  });

  it("puts blank lines around an insert in the middle of a paragraph", () => {
    const result = insertAtCursor("Hello world", 5, 5, "IMG");
    expect(result.text).toBe("Hello\n\nIMG\n\n world");
    expect(result.cursor).toBe("Hello\n\nIMG\n\n".length);
  });

  it("does not add extra blank lines after an existing blank line", () => {
    expect(insertAtCursor("One.\n\nTwo.", 6, 6, "IMG").text).toBe("One.\n\nIMG\n\nTwo.");
  });

  it("completes a single newline to a blank line", () => {
    expect(insertAtCursor("One.\nTwo.", 5, 5, "IMG").text).toBe("One.\n\nIMG\n\nTwo.");
  });

  it("replaces a selection", () => {
    expect(insertAtCursor("Say SELECTED now", 4, 12, "IMG").text).toBe("Say \n\nIMG\n\n now");
  });
});
