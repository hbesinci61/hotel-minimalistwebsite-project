"use client";

import { useEffect, useRef } from "react";

/**
 * Kaydırınca beliren içerik — CLAUDE.md §7.
 *
 * GSAP DEĞİL, IntersectionObserver + CSS geçişi.
 *   Ölçüldü: GSAP + ScrollTrigger ana sayfaya 43 KB (gzip) ekliyordu.
 *   Buradaki ihtiyaç basit bir "solarak yüksel" efekti; tarayıcının
 *   yerleşik geçişleri bunu ~1 KB ile yapıyor. 43 KB'yi, CSS'in zaten
 *   yaptığı bir iş için harcamak §12'deki JS bütçesine karşı kötü bir
 *   takas olurdu.
 *
 * KAPSAM: yalnızca KATLAMA ALTI içerik.
 *   Hero animasyonlanmaz — LCP öğesidir, geciktirmek §12'deki
 *   LCP < 2.0s hedefine doğrudan zarar verir.
 *
 * JS ÇALIŞMAZSA: içerik CSS'te gizli değildir, normal görünür durur.
 * Başlangıç durumu JS tarafından uygulanır; betik yüklenmezse hiçbir şey
 * gizlenmemiş olur.
 *
 * prefers-reduced-motion: hareket azaltılmışsa animasyon YAVAŞLATILMAZ,
 * hiç kurulmaz — öğelere el bile sürülmez.
 */
export function Reveal({
  as: Tag = "div",
  children,
  stagger = false,
  className,
}: {
  /** Izgaranın KENDİSİ olabilsin diye: çocukları sırayla belirir. */
  as?: "div" | "ul";
  children: React.ReactNode;
  stagger?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Hareket azaltılmışsa hiçbir şey yapma — içerik olduğu gibi kalır.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = (
      stagger ? Array.from(el.children) : [el]
    ) as HTMLElement[];

    // Başlangıç durumu: yalnızca transform + opacity (§7).
    for (const [i, t] of targets.entries()) {
      t.style.opacity = "0";
      t.style.transform = "translateY(16px)";
      t.style.transition =
        `opacity 400ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms, ` +
        `transform 400ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms`;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        for (const t of targets) {
          t.style.opacity = "";
          t.style.transform = "";
        }
        io.disconnect(); // bir kez; her kaydırışta tekrarlamaz
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      // Bileşen sökülürse satır içi stiller geride kalmasın
      for (const t of targets) {
        t.style.opacity = "";
        t.style.transform = "";
        t.style.transition = "";
      }
    };
  }, [stagger]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLUListElement>}
      className={className}
    >
      {children}
    </Tag>
  );
}
