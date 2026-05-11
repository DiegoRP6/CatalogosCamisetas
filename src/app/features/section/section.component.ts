import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from "@angular/core";
import { ActivatedRoute, ParamMap, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { CatalogService } from "../../core/services/catalog.service";
import { ShirtGridComponent } from "../grid/shirt-grid.component";

@Component({
  selector: "app-section",
  standalone: true,
  imports: [RouterLink, ShirtGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-[1600px] mx-auto px-5 sm:px-8 pt-6 pb-3
             flex items-baseline justify-between gap-4"
    >
      <div class="min-w-0">
        <a routerLink="/" class="text-xs text-ink-500 hover:text-ink-900">
          ← Inicio
        </a>
        <h1
          class="mt-1 text-2xl sm:text-4xl font-black tracking-tight truncate"
        >
          {{ section()?.name ?? "—" }}
        </h1>
      </div>
      <p class="text-sm text-ink-500 shrink-0">
        {{ section()?.count ?? 0 }} modelos
      </p>
    </div>

    @if (ready()) {
      @if (section(); as s) {
        <app-shirt-grid [shirts]="s.images" />
      } @else {
        <p class="px-5 sm:px-8 text-ink-500">Sección no encontrada.</p>
      }
    } @else {
      <div class="grid grid-cols-3 sm:grid-cols-5 gap-4 px-5 sm:px-8 pt-4">
        @for (i of skeletons; track i) {
          <div class="aspect-square rounded-2xl skeleton"></div>
        }
      </div>
    }
  `
})
export class SectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private catalog = inject(CatalogService);

  protected readonly skeletons = Array.from({ length: 20 }, (_, i) => i);

  private readonly slug = toSignal<ParamMap | null>(this.route.paramMap, {
    initialValue: null
  });

  private readonly _ready = signal(false);
  protected readonly ready = this._ready.asReadonly();

  protected readonly section = computed(() => {
    const slug = this.slug()?.get("slug") ?? "";
    return this.catalog.sections().find((s) => s.slug === slug);
  });

  async ngOnInit() {
    await this.catalog.load();
    this._ready.set(true);
  }
}
