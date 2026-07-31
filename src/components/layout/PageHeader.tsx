import { Container } from "@/components/ui/Container";

/**
 * İç sayfaların ortak başlığı.
 *
 * Ana sayfa hero'suyla aynı editoryal bölmeyi kullanır: iri başlık solda,
 * kurşun metin sağda ve alt hizaya oturur. Sayfalar arasında ritim
 * değişmesin diye tek yerden yönetilir.
 *
 * `eyebrow` üstte küçük harfli bağlam etiketidir (örn. "Galata, İstanbul").
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="border-border border-b">
      <Container className="pt-16 pb-16 md:pt-28 md:pb-24">
        {eyebrow && (
          <p className="font-sans text-small text-muted-fg tracking-[0.2em] uppercase">
            {eyebrow}
          </p>
        )}

        <div className="mt-6 grid gap-8 md:grid-cols-12 md:gap-12">
          <h1 className="font-display text-h1 text-ink col-span-full text-balance md:col-span-7">
            {title}
          </h1>
          {lead && (
            <p className="text-muted-fg col-span-full text-body md:col-span-4 md:col-start-9 md:self-end">
              {lead}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
