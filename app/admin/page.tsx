import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main>
      <h1>Admin</h1>
      <p>
        <Link href="/admin/categories">Categories</Link>
      </p>
      <p>
        <Link href="/admin/blog">Blog</Link>
      </p>
    </main>
  );
}
