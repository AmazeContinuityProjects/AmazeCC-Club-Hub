---
title: "The page & its tabs"
description: "page.tsx line by line - the shell, the club switcher, localStorage orchestration and tab mounting."
---

# The page & its tabs

**File:** `src/app/page.tsx` · **Rendered by:** `src/app/layout.tsx` (the one route) · **Parent of:** every tab component

> **In one line:** the only screen - it owns login state, the active club and the active tab, and remounts a tab component whenever the club changes.

## Imports and constants

```tsx
import LoginPage from "@/components/LoginPage";
import FeedManager from "@/components/FeedManager";       // tab 1
import LandingPageBuilder from "@/components/LandingPageBuilder"; // tab 3
import Sidebar from "@/components/Sidebar";
import ClubDetailsEditor from "@/components/ClubDetailsEditor";    // tab 2
import RepManager from "@/components/RepManager";                  // tab 4
import { getClubToken } from "@/lib/api";
import { LogOut, MessageSquare, Info, LayoutTemplate, Users } from "lucide-react";
```

`TAB_LABELS` and `TAB_DESCRIPTIONS` are plain string maps keyed by tab id - they feed the sticky header text. Add a tab → add entries there (and a render branch below).

## `deduplicateRoles`

```tsx
const deduplicateRoles = (rawRoles: any[]) => {
  const map = new Map<string, any>();
  for (const r of (rawRoles || [])) {
    if (!r?.club_id) continue;
    const existing = map.get(r.club_id);
    if (!existing || r.role === "super-club-rep") map.set(r.club_id, r);
  }
  return Array.from(map.values());
};
```

The API can return one entry per club per role (and super-club-rep duplicates across grants). The UI wants **exactly one entry per `club_id`, preferring `super-club-rep`** - a Map keyed on club_id, overwriting on supers. Same logic is duplicated in `LoginPage.tsx` after login (see [auth-flow](../03-api-integration/auth-flow.md)).

## State & boot effect

```tsx
const [token, setToken] = useState<string | null>(null);
const [roles, setRoles] = useState<any[]>([]);
const [activeClubId, setActiveClubId] = useState<string | null>(null);
const [activeTab, setActiveTab] = useState<string>("feed");

useEffect(() => {
  const storedToken = getClubToken();
  if (storedToken) {
    setToken(storedToken);
    const storedRoles = deduplicateRoles(JSON.parse(localStorage.getItem("club_roles") || "[]"));
    setRoles(storedRoles);
    if (storedRoles.length > 0) {
      const storedActive = localStorage.getItem("active_club_id");
      if (storedActive && storedRoles.find(r => r.club_id === storedActive)) setActiveClubId(storedActive);
      else { setActiveClubId(storedRoles[0].club_id); localStorage.setItem("active_club_id", storedRoles[0].club_id); }
    }
  }
}, []);
```

Boot sequence: read token → read roles (defensively, with try/catch) → pick the previously active club **if it still exists**, else the first represented club. The try/catch means corrupt `club_roles` JSON degrades to empty - the user is treated as logged out... actually as a rep with no clubs (logged in but nothing to do) - mildly awkward but deliberate.

## Handlers

| Handler | Does |
|---|---|
| `switchClub(newClubId)` | writes `active_club_id`, sets state - tabs remount via `key` |
| `handleLogin(newToken, newRoles)` | dedupes roles, stores token/roles, picks first club |
| `handleLogout()` | **deletes the three localStorage keys** - no API call |

## Render skeleton

1. `if (!token) return <LoginPage onLogin={handleLogin} />;`
2. `activeRole`/`isSuperRep` derived from roles; reps tab is conditionally available.
3. Mobile top bar (`md:hidden`): logo, tab/club badge, club `OptionPicker` (when >1 club), `ThemeSwitcher`, logout icon.
4. Mobile bottom nav (`md:hidden`): `MobileBottomNav` with Feed/Details/Landing(+Reps for supers).
5. Desktop sidebar (`hidden md:block`): `<Sidebar … />`.
6. Main column: sticky header (TAB_LABELS value + the TAB_DESCRIPTIONS blurb + a cosmetic "Active" dot), then the four tab branches - each wrapped in a key combining tab name and active club id, and mounted only when activeClubId is set. The reps tab additionally requires isSuperRep.

## localStorage writes from this file

`active_club_id` (on club switch / login / boot fallback). `club_token`/`club_roles` are only written by `LoginPage` (see [localStorage keys](../05-reference/localstorage-keys.md)).

## Where to next

- **[LoginPage](./login-page.md)** - the gate you pass before reaching any tab.
- **[Sidebar](./sidebar.md)** - the desktop twin of the mobile top/bottom bars.
