import { useId, type ReactNode } from "react";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFilterRail } from "../hooks/useFilterRail";

interface FilterOptionRailProps {
  label: string;
  children: ReactNode;
  splitControls?: boolean;
  resetScroll?: boolean;
}

export function FilterOptionRail({ label, children, splitControls = false, resetScroll = true }: FilterOptionRailProps) {
  const railId = useId();
  const { railRef, edges, updateEdges, scroll } = useFilterRail(label, resetScroll);
  const previousButton = <IconButton
    aria-label={`Cuộn ${label.toLocaleLowerCase("vi")} sang trái`}
    aria-controls={railId}
    disabled={!edges.previous}
    onClick={() => scroll(-1)}
    sx={arrowStyles}
  >
    <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
  </IconButton>;
  const nextButton = <IconButton
    aria-label={`Cuộn ${label.toLocaleLowerCase("vi")} sang phải`}
    aria-controls={railId}
    disabled={!edges.next}
    onClick={() => scroll(1)}
    sx={arrowStyles}
  >
    <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
  </IconButton>;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
      {splitControls && previousButton}
      <Box
        ref={railRef}
        id={railId}
        role="group"
        aria-label={label}
        onScroll={updateEdges}
        onFocusCapture={(event) => event.target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" })}
        sx={{
          display: "flex",
          gap: 1,
          flex: 1,
          minWidth: 0,
          overflowX: "auto",
          overscrollBehaviorX: "contain",
          scrollSnapType: "x proximity",
          scrollPaddingInline: "4px",
          scrollbarWidth: "none",
          py: 0.5,
          px: 0.5,
          "&::-webkit-scrollbar": { display: "none" },
          "& > button": { scrollSnapAlign: "start", flexShrink: 0 },
        }}
      >
        {children}
      </Box>
      {splitControls ? nextButton : <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>{previousButton}{nextButton}</Box>}
    </Box>
  );
}

const arrowStyles = {
  width: 42,
  height: 42,
  flexShrink: 0,
  border: "1px solid",
  borderColor: "#d0d5dd",
  color: "#344054", bgcolor: "#f4f6f8",
  "&:hover": { bgcolor: "#e8ecf2", borderColor: "#b8c0cc", color: "#1e293b" },
  "&.Mui-disabled": { borderColor: "#e4e7ec", bgcolor: "transparent", color: "action.disabled" },
  "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.dark", outlineOffset: 2 },
};
