/**
 * Boyamadan ÖNCE çalışan tema betiği — FOUC'u önler.
 *
 * Kullanıcının kayıtlı tercihi varsa <html data-theme> hemen yazılır;
 * yoksa öznitelik eklenmez ve globals.css'teki `color-scheme: light dark`
 * sistem tercihini izler.
 *
 * NEDEN satır içi ve engelleyici: React hidrasyonundan sonra tema
 * uygulanırsa sayfa bir kare yanlış temada boyanır ve göze çarpar.
 * Bunun tek doğru çözümü <head> içinde senkron çalışan bir betiktir.
 *
 * dangerouslySetInnerHTML burada bilinçli bir istisnadır (CLAUDE.md §2):
 * dize sabittir, kullanıcı girdisi içermez, dışarıdan beslenmez.
 */
const script = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
