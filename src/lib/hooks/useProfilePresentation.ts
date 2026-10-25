import { useEffect, useState } from "react";

export interface ProfilePresentation {
  name: string;
  role: string;
  location: string;
  availability: string;
  about: string;
  skills: string[];
  featuredIds: string[];
}

export function useProfilePresentation(talentId: string, defaults: ProfilePresentation) {
  const key = `frevo-profile-presentation-${talentId}`;
  const [profile, setProfile] = useState<ProfilePresentation>(() => {
    try {
      const value = JSON.parse(sessionStorage.getItem(key) ?? "null");
      if (value && ["name", "role", "location", "availability", "about"].every(field => typeof value[field] === "string")
        && Array.isArray(value.skills) && value.skills.every((item: unknown) => typeof item === "string")
        && Array.isArray(value.featuredIds) && value.featuredIds.every((item: unknown) => typeof item === "string")) {
        return { ...defaults, ...value, featuredIds: value.featuredIds.slice(0, 3) };
      }
    } catch { /* Fall back to the existing demo profile. */ }
    return defaults;
  });
  useEffect(() => {
    try { sessionStorage.setItem(key, JSON.stringify(profile)); }
    catch { /* Keep edits available in memory when storage is unavailable. */ }
  }, [key, profile]);
  return { profile, setProfile };
}
