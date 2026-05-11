import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal
} from "@angular/core";
import {
  CdkVirtualScrollViewport,
  ScrollingModule
} from "@angular/cdk/scrolling";
import { Shirt } from "../../core/models/catalog.model";
import { ViewerComponent } from "../viewer/viewer.component";

interface Row {
  index: number;
  items: Shirt[];
}

@Component({
  selector: "app-shirt-grid",
  standalone: true,
  imports: [ScrollingModule, ViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cdk-virtual-scroll-viewport
      #vp
      [itemSize]="rowHeight()"
      [minBufferPx]="rowHeight() * 2"
      [maxBufferPx]="rowHeight() * 4"
      class="viewport"
    >
      <div
        *cdkVirtualFor="let row of rows(); trackBy: trackRow"
        class="row"
        [style.grid-template-columns]="gridCols()"
        [style.gap.px]="gap"
        [style.padding-left.px]="hpad"
        [style.padding-right.px]="hpad"
        [style.height.px]="rowHeight()"
      >
        @for (item of row.items; track item.id) {
          <button
            type="button"
            class="tile"
            [style.height.px]="tileSize()"
            (click)="open(row.index, $index)"
            [attr.aria-label]="item.name"
          >
            <img
              [src]="item.src"
              [alt]="item.name"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              (load)="$any($event.target).classList.add('loaded')"
            />
          </button>
        }
      </div>
    </cdk-virtual-scroll-viewport>

    @if (viewerIndex() !== null) {
      <app-viewer
        [items]="shirts"
        [startIndex]="viewerIndex()!"
        (closed)="viewerIndex.set(null)"
      />
    }
  `,
  styles: [
    `
      :host { display: block; width: 100%; }
      .row {
        display: grid;
        width: 100%;
        box-sizing: border-box;
        align-items: center;
      }
      .tile { width: 100%; aspect-ratio: auto; }
    `
  ]
})
export class ShirtGridComponent implements AfterViewInit, OnDestroy {
  private readonly shirtsSignal = signal<Shirt[]>([]);

  @Input({ required: true })
  set shirts(value: Shirt[]) {
    this.shirtsSignal.set(value ?? []);
    this.viewerIndex.set(null);
    if (this.vp) this.vp.scrollToIndex(0);
  }

  get shirts(): Shirt[] {
    return this.shirtsSignal();
  }

  @ViewChild("vp", { static: true }) vp!: CdkVirtualScrollViewport;

  private zone = inject(NgZone);

  protected readonly hpad = 20;
  protected readonly gap = 16;

  private readonly viewportWidth = signal<number>(0);

  protected readonly cols = computed(() => {
    const w = this.viewportWidth();
    if (w >= 1600) return 7;
    if (w >= 1280) return 6;
    if (w >= 1024) return 5;
    if (w >= 768) return 4;
    if (w >= 520) return 3;
    return 2;
  });

  protected readonly tileSize = computed(() => {
    const c = this.cols();
    const w = Math.max(this.viewportWidth() - this.hpad * 2, 0);
    const size = Math.floor((w - this.gap * (c - 1)) / c);
    return Math.max(80, size);
  });

  protected readonly rowHeight = computed(() => this.tileSize() + this.gap);
  protected readonly gridCols = computed(() => `repeat(${this.cols()}, 1fr)`);

  protected readonly rows = computed<Row[]>(() => {
    const shirts = this.shirtsSignal();
    const c = this.cols();
    const out: Row[] = [];
    for (let i = 0; i < shirts.length; i += c) {
      out.push({ index: i / c, items: shirts.slice(i, i + c) });
    }
    return out;
  });

  protected readonly viewerIndex = signal<number | null>(null);

  private ro?: ResizeObserver;

  ngAfterViewInit() {
    const el = this.vp.elementRef.nativeElement;
    this.viewportWidth.set(el.clientWidth || window.innerWidth);

    this.zone.runOutsideAngular(() => {
      this.ro = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect.width ?? 0;
        if (w && w !== this.viewportWidth()) {
          this.zone.run(() => {
            this.viewportWidth.set(w);
            this.vp.checkViewportSize();
          });
        }
      });
      this.ro.observe(el);
    });
  }

  ngOnDestroy() {
    this.ro?.disconnect();
  }

  @HostListener("window:resize")
  onResize() {
    const el = this.vp?.elementRef.nativeElement;
    if (el) this.viewportWidth.set(el.clientWidth);
  }

  trackRow(_: number, r: Row) {
    return r.index;
  }

  open(rowIndex: number, colIndex: number) {
    const idx = rowIndex * this.cols() + colIndex;
    this.viewerIndex.set(idx);
  }
}
