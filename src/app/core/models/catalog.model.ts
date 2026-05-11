export interface Shirt {
  id: string;
  src: string;
  name: string;
}

export interface Section {
  slug: string;
  name: string;
  folder: string;
  count: number;
  cover: string | null;
  images: Shirt[];
}

export interface Manifest {
  generatedAt: string;
  totalSections: number;
  totalImages: number;
  sections: Section[];
}
