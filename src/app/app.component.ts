import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <main class="w-full">
      <router-outlet />
    </main>

    <div class="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 flex flex-col items-end gap-2">
      <button
        type="button"
        class="group inline-flex items-center gap-2 rounded-full
               border border-emerald-300 bg-emerald-50 text-emerald-800
               px-3 py-1.5 shadow-lg shadow-emerald-900/10
               hover:bg-emerald-100 transition-colors"
        (click)="openPricing()"
        aria-label="Aprovecha ahora, envio gratis"
      >
        <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-[11px] sm:text-xs font-extrabold tracking-wide uppercase">
          Aprovecha ahora: envio gratis
        </span>
      </button>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full
               bg-ink-900 text-white px-4 py-3 shadow-xl shadow-black/20
               hover:bg-ink-800 active:scale-[0.98]
               transition-all duration-200 ease-out-soft"
        (click)="openPricing()"
        aria-haspopup="dialog"
        [attr.aria-expanded]="pricingOpen()"
        aria-controls="pricing-dialog"
        aria-label="Ver precios y ofertas"
      >
        <span class="text-base leading-none">€</span>
        <span class="text-sm font-semibold tracking-wide">Precios</span>
      </button>
    </div>

    @if (pricingOpen()) {
      <div
        class="fixed inset-0 z-[70]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-title"
        id="pricing-dialog"
      >
        <button
          type="button"
          class="absolute inset-0 bg-black/45"
          (click)="closePricing()"
          aria-label="Cerrar precios"
        ></button>

        <section
          class="absolute inset-x-3 bottom-3 sm:inset-auto sm:right-6 sm:bottom-24
                 w-auto sm:w-[560px] max-h-[85dvh] overflow-y-auto
                 rounded-2xl sm:rounded-3xl bg-white border border-ink-200
                 shadow-2xl"
        >
          <div class="p-5 sm:p-6 bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-b border-ink-100">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-bold tracking-[0.14em] text-ink-500 uppercase">CAMISETIKA STORE</p>
                <h2 id="pricing-title" class="mt-1 text-2xl font-black tracking-tight">
                  💸 Precios y Ofertas
                </h2>
              </div>
              <button
                type="button"
                class="shrink-0 w-9 h-9 rounded-full border border-ink-300 bg-white/90
                       inline-flex items-center justify-center text-ink-700"
                (click)="closePricing()"
                aria-label="Cerrar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M6 6l12 12M18 6 6 18"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-5 sm:p-6 space-y-4 sm:space-y-5">
            <section class="rounded-2xl border border-ink-100 bg-ink-50/70 p-4 sm:p-5">
              <h3 class="text-xs font-bold tracking-[0.14em] text-ink-500 uppercase">👕 Precios</h3>
              <ul class="mt-3 space-y-2 text-sm sm:text-[15px] leading-relaxed">
                <li><span class="font-semibold">👕 Camisetas:</span> 22€</li>
                <li class="text-ink-700">• Player Version +3€</li>
                <li class="text-ink-700">• Manga larga +2€</li>
                <li class="text-ink-700">• Nombre y numero +2€</li>
                <li class="text-ink-700">• Parche +1€</li>
                <li><span class="font-semibold">🕰️ Camisetas retro:</span> 25€</li>
                <li><span class="font-semibold">🧒 Kids Kit:</span> 30€</li>
                <li class="text-ink-700">Camiseta + pantalon + medias</li>
                <li><span class="font-semibold">👦👦 Segundo Kids Kit:</span> 27€</li>
                <li class="text-ink-700">Para que el hermano no se ponga celoso 😅</li>
                <li><span class="font-semibold">🧥 Chaquetas / sudaderas:</span> 28€</li>
                <li><span class="font-semibold">🏃 Chandal completo:</span> 35€</li>
              </ul>
            </section>

            <section class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:p-5">
              <h3 class="text-xs font-bold tracking-[0.14em] text-ink-500 uppercase">🔥 Ofertas especiales</h3>
              <ul class="mt-3 space-y-2 text-sm sm:text-[15px] leading-relaxed">
                <li><span class="font-semibold">👨‍👦 De padre a hijo:</span> Camiseta adulto Fan + Kids Kit → 45€</li>
                <li><span class="font-semibold">🏃 Pack entrenamiento:</span> Chandal + camiseta → 50€</li>
                <li><span class="font-semibold">🧥 Pack invierno:</span> Camiseta + sudadera/chaqueta → 45€</li>
                <li><span class="font-semibold">⚽ Pack jugador completo:</span> Player Version + nombre + parche → 27€</li>
                <li><span class="font-semibold">👕 2 camisetas Fan:</span> 40€</li>
              </ul>
              <p class="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-emerald-700 border border-emerald-200">
                📦 Envio gratis
              </p>
            </section>
          </div>
        </section>
      </div>
    }
  `
})
export class AppComponent {
  protected readonly pricingOpen = signal(false);

  openPricing() {
    this.pricingOpen.set(true);
  }

  closePricing() {
    this.pricingOpen.set(false);
  }

  @HostListener("document:keydown.escape")
  onEscape() {
    this.closePricing();
  }
}
