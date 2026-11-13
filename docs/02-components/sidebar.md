---
title: "Sidebar"
description: "The desktop rail - every row on it, tied to the exact props and access rules behind it."
---

# Sidebar

**File:** `src/components/Sidebar.tsx` · **Rendered by:** `page.tsx` on screens ≥ `md:` width · **Props:** the whole shell state

> **In one line:** the fixed left rail on desktops - logo, club picker, tab list (Reps only for super reps), theme switch, logout.

## The props you need to understand one screen

```tsx
interface SidebarProps {
  activeTab: string;            // which tab is highlighted
  setActiveTab: (tab: string) => void;   // switch tabs (never called with unknown ids)
  roles: any[];                 // your club reps, as the shell computed them
  activeClubId: string | null;  // which club you're editing
  switchClub: (id: string) => void;      // change active club
  handleLogout: () => void;              // nuke localStorage
  isSuperRep?: boolean;         // is your role for THIS club 'super-club-rep'?
}
```

If you understand these seven, you understand the sidebar's whole decision space.

## What each row does

| Row | Behavior | Visibility |
|---|---|---|
| Logo + "Club Hub" | purely decorative | always |
| Theme switcher | flips light/dark/midnight | always |
| Club picker | `roles.length > 1` → an `OptionPicker` with one entry per club; exactly 1 → a static pill showing the club id | always |
| Feed Manager | sets `activeTab("feed")` | always |
| Club Details | sets `activeTab("details")` | always |
| Landing Page | sets `activeTab("landing")` | always |
| Manage Reps | sets `activeTab("reps")`; carries a `<Badge>Admin</Badge>` | **only when `isSuperRep`** |
| Logout | pale button, `text-danger`; splices the three localStorage keys | always |

## The same rule, three places

The Reps tab appears only when you're a super rep **for the club you're editing**. That predicate is computed in `page.tsx` (`activeRole === "super-club-rep"`), passed down as `isSuperRep`, and consulted identically by the sidebar here, the mobile bottom nav, and the conditional render branch. **One computation, three consumers** - if you ever see all three drift apart, page.tsx is the source of truth, not the children.

## Why no icons collapse, hover-z, etc.

This is a fixed 256px rail. It doesn't collapse; it just hides below `md:`. The phone UI is different components on purpose (`page.tsx` renders `MobileBottomNav` and a separate top bar) because tab density and touch targets are different animals on small screens.

## Where to next

- **[The page & its tabs](./page.md)** - the parent that feeds these props.
- **[ThemeSwitcher](./theme-switcher.md)**
