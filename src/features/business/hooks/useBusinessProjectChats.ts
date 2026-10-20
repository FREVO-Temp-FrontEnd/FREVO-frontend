import { useCallback, useEffect, useMemo, useState } from "react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { Candidate, ChatMessage, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

export interface BusinessChatContact {
  candidate: Candidate;
  talent: TalentProfile;
  lastMessage?: ChatMessage;
  lastIncomingMessage?: ChatMessage;
  readOnly: boolean;
}

export interface BusinessChatGroup {
  project: ProjectBrief;
  contacts: BusinessChatContact[];
}

function contactsForProject(project: ProjectBrief, candidates: Candidate[], talents: TalentProfile[], messages: ChatMessage[]) {
  const talentById = new Map(talents.map((talent) => [talent.id, talent]));
  const lastMessageByTalent = new Map<string, ChatMessage>();
  const lastIncomingByTalent = new Map<string, ChatMessage>();
  for (const message of messages) {
    if (message.projectId !== project.id) continue;
    const previous = lastMessageByTalent.get(message.talentId);
    if (!previous || message.sentAt > previous.sentAt) lastMessageByTalent.set(message.talentId, message);
    if (message.sender === "talent") {
      const previousIncoming = lastIncomingByTalent.get(message.talentId);
      if (!previousIncoming || message.sentAt > previousIncoming.sentAt) lastIncomingByTalent.set(message.talentId, message);
    }
  }

  return candidates
    .filter((candidate) => candidate.projectId === project.id && candidate.chatUnlocked)
    .flatMap((candidate): BusinessChatContact[] => {
      const talent = talentById.get(candidate.talentId);
      if (!talent) return [];
      return [{
        candidate,
        talent,
        lastMessage: lastMessageByTalent.get(talent.id),
        lastIncomingMessage: lastIncomingByTalent.get(talent.id),
        readOnly: candidate.status === "not_selected"
          || (["ongoing", "closed", "completed"].includes(project.status) && project.selectedTalentId !== talent.id),
      }];
    })
    .sort((a, b) => (b.lastMessage?.sentAt ?? b.candidate.chatUnlockedAt ?? "").localeCompare(a.lastMessage?.sentAt ?? a.candidate.chatUnlockedAt ?? ""));
}

export function useBusinessProjectChats(projectId: string) {
  const { projects, candidates, talents, messages } = useBusiness();

  return useMemo(() => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return { project: undefined, contacts: [] as BusinessChatContact[] };

    return { project, contacts: contactsForProject(project, candidates, talents, messages) };
  }, [projectId, projects, candidates, talents, messages]);
}

export function useBusinessInbox() {
  const { projects, candidates, talents, messages } = useBusiness();

  return useMemo(() => {
    const groups: BusinessChatGroup[] = projects
      .map((project) => ({ project, contacts: contactsForProject(project, candidates, talents, messages) }));

    groups.sort((a, b) => {
      const aActivity = a.contacts[0]?.lastMessage?.sentAt ?? a.contacts[0]?.candidate.chatUnlockedAt ?? "";
      const bActivity = b.contacts[0]?.lastMessage?.sentAt ?? b.contacts[0]?.candidate.chatUnlockedAt ?? "";
      return Number(b.contacts.length > 0) - Number(a.contacts.length > 0)
        || bActivity.localeCompare(aActivity)
        || a.project.title.localeCompare(b.project.title, "vi");
    });

    return groups;
  }, [projects, candidates, talents, messages]);
}

interface InboxPreferences {
  readAt: Record<string, string>;
  favorites: string[];
}

const INBOX_PREFERENCES_KEY = "frevo-business-inbox-preferences-v1";

function conversationKey(projectId: string, talentId: string) {
  return `${projectId}:${talentId}`;
}

function loadInboxPreferences(): InboxPreferences {
  try {
    const saved = sessionStorage.getItem(INBOX_PREFERENCES_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (parsed && typeof parsed === "object" && "readAt" in parsed && "favorites" in parsed
        && parsed.readAt && typeof parsed.readAt === "object" && Array.isArray(parsed.favorites)) {
        return { readAt: parsed.readAt as Record<string, string>, favorites: parsed.favorites.filter((key): key is string => typeof key === "string") };
      }
    }
  } catch { /* Keep inbox usable if session storage is unavailable. */ }
  return { readAt: {}, favorites: [] };
}

export function useBusinessInboxPreferences() {
  const [preferences, setPreferences] = useState<InboxPreferences>(loadInboxPreferences);

  useEffect(() => {
    try { sessionStorage.setItem(INBOX_PREFERENCES_KEY, JSON.stringify(preferences)); }
    catch { /* Keep in-memory preferences for the current render. */ }
  }, [preferences]);

  const isUnread = useCallback((projectId: string, contact: BusinessChatContact) => {
    const lastIncoming = contact.lastIncomingMessage?.sentAt;
    return Boolean(lastIncoming && lastIncoming > (preferences.readAt[conversationKey(projectId, contact.talent.id)] ?? ""));
  }, [preferences.readAt]);

  const isFavorite = useCallback((projectId: string, talentId: string) =>
    preferences.favorites.includes(conversationKey(projectId, talentId)), [preferences.favorites]);

  const markRead = useCallback((projectId: string, contact: BusinessChatContact) => {
    const lastIncoming = contact.lastIncomingMessage?.sentAt;
    if (!lastIncoming) return;
    const key = conversationKey(projectId, contact.talent.id);
    setPreferences((current) => current.readAt[key] >= lastIncoming ? current : {
      ...current,
      readAt: { ...current.readAt, [key]: lastIncoming },
    });
  }, []);

  const toggleFavorite = useCallback((projectId: string, talentId: string) => {
    const key = conversationKey(projectId, talentId);
    setPreferences((current) => ({
      ...current,
      favorites: current.favorites.includes(key)
        ? current.favorites.filter((favorite) => favorite !== key)
        : [...current.favorites, key],
    }));
  }, []);

  return { isUnread, isFavorite, markRead, toggleFavorite };
}
