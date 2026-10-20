import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface ProjectBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function ProjectBreadcrumbs({ items }: ProjectBreadcrumbsProps) {
  return (
    <Breadcrumbs
      aria-label="Đường dẫn dự án"
      separator="/"
      sx={{
        mb: 2,
        color: "text.secondary",
        "& .MuiBreadcrumbs-ol": { rowGap: 0.75 },
        "& .MuiBreadcrumbs-separator": { mx: 1, color: "divider" },
      }}
    >
      {items.map((item, index) =>
        item.to ? (
          <MuiLink
            key={`${item.to}-${index}`}
            component={RouterLink}
            to={item.to}
            underline="hover"
            sx={{
              fontFamily: '"Be Vietnam Pro", sans-serif',
              fontSize: 13,
              lineHeight: 1.5,
              "&&": { color: "text.secondary" },
              "&&:hover": { color: "primary.dark", textDecoration: "underline" },
            }}
          >
            {item.label}
          </MuiLink>
        ) : (
          <Typography
            key={`${item.label}-${index}`}
            component="span"
            aria-current={index === items.length - 1 ? "page" : undefined}
            sx={{
              color: index === items.length - 1 ? "text.primary" : "text.secondary",
              fontFamily: '"Be Vietnam Pro", sans-serif',
              fontSize: 13,
              fontWeight: index === items.length - 1 ? 600 : 400,
              lineHeight: 1.5,
            }}
          >
            {item.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
