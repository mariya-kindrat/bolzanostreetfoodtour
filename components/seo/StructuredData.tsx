export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD in a script tag is the standard, safe way to embed
      // structured data — this is not raw user input, it's built from our
      // own seeded content in lib/seo/json-ld.ts.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
