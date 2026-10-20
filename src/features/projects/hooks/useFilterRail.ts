import { useCallback, useEffect, useRef, useState } from "react";

export function useFilterRail(contentKey: string, resetScroll: boolean) {
  const railRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ previous: false, next: false });

  const updateEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const previous = rail.scrollLeft > 2;
    const next = rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 2;
    setEdges((current) => current.previous === previous && current.next === next
      ? current
      : { previous, next });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (resetScroll) rail.scrollTo({ left: 0, behavior: "instant" });
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(rail);
    for (const child of rail.children) observer.observe(child);
    return () => observer.disconnect();
  }, [contentKey, resetScroll, updateEdges]);

  const scroll = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.8, 120),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return { railRef, edges, updateEdges, scroll };
}
