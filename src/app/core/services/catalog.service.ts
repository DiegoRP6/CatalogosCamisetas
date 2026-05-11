import { Injectable, computed, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { Manifest, Section } from "../models/catalog.model";

@Injectable({ providedIn: "root" })
export class CatalogService {
  private http = inject(HttpClient);

  private readonly _manifest = signal<Manifest | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private loadPromise: Promise<Manifest> | null = null;

  readonly manifest = this._manifest.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly sections = computed<Section[]>(
    () => this._manifest()?.sections ?? []
  );

  async load(): Promise<Manifest> {
    const cached = this._manifest();
    if (cached) return cached;
    if (this.loadPromise) return this.loadPromise;

    this._loading.set(true);
    this._error.set(null);

    this.loadPromise = firstValueFrom(
      this.http.get<Manifest>("manifest.json")
    )
      .then((m) => {
        this._manifest.set(m);
        return m;
      })
      .catch((e) => {
        this._error.set("No se pudo cargar el catálogo.");
        throw e;
      })
      .finally(() => this._loading.set(false));

    return this.loadPromise;
  }

  getSection(slug: string): Section | undefined {
    return this.sections().find((s) => s.slug === slug);
  }
}
