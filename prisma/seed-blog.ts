import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { BLOG_POSTS, seedBlogPosts } from "./blogPosts";

// Seeds only the blog (npm run db:seed:blog), leaving tours and categories alone so
// admin edits to them are never touched.
dotenv.config({ path: ".env.local" });

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

seedBlogPosts(db)
  .then(() => console.log(`Seeded ${BLOG_POSTS.length} blog posts.`))
  .finally(() => db.$disconnect());
