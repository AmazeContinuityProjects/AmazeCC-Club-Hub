---
title: "Sidebar"
description: "The desktop nav rail - roles, club switcher, theme control and logout, straight down the props list."
---

# Sidebar

**File:** `src/components/Sidebar.tsx` · **Rendered by:** `page.tsx` in the `hidden md:block` branch · **Props:** the shell's state + actions

> **In one line:** desktop-only navigation: club switch (if >1), four tab entries, theme switcher, logout.

## Props (exactly)

```tsx
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  roles: any[];
  activeClubId: string | null;
  switchClub: (id: string) => void;
  handleLogout: () => void;
  isSuperRep?: boolean;
}
```

## Behaviour

| Block | What it does |
|---|---|
| Header | logo + "Club Hub" + `<ThemeSwitcher />` |
| Club selector | >1 role → `OptionPicker` with one option per represented `club_id`; exactly 1 → static pill with the club id |
| Tab list | `Feed Manager`, `Club Details`, `Landing Page` - and `Manage Reps` **only when `isSuperRep`** |
| Reps badge | `Manage Reps` row carries `<Badge variant="warning" size="sm">Admin</Badge>` for super reps |
| Logout | ghost button, `text-danger`, `flex-row` wrapper for the icon+text (RN-web stacking fix) |

## Notes

- **The reps tab visibility logic is duplicated** (here and in `page.tsx`'s `mobileNavItems`): both gate on `isSuperRep` derived from the token's role for the *active* club. Switching to a non-rep club hides the tab automatically.
- The badge exists because super-reps manage *other reps*; regular reps manage only the club.

## Where to next

- **[page.tsx](./page.md)** - the state owner this component mirrors.
- **[ThemeSwitcher](./theme-switcher.md)**
