import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Work } from "@/lib/types/portfolio.types";

export function PortfolioCover({ work }: { work: Work }) {
  const [failed, setFailed] = useState(false);
  const cover = work.media.find((item) => item.kind === "image");

  if (cover && !failed) {
    return (
      <div className="portfolio-photo">
        <img
          src={cover.src}
          alt={work.title}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`portfolio-cover portfolio-cover--${work.theme}`}
      aria-hidden="true"
    >
      <span className="portfolio-cover-label">{work.category}</span>
      <div className="portfolio-art">
        <span>{work.brand}</span>
        <i />
        <i />
        <i />
      </div>
      <span className="portfolio-cover-foot">
        MINH ANH STUDIO <ArrowUpRight size={16} />
      </span>
    </div>
  );
}
