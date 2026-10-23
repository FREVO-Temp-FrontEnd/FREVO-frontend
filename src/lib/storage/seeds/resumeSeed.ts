export interface ResumeSeed {
  id: string;
  name: string;
  asset: string;
  uploadedAt: string;
}

export const resumeSeedsByTalent: Record<string, readonly ResumeSeed[]> = {
  "minh-anh": [
    { id: "brand", name: "Minh-Anh_CV_Brand-Designer.pdf", asset: "minh-anh-brand-designer.pdf", uploadedAt: "2026-10-05T09:00:00.000Z" },
    { id: "product", name: "Minh-Anh_CV_Product-Designer.pdf", asset: "minh-anh-product-designer.pdf", uploadedAt: "2026-09-18T09:00:00.000Z" },
  ],
};
