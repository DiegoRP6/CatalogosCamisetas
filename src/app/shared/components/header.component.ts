import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CatalogService } from "../../core/services/catalog.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-40 w-full bg-white/85 backdrop-blur
             border-b border-ink-100 h-16"
    >
      <div class="h-full max-w-[1600px] mx-auto px-5 sm:px-8
                  flex items-center gap-6">
        <a
          routerLink="/"
          class="font-black tracking-[0.18em] text-lg shrink-0
                 select-none"
          (click)="closeMobileMenu()"
          aria-label="Camisetika inicio"
        >
          CAMISETIKA
        </a>

        <button
          type="button"
          class="ml-auto md:hidden inline-flex items-center justify-center
                 w-10 h-10 rounded-full border border-ink-300 text-ink-900"
          (click)="toggleMobileMenu()"
          aria-label="Abrir menu de secciones"
          [attr.aria-expanded]="mobileMenuOpen()"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <nav
           class="hidden md:flex flex-1 min-w-0 overflow-hidden
             flex items-center gap-6 text-sm
                 font-medium"
          aria-label="Secciones"
        >
          @for (s of catalog.sections(); track s.slug) {
            <a
              [routerLink]="['/s', s.slug]"
              routerLinkActive="active"
              class="nav-link"
              (click)="closeMobileMenu()"
            >
              {{ s.name }}
            </a>
          }
        </nav>
      </div>
    </header>

    <div
      class="fixed inset-0 z-50 md:hidden"
      [class.pointer-events-none]="!mobileMenuOpen()"
      [attr.aria-hidden]="!mobileMenuOpen()"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/35 transition-opacity duration-300"
        [class.opacity-100]="mobileMenuOpen()"
        [class.opacity-0]="!mobileMenuOpen()"
        (click)="closeMobileMenu()"
        aria-label="Cerrar menu"
      ></button>

      <aside
        class="absolute left-0 top-0 h-full w-[86%] max-w-[320px] bg-white
               border-r border-ink-100 shadow-2xl transition-transform
               duration-300 ease-out-soft"
        [class.translate-x-0]="mobileMenuOpen()"
        [class.-translate-x-full]="!mobileMenuOpen()"
      >
        <div class="h-16 px-5 flex items-center justify-between border-b border-ink-100">
          <p class="font-black tracking-[0.14em]">CAMISETIKA</p>
          <button
            type="button"
            class="w-9 h-9 rounded-full border border-ink-300 inline-flex items-center justify-center"
            (click)="closeMobileMenu()"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 6l12 12M18 6 6 18"/>
            </svg>
          </button>
        </div>

        <nav class="px-5 py-4 flex flex-col gap-1" aria-label="Secciones movil">
          @for (s of catalog.sections(); track s.slug) {
            <a
              [routerLink]="['/s', s.slug]"
              routerLinkActive="bg-ink-100 text-ink-900"
              class="px-3 py-3 rounded-xl text-base font-semibold text-ink-700"
              (click)="closeMobileMenu()"
            >
              {{ s.name }}
            </a>
          }
        </nav>
      </aside>
    </div>
  `
})
export class HeaderComponent implements OnInit {
  protected readonly catalog = inject(CatalogService);
  protected readonly mobileMenuOpen = signal(false);

  ngOnInit() {
    void this.catalog.load();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
