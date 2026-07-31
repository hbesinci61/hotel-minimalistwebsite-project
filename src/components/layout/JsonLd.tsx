/**
 * JSON-LD yazıcısı.
 *
 * `dangerouslySetInnerHTML` burada zorunludur: JSON-LD, <script> içinde ham
 * metin olarak bulunmalıdır (CLAUDE.md §2'deki istisna). Girdi bizim
 * ürettiğimiz nesnedir, kullanıcı verisi değildir.
 *
 * `<` karakteri kaçırılır: aksi hâlde bir metin içindeki "</script>" dizisi
 * script etiketini erkenden kapatabilir.
 *
 * `undefined` alanlar JSON.stringify tarafından zaten atılır; şemada boş
 * anahtar kalmaz.
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
