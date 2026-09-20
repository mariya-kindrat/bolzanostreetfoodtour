import { describe, expect, it } from "vitest";
import { db } from "@/lib/db";

describe("Transfer and blog schema", () => {
  it("round-trips a transfer route with a supplement", async () => {
    const route = await db.transferRoute.create({
      data: {
        origin: "Bolzano Airport",
        destination: "Bolzano City Center",
        priceCents: 4000,
        maxPax: 4,
        maxLuggage: 4,
        supplements: { create: [{ label: "Extra luggage", priceCents: 1000 }] },
      },
      include: { supplements: true },
    });

    expect(route.supplements).toHaveLength(1);
    await db.transferRoute.delete({ where: { id: route.id } });
  });

  it("round-trips a blog post and an admin note", async () => {
    const post = await db.blogPost.create({
      data: { slug: `test-post-${Date.now()}`, title: "Test Post", content: "Body text." },
    });
    const note = await db.adminNote.create({
      data: { subject: "Reminder", content: "Follow up with supplier." },
    });

    expect(post.title).toBe("Test Post");
    expect(note.subject).toBe("Reminder");

    await db.blogPost.delete({ where: { id: post.id } });
    await db.adminNote.delete({ where: { id: note.id } });
  });

  it("round-trips the blog CMS fields and defaults tags to empty", async () => {
    const withFields = await db.blogPost.create({
      data: {
        slug: `cms-fields-${Date.now()}`,
        title: "CMS fields",
        content: "Body",
        excerpt: "Short summary",
        coverImageUrl: "/images/home/mosaic/farmhouse-kitchen.jpg",
        coverImageAlt: "A farmhouse kitchen",
        tags: ["recipes", "travel-tips"],
      },
    });
    const plain = await db.blogPost.create({
      data: { slug: `cms-plain-${Date.now()}`, title: "Plain", content: "Body" },
    });

    expect(withFields.tags).toEqual(["recipes", "travel-tips"]);
    expect(withFields.excerpt).toBe("Short summary");
    expect(plain.tags).toEqual([]);
    expect(plain.excerpt).toBeNull();
    expect(plain.coverImageUrl).toBeNull();

    await db.blogPost.deleteMany({ where: { id: { in: [withFields.id, plain.id] } } });
  });
});
