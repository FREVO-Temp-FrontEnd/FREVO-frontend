import { Link } from "react-router";
import { Box, Typography } from "@mui/material";
import {
  ArrowLeft,
  MapPin,
  Sparkles,
} from "lucide-react";
import { PROFILE_TABS, type ProfileTabConfig } from "../data/profile-tabs";

export type { ProfileTabConfig };

export interface PersonalInfo {
  name: string;
  specialty: string;
  location: string;
  working: string;
  availability: string;
  bio: string;
}

interface ProfileSidebarProps {
  personal: PersonalInfo;
  initials: string;
  activeTab: string;
}

export function ProfileSidebar({
  personal,
  initials,
  activeTab,
}: ProfileSidebarProps) {
  return (
    <Box
      component="aside"
      sx={{
        alignSelf: "start",
        position: { xs: "static", md: "sticky" },
        top: "100px",
        display: { xs: "none", md: "block" },
      }}
    >
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#5b605a] hover:text-[#20201f] transition-colors mb-5"
      >
        <ArrowLeft size={15} />
        <span>Khám phá dự án</span>
      </Link>

      {/* Profile Header Info - Flat Layout */}
      <Box
        sx={{
          pb: "22px",
          borderBottom: "1px solid var(--line, #e4e6e2)",
        }}
      >
        {/* Avatar - Sleek Modern Style */}
        <div className="relative mb-3.5 inline-block">
          <div className="w-[72px] h-[72px] rounded-full bg-white p-0.5 ring-2 ring-white shadow-xs">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#fff0e9] to-[#ffe2d4] text-[#bd3d14] font-bold text-2xl flex items-center justify-center font-['Archivo']">
              {initials}
            </div>
          </div>
          <span
            className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-600/20"
            title="Sẵn sàng hợp tác"
          />
        </div>

        {/* Name & Specialty */}
        <div className="space-y-0.5">
          <Typography
            component="h2"
            sx={{
              fontFamily: "Archivo, Arial, sans-serif",
              fontWeight: 800,
              fontSize: "20px",
              lineHeight: 1.25,
              color: "#20201f",
              letterSpacing: "-0.03em",
            }}
          >
            {personal.name}
            <span className="text-[#f4490b]">.</span>
          </Typography>
          <p className="text-xs font-medium text-neutral-500 leading-snug">
            {personal.specialty}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-2">
          <MapPin size={13} className="text-neutral-400 shrink-0" />
          <span className="truncate">{personal.location}</span>
        </div>

        {/* Availability Badge */}
        <div className="mt-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{personal.availability}</span>
          </span>
        </div>
      </Box>

      {/* Navigation Links - Flat List */}
      <Box
        component="nav"
        aria-label="Các mục hồ sơ"
        sx={{
          display: "grid",
          gap: "4px",
          py: "18px 0",
        }}
      >
        {PROFILE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              to={`/profile?tab=${tab.id}`}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-[#fff0e9] text-[#bd3d14] font-bold"
                  : "text-[#5b605a] hover:bg-[#fff0e9]/60 hover:text-[#20201f]"
              }`}
            >
              <Icon
                size={17}
                className={isActive ? "text-[#bd3d14]" : "text-[#7a8079]"}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}

      </Box>

      {/* Inspirational Quote Card */}
      <Box
        sx={{
          mt: "8px",
          p: "18px 16px",
          bgcolor: "var(--peach, #fff0e9)",
          borderRadius: "var(--radius, 13px)",
          "& > svg": { color: "var(--orange-dark, #bd3d14)" },
          "& h3": {
            mt: "10px",
            fontSize: "15px",
            fontWeight: 800,
            fontFamily: "Archivo, Arial, sans-serif",
            color: "#20201f",
          },
          "& p": {
            mt: "6px",
            fontSize: "12px",
            lineHeight: 1.6,
            color: "#72635b",
          },
        }}
      >
        <Sparkles size={20} />
        <h3>Để tác phẩm lên tiếng.</h3>
        <p>
          Chia sẻ những dự án thể hiện rõ nhất cá tính và cách bạn sáng tạo.
        </p>
      </Box>
    </Box>
  );
}
