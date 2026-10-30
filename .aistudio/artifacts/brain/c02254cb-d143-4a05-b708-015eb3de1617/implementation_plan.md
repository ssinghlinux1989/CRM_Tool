# Implementation Plan: Helios Solar CRM (Version 1)

A modular, open-source Solar Sales CRM tailored for solar installers, sales teams, and site surveyors, hosted for $0/month on Vercel's free tier.

---

## 1. User Decisions & Architectural Alignment

Based on your clarifications, Version 1 will focus on the agreed core modules while keeping the architecture lightweight, mobile-friendly, and cost-free:

1. **Modules Included in Version 1**:
   - **Dashboard**: High-level sales KPI metrics (Monthly kW contracted, active pipeline value, lead conversion rate, deal velocity, lead sources breakdown donut chart).
   - **Leads & Pipeline Management**: Kanban pipeline + tabular list, CSV import/export, manual quick-add intake, source tagging (Facebook Ads, Google, Website, Reference, Walk-in, Cold Call).
   - **Follow-ups & Activity Scheduler**: Scheduled calls, reminders, site visit booking, overdue follow-up alerts with instant status updates.
   - **Site Survey Studio**: Roof pitch/azimuth/shading audit, NEC 120% electrical service panel check, roof measurement specs, and photo attachment/preview using client-side image compression (respecting Supabase's 1 GB free tier).
   - **Proposal & Sizing Engine**: Real-time PV system sizing (kW DC, panel count, annual kWh output, battery backup options, 30% Federal ITC / state incentives, 25-yr financial savings, print-ready client proposal).
   - **Project Installation Milestones**: Post-sale execution board (Contract Signed $\rightarrow$ Site Survey Complete $\rightarrow$ Engineering CAD $\rightarrow$ Permitting / Interconnection $\rightarrow$ Installation Scheduled $\rightarrow$ Inspection Passed $\rightarrow$ PTO Energized).
   - *Deferred to Version 2*: Full GST invoicing, AMC & Service ticketing, Team Sales Quotas, and automated paid webhook pipelines (can be added later).

2. **Access Control & Regional Permissions**:
   - **City-Based Visibility**: Users are scoped to their assigned regional territory/city (e.g., Austin, San Jose, Tampa, Scottsdale, or All Cities for Admins).
   - City filter switcher at the top level to simulate or enforce city-restricted views.

3. **Custom Branding & Theme Customizer**:
   - **Logo Upload**: Built-in branding settings allowing companies to upload their transparent PNG/SVG logo.
   - **Dynamic Brand Name & Colors**: Customize the company name, contact header, license number, and accent color scheme (Solar Amber, Royal Blue, Emerald Green, or Slate).

4. **Device Optimization & Responsiveness**:
   - Responsive layouts optimized for both field smartphones/tablets (surveyors on ladders/roofs) and desktop monitors (closers and managers).

---

## 2. Technical Architecture & Vercel Free Hosting

- **Frontend Framework**: React 19 + TypeScript + Vite with Tailwind CSS.
- **State Management & Persistence**: LocalStorage with schema migrations, prepared for drop-in Supabase PostgreSQL integration via environment variables.
- **Image Optimization**: Client-side canvas downsampling (WebP/JPEG max 1200px) so site survey photos stay under 200KB each, allowing thousands of survey photos within free storage limits.
- **Vercel Hobby Tier Compatibility**: SPA rewrites in `vercel.json`, sub-second edge loading, zero server maintenance costs.

---

## 3. Step-by-Step Implementation Roadmap

### Phase 1: Branding & Multi-City Scope Architecture
- Add `BrandingSettings` state & modal: Upload custom logo, set company name, address, license number, and theme accent.
- Add `CityTerritory` model with user profile scoping (e.g., San Jose, Cupertino, Austin, Scottsdale, Tampa, New York, or All).
- Implement global territory switcher in header with role badges (Admin, Sales Consultant, Site Surveyor, Project Coordinator).

### Phase 2: Follow-ups & Reminders Module
- Create `FollowUpQueue` component: Filter by Today, Upcoming, Overdue, and Completed.
- Quick actions: Mark Done, Reschedule (+1 day, +3 days, +1 week), Add Log Note.
- Notification badge in the navigation bar showing pending follow-ups.

### Phase 3: Enhanced Site Survey with Photo Uploads
- Add photo uploader with client-side preview and automatic thumbnail compression (Roof Plane, Service Panel, Inverter Location, Obstructions).
- Roof measurement diagram / area calculator (panel fit test).
- NEC 120% Rule electrical safety verification with MPU (Main Panel Upgrade) alert.

### Phase 4: Project Installation & PTO Tracking
- Dedicated **Projects & Execution** view:
  - Tracks sold systems through post-sale engineering: Permit submission, AHJ review, installation scheduling, final municipal inspection, and utility PTO (Permission to Operate).
  - Milestone checklist with target completion dates and milestone progress bars.

### Phase 5: Lead Sources & Analytics Donut
- Lead intake updated with configurable lead sources: `Facebook Ads`, `Google Search`, `Website Form`, `Referral`, `Walk-in`, `Cold Call/Canvassing`.
- Visual SVG / CSS Donut chart on the Dashboard displaying lead acquisition source distribution.
- CSV lead import parser supporting spreadsheets from Excel.

### Phase 6: Verification & Final Polish
- End-to-end testing across desktop and simulated mobile viewports.
- TypeScript compilation and linter verification (`compile_applet`, `lint_applet`).

---

## 4. Verification & Testing Plan

1. **Branding Test**: Upload a custom test logo and verify the logo appears in the header, proposal PDF view, and customer-facing estimates.
2. **City-Based Permission Test**: Switch active city territory (e.g. "Austin" vs "San Jose") and verify the pipeline and dashboard update to reflect only leads in that jurisdiction.
3. **Survey Photo Compression Test**: Upload a high-resolution photo in Site Survey, verify instant thumbnail rendering, photo labeling, and non-blocking storage usage.
4. **Follow-Up Workflow Test**: Create a follow-up reminder, verify badge counter increments, reschedule date, and mark as completed.
5. **Project Milestone Test**: Move a deal to Closed Won and verify it smoothly initializes in the Project Execution board with milestone tracking.
