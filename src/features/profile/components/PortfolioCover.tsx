import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ArrowUpRight } from "lucide-react";
import type { Work } from "@/lib/types/portfolio.types";

const THEME_STYLES: Record<string, { bg: string; color: string; artBg?: string; artRotate?: string; artRadius?: string; artOpacity?: number; artTransform?: string }> = {
  finance: {
    bg: "#dce7e5",
    color: "#163e35",
  },
  herbe: {
    bg: "#e7e8d7",
    color: "#455439",
  },
  hub: {
    bg: "#e8def9",
    color: "#432a64",
  },
  editorial: {
    bg: "#e6e4df",
    color: "#282823",
  },
};

export function PortfolioCover({ work }: { work: Work }) {
  const [failed, setFailed] = useState(false);
  const cover = work.media.find((item) => item.kind === "image");

  if (cover && !failed) {
    return (
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1.55",
          bgcolor: "var(--peach, #fff0e9)",
          overflow: "hidden",
          "@media(max-width:480px)": {
            aspectRatio: "1.6",
          },
          "& img": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .2s",
          },
          ".portfolio-card:hover & img": {
            transform: "scale(1.025)",
          },
        }}
      >
        <img
          src={cover.src}
          alt={work.title}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </Box>
    );
  }

  const themeConfig = THEME_STYLES[work.theme] || {
    bg: "#e3d7bd",
    color: "#443a28",
  };

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        aspectRatio: "1.42",
        bgcolor: themeConfig.bg,
        color: themeConfig.color,
        p: "18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "@media(min-width:1450px)": {
          aspectRatio: "1.5",
        },
        "@media(max-width:480px)": {
          aspectRatio: "1.6",
        },
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize: "9px",
          letterSpacing: ".09em",
          mt: "22px",
          textTransform: "uppercase",
        }}
      >
        {work.category}
      </Typography>

      <Box
        sx={{
          position: "relative",
          flex: 1,
          display: "grid",
          placeItems: "center",
          "& > span": {
            position: "relative",
            zIndex: 2,
            fontFamily: work.theme === "herbe" ? "Georgia, serif" : "Archivo, Arial, sans-serif",
            fontSize: work.theme === "hub" ? "35px" : work.theme === "editorial" ? "36px" : "clamp(26px, 3.5vw, 52px)",
            fontWeight: work.theme === "herbe" ? 400 : 800,
            letterSpacing: work.theme === "herbe" ? "-.04em" : "-.065em",
            whiteSpace: "pre-line",
            lineHeight: 1,
            textAlign: "center",
            maxWidth: work.theme === "hub" ? "200px" : "100%",
            overflowWrap: "anywhere",
            "@media(max-width:480px)": {
              fontSize: "54px",
            },
          },
          "& > i": {
            position: "absolute",
            width: "44%",
            height: "85%",
            border: "1px solid currentColor",
            opacity: 0.28,
            transform: "rotate(-17deg)",
            background: "#f2e7d1",
          },
          "& > i:nth-of-type(2)": {
            transform: "rotate(12deg)",
            left: "8%",
            width: "25%",
            height: "60%",
          },
          "& > i:nth-of-type(3)": {
            transform: "rotate(25deg)",
            right: "8%",
            width: "25%",
            height: "60%",
          },
          ...(work.theme === "finance" && {
            "& > i": {
              background: "#f8fffa",
              opacity: 0.8,
              borderRadius: "8px",
              transform: "rotate(-9deg)",
              width: "80%",
              height: "90%",
              boxShadow: "5px 5px 0 #163e3520",
            },
            "& > i:nth-of-type(2)": {
              width: "22%",
              height: "80%",
              left: "5%",
              transform: "rotate(5deg)",
            },
            "& > i:nth-of-type(3)": {
              display: "none",
            },
          }),
          ...(work.theme === "herbe" && {
            "& > i": {
              borderRadius: "18px 18px 3px 3px",
              width: "26%",
              height: "95%",
              transform: "rotate(0)",
              background: "#c6c8a9",
              opacity: 0.5,
            },
            "& > i:nth-of-type(2)": {
              height: "60%",
              left: "8%",
              transform: "rotate(-9deg)",
            },
            "& > i:nth-of-type(3)": {
              height: "72%",
              right: "8%",
              transform: "rotate(9deg)",
            },
          }),
          ...(work.theme === "hub" && {
            "& > i": {
              background: "#f5f0ff",
              transform: "rotate(10deg)",
            },
          }),
          ...(work.theme === "editorial" && {
            "& > i": {
              width: "65%",
              height: "110%",
              transform: "rotate(-8deg)",
              background: "#faf9f4",
              opacity: 0.8,
            },
            "& > i:nth-of-type(2), & > i:nth-of-type(3)": {
              display: "none",
            },
          }),
        }}
      >
        <span>{work.brand}</span>
        <i />
        <i />
        <i />
      </Box>

      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "8px",
          letterSpacing: ".1em",
          position: "relative",
        }}
      >
        MINH ANH STUDIO <ArrowUpRight size={16} />
      </Box>
    </Box>
  );
}
