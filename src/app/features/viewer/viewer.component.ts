import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  computed,
  signal
} from "@angular/core";
import { Shirt } from "../../core/models/catalog.model";

@Component({
  selector: "app-viewer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="viewer-backdrop"
      (click)="onBackdrop($event)"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        class="viewer-btn top-4 right-4"
        (click)="close()"
        aria-label="Cerrar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M6 6l12 12M18 6 6 18"/>
        </svg>
      </button>

      @if (items.length > 1) {
        <button
          type="button"
          class="viewer-btn left-3 sm:left-6 top-1/2 -translate-y-1/2"
          (click)="prev($event)"
          aria-label="Anterior"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M15 18 9 12l6-6"/>
          </svg>
        </button>

        <button
          type="button"
          class="viewer-btn right-3 sm:right-6 top-1/2 -translate-y-1/2"
          (click)="next($event)"
          aria-label="Siguiente"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      }

      <img
        [src]="current().src"
        [alt]="current().name"
        class="viewer-img"
        [style.transform]="transform()"
        (click)="toggleZoom($event)"
        draggable="false"
      />

      <div
        class="absolute bottom-4 left-1/2 -translate-x-1/2
               text-white/70 text-xs tracking-wider font-medium
               select-none pointer-events-none"
      >
        {{ index() + 1 }} / {{ items.length }}
      </div>
    </div>
  `
})
export class ViewerComponent implements OnInit {
  @Input({ required: true }) items: Shirt[] = [];
  @Input() startIndex = 0;
  @Output() closed = new EventEmitter<void>();

  protected readonly index = signal(0);
  protected readonly zoomed = signal(false);
  protected readonly current = computed(() => this.items[this.index()]);
  protected readonly transform = computed(() =>
    this.zoomed() ? "scale(2)" : "scale(1)"
  );

  private touchStartX = 0;
  private touchDeltaX = 0;

  ngOnInit() {
    this.index.set(
      Math.min(Math.max(0, this.startIndex), this.items.length - 1)
    );
    document.body.style.overflow = "hidden";
  }

  close() {
    document.body.style.overflow = "";
    this.closed.emit();
  }

  prev(e?: Event) {
    e?.stopPropagation();
    this.zoomed.set(false);
    this.index.update((i) => (i - 1 + this.items.length) % this.items.length);
  }

  next(e?: Event) {
    e?.stopPropagation();
    this.zoomed.set(false);
    this.index.update((i) => (i + 1) % this.items.length);
  }

  toggleZoom(e: Event) {
    e.stopPropagation();
    this.zoomed.update((v) => !v);
  }

  onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) this.close();
  }

  @HostListener("document:keydown", ["$event"])
  onKey(e: KeyboardEvent) {
    if (e.key === "Escape") this.close();
    else if (e.key === "ArrowLeft") this.prev();
    else if (e.key === "ArrowRight") this.next();
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0]?.clientX ?? 0;
    this.touchDeltaX = 0;
  }
  onTouchMove(e: TouchEvent) {
    this.touchDeltaX = (e.touches[0]?.clientX ?? 0) - this.touchStartX;
  }
  onTouchEnd() {
    const threshold = 50;
    if (this.touchDeltaX > threshold) this.prev();
    else if (this.touchDeltaX < -threshold) this.next();
    this.touchDeltaX = 0;
  }
}
