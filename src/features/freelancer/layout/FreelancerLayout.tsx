import { Outlet } from "react-router";
import { Typography } from "@mui/material";
import { FreelancerHeader } from "../components/FreelancerHeader";
import { isDemoMode } from "@/lib/api/projectsApi";

export default function FreelancerLayout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Đi đến nội dung chính
      </a>
      <FreelancerHeader />
      {isDemoMode && (
        <Typography
          sx={{
            minHeight: "44px",
            py: "10px",
            px: { xs: "16px", sm: "28px" },
            bgcolor: "#fff0e9",
            color: "#ab2e00",
            fontSize: 13,
            lineHeight: 1.4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Prototype dùng dữ liệu minh họa — thao tác ứng tuyển không gửi dữ liệu thật.
        </Typography>
      )}
      <Outlet />
    </>
  );
}
