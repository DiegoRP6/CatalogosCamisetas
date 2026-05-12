import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { CatalogService } from "../../core/services/catalog.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="max-w-[1600px] mx-auto px-5 sm:px-8 pt-10 pb-20">
      <header class="mb-10 sm:mb-14">
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight">
          Catálogo de camisetas
        </h1>
        <p class="mt-2 text-ink-500 text-base sm:text-lg">
          {{ catalog.manifest()?.totalImages ?? 0 }} modelos
        </p>
      </header>

      @if (catalog.loading()) {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="aspect-[4/5] rounded-2xl skeleton"></div>
          }
        </div>
      } @else if (catalog.error()) {
        <p class="text-red-500">{{ catalog.error() }}</p>
      } @else {
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          @for (s of catalog.sections(); track s.slug) {
            <a
              [routerLink]="['/s', s.slug]"
              class="group relative block aspect-[4/5] rounded-2xl
                     overflow-hidden bg-ink-100 border border-ink-100
                     hover:border-ink-300 transition-colors"
              [attr.aria-label]="s.name"
            >
              @if (s.cover) {
                <img
                  [src]="s.cover"
                  [alt]="s.name"
                  loading="lazy"
                  decoding="async"
                  class="absolute inset-0 w-full h-full object-cover object-top
                         transition-transform duration-500 ease-out-soft
                         group-hover:scale-[1.03]"
                />
              }
            </a>
          }
        </div>
      }
    </section>
  `
})
export class HomeComponent implements OnInit {
  protected readonly catalog = inject(CatalogService);

  async ngOnInit() {
    await this.catalog.load();
  }
}
