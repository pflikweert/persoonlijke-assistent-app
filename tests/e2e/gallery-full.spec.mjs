import { test } from "@playwright/test";

test.describe("entry photo gallery full end-user flow", () => {
  test.skip(
    process.env.GALLERY_E2E_FULL !== "1",
    "Set GALLERY_E2E_FULL=1 after full gallery seed/cleanup helpers cover all add/delete/error fixtures."
  );

  test("covers add, max limit, viewer, delete and reorder unhappy paths", async () => {
    test.info().annotations.push({
      type: "todo",
      description:
        "Implement after local-only gallery seed/cleanup helpers create deterministic add/delete/error fixtures.",
    });
  });
});
