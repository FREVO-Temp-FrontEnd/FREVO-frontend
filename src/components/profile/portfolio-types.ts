export type PortfolioMedia = { id: string; src: string; kind: "image" | "video"; alt: string };
export type Work = {
  id: string; title: string; brand: string; category: string; role: string;
  description: string; contribution: string; date: string; team: string;
  tags: string[]; views: number; likes: number; theme: string;
  media: PortfolioMedia[]; url: string; visibility: "public" | "link" | "private";
};
