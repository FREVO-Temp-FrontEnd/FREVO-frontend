import {
  FileText,
  FolderOpen,
  Sparkles,
  UserRound,
  Wallet,
} from "lucide-react";

export interface ProfileTabConfig {
  id: string;
  label: string;
  icon: typeof UserRound;
}

export const PROFILE_TABS: ProfileTabConfig[] = [
  { id: "personal", label: "Thông tin cá nhân", icon: UserRound },
  { id: "portfolio", label: "Portfolio", icon: FolderOpen },
  { id: "cv", label: "CV của tôi", icon: FileText },
  { id: "experience", label: "Kinh nghiệm & Kỹ năng", icon: Sparkles },
  { id: "services", label: "Dịch vụ & Báo giá", icon: Wallet },
];
