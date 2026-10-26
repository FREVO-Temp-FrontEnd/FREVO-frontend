import { useEffect } from "react";
import { Box, Button, InputAdornment, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { ArrowRight, BriefcaseBusiness, Search } from "lucide-react";
import { Link } from "react-router";
import { OngoingProjectCard } from "../components/OngoingProjectCard";
import { useOngoingProjects, type OngoingFilter, type OngoingSort } from "../hooks/useOngoingProjects";

export function OngoingProjectsPage() {
  const page = useOngoingProjects();
  useEffect(() => {
    document.title = "Dự án đang tiến hành | FREVO";
  }, []);

  const allFilters: { value: OngoingFilter; label: string; count: number }[] = [
    { value: "all", label: "Tất cả", count: page.items.length },
    { value: "needs_review", label: "Cần phản hồi", count: page.needsReviewCount },
  ];
  const filters = allFilters.filter((item) => item.value === "all" || item.count > 0);

  const hasFilter = page.filter !== "all" || !!page.query.trim();

  return (
    <Box
      sx={(theme) => ({
        minWidth: 0,
        fontFamily: theme.typography.fontFamily,
        "&& h1, && h2": {
          fontFamily: theme.typography.h2.fontFamily,
          letterSpacing: "-0.015em",
        },
        "&& .MuiButton-root": {
          fontFamily: theme.typography.fontFamily,
          fontSize: 13,
          fontWeight: 600,
          textTransform: "none",
          letterSpacing: 0,
          lineHeight: 1.4,
        },
        "&& .MuiButton-contained, && a.MuiButton-contained": {
          color: "#ffffff !important",
          "& *": {
            color: "#ffffff !important",
          },
        },
      })}
    >
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Typography component="h1" sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 800, lineHeight: 1.25 }}>
            Dự án đang tiến hành
          </Typography>
          <p className="mt-2 text-sm text-[#747773]">
            Theo dõi đối tác đang hợp tác và mở nhanh dự án cần bạn phản hồi.
          </p>
        </div>
        {!!page.items.length && (
          <p className="text-sm text-[#747773]">
            <strong className="text-[#20201f]">{page.items.length}</strong> dự án đang thực hiện
            {page.needsReviewCount > 0 && (
              <> · <strong className="text-[#bd3d14]">{page.needsReviewCount}</strong> cần phản hồi</>
            )}
          </p>
        )}
      </header>

      {/* Synchronized Tab Navigation (matching MyProjectsPage) - only shown when there are items needing review */}
      {filters.length > 1 && (
        <div
          className="mb-5 flex max-w-full gap-1 overflow-x-auto border-b border-[#e4e6e2]"
          role="group"
          aria-label="Lọc trạng thái dự án đang tiến hành"
        >
          {filters.map((item) => {
            const isActive = page.filter === item.value;
            const isNeedsReview = item.value === "needs_review";
            return (
              <Button
                key={item.value}
                aria-pressed={isActive}
                onClick={() => page.setFilter(item.value)}
                sx={{
                  flexShrink: 0,
                  minHeight: 48,
                  px: 2,
                  borderRadius: 0,
                  borderBottom: "2px solid",
                  borderColor: isActive ? "primary.main" : "transparent",
                  "&&": {
                    color: isActive ? "primary.dark" : "text.secondary",
                    bgcolor: "transparent",
                  },
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 600,
                  transition: "color 150ms ease, border-color 150ms ease",
                  "&:hover": {
                    bgcolor: "#f0f2ed",
                    color: isActive ? "primary.dark" : "text.primary",
                  },
                }}
              >
                {item.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive
                      ? "bg-[#fff0e9] text-[#bd3d14]"
                      : isNeedsReview && item.count > 0
                      ? "bg-[#fff0e9] text-[#bd3d14]"
                      : "bg-[#eeefeb] text-[#747773]"
                  }`}
                >
                  {item.count}
                </span>
              </Button>
            );
          })}
        </div>
      )}

      {/* Search and Sort Controls */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <TextField
          size="small"
          value={page.query}
          onChange={(event) => page.setQuery(event.target.value)}
          placeholder="Tìm dự án hoặc đối tác…"
          slotProps={{
            htmlInput: { "aria-label": "Tìm dự án theo tên hoặc đối tác" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={17} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: "100%", sm: 300 },
            "& .MuiOutlinedInput-root": {
              height: 42,
              bgcolor: "background.paper",
              borderRadius: 999,
              fontSize: 14,
            },
          }}
        />
        <TextField
          select
          size="small"
          label="Sắp xếp"
          value={page.sort}
          onChange={(event) => page.setSort(event.target.value as OngoingSort)}
          sx={{
            minWidth: 190,
            "& .MuiOutlinedInput-root": {
              height: 42,
              bgcolor: "background.paper",
              borderRadius: 999,
              fontSize: 13,
            },
            "& .MuiInputLabel-root": { fontSize: 13 },
          }}
        >
          <MenuItem value="recent">Cập nhật gần nhất</MenuItem>
          <MenuItem value="deadline">Hạn gần nhất</MenuItem>
        </TextField>
      </div>

      {/* Projects List or Empty State */}
      {page.visibleItems.length ? (
        <Box component="section" aria-label="Danh sách dự án đang tiến hành" className="flex flex-col gap-4">
          {page.visibleItems.map((item) => (
            <OngoingProjectCard key={item.project.id} item={item} />
          ))}
        </Box>
      ) : (
        <Paper
          component="section"
          elevation={0}
          sx={{
            px: 3,
            py: { xs: 5, md: 7 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "24px",
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor: "#fff0e9",
              color: "primary.dark",
            }}
          >
            <BriefcaseBusiness size={26} />
          </Box>
          <Typography component="h2" sx={{ mt: 2, fontSize: 20, fontWeight: 700 }}>
            {hasFilter ? "Không tìm thấy dự án phù hợp" : "Chưa có dự án đang tiến hành"}
          </Typography>
          <Typography sx={{ mt: 1, mx: "auto", maxWidth: 390, color: "text.secondary", fontSize: 13, lineHeight: 1.7 }}>
            {hasFilter
              ? "Thử từ khóa khác hoặc xóa bộ lọc để xem tất cả dự án đang thực hiện."
              : "Khi hai bên xác nhận hợp tác, dự án sẽ xuất hiện tại đây để bạn theo dõi."}
          </Typography>
          {hasFilter ? (
            <Button onClick={page.clearFilters} sx={{ mt: 2.5 }}>
              Xem tất cả dự án
            </Button>
          ) : (
            <Button
              component={Link}
              to="/business/projects"
              variant="contained"
              endIcon={<ArrowRight size={16} />}
              sx={{
                mt: 2.5,
                color: "#ffffff !important",
                "& *": { color: "#ffffff !important" },
              }}
            >
              Về Dự án của tôi
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
}
