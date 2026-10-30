import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Globe, 
  Shield, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  DollarSign, 
  Layers, 
  Cpu, 
  Sparkles, 
  Code2, 
  CheckCircle2,
  ChevronRight,
  Zap,
  Lock,
  Mail
} from 'lucide-react';
import { VERCEL_BLUEPRINT_CODE } from '../data/mockData';

export const VercelDeployGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stack' | 'steps' | 'sql' | 'config'>('steps');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# Free Solar CRM: Open-Source Architecture & Vercel Deployment Guide

## Overview
How to build, operate, and scale a Solar Sales CRM for $0.00/month hosting cost using modern open-source web technologies, hosted on Vercel's Hobby Tier.

---

## 1. Zero-Dollar Infrastructure Stack

| Component | Technology | Free Tier Allowance | Real Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Hosting & Edge CDN** | Vercel (Hobby Tier) | 100 GB Bandwidth, Unlimited SSL, Edge Functions | **$0.00** |
| **Relational Database** | Supabase PostgreSQL / Neon | 500 MB DB, Connection Pooling, Real-time | **$0.00** |
| **Frontend Framework** | Next.js 15 / Vite + React 19 | MIT Open-Source | **$0.00** |
| **Authentication & RBAC** | Supabase Auth | Up to 50,000 Monthly Active Users | **$0.00** |
| **Document/Photo Storage** | Supabase Storage / Uploadcare | 1 GB Free (Roof photos, bills, contracts) | **$0.00** |
| **Transactional Email** | Resend | 3,000 emails/month (100/day) | **$0.00** |
| **Total Operating Cost** | | | **$0.00 / month** |

---

## 2. Step-by-Step Vercel Deployment Walkthrough

### Step 1: Initialize Git Repository
\`\`\`bash
git init
git add .
git commit -m "feat: initial solar crm release"
gh repo create solar-crm --public --source=. --push
\`\`\`

### Step 2: Provision Free Supabase Database
1. Go to https://supabase.com and create a free project.
2. Open the **SQL Editor** tab.
3. Paste the Helios CRM SQL schema (DDL) to create \`solar_leads\`, \`solar_proposals\`, \`site_surveys\`, and \`solar_reps\` tables.
4. Go to **Project Settings -> API** to retrieve your \`Project URL\` and \`Anon Public Key\`.

### Step 3: Deploy to Vercel
1. Log into https://vercel.com
2. Click **Add New... -> Project**
3. Select your GitHub repository (\`solar-crm\`)
4. In **Environment Variables**, provide:
   - \`VITE_SUPABASE_URL\` = your supabase URL
   - \`VITE_SUPABASE_ANON_KEY\` = your anon key
   - \`VITE_COMPANY_NAME\` = Your Solar Company Name
5. Click **Deploy**. Vercel will build and assign a global CDN URL (e.g., \`solar-crm.vercel.app\`).

### Step 4: Add Custom Domain
In Vercel -> Settings -> Domains, enter \`crm.yourcompany.com\`. Add a CNAME DNS record pointing to \`cname.vercel-dns.com\`. SSL is issued automatically.

---

## 3. PostgreSQL Database Schema
\`\`\`sql
${VERCEL_BLUEPRINT_CODE.postgresSchemaSql}
\`\`\`

---
*Created by Helios Solar CRM Blueprint.*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'helios-solar-crm-vercel-guide.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 rounded-2xl border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold tracking-wider uppercase">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Production Blueprint & Zero-Cost Architecture</span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">
              How to Build & Host a Solar CRM for $0/Month on Vercel
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Commercial solar CRMs like Aurora Solar or JobNimbus cost $150–$350/seat/month. By leveraging modern open-source frameworks (React/Next.js), Supabase PostgreSQL, and Vercel’s free Hobby tier, solar sales teams can run a fast, custom CRM with zero fixed overhead.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-400/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Blueprint (.md)</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'steps'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>5-Step Deployment Walkthrough</span>
          </button>

          <button
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'stack'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>100% Free Stack Breakdown ($0/mo)</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'sql'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL Schema (DDL)</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'config'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>vercel.json & .env Setup</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 5-Step Deployment Walkthrough */}
      {activeTab === 'steps' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VERCEL_BLUEPRINT_CODE.cliWalkthrough.map((step) => (
              <div
                key={step.step}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-mono text-xs font-bold">
                      {step.step}
                    </span>
                    <h3 className="font-semibold text-sm text-slate-200">{step.title}</h3>
                  </div>

                  <button
                    onClick={() => handleCopy(`step-${step.step}`, step.code)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="Copy snippet"
                  >
                    {copiedKey === `step-${step.step}` ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                  {step.code}
                </div>
              </div>
            ))}
          </div>

          {/* Why this is ideal for Solar Sales Teams */}
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Why Vercel + Open-Source is the Ultimate Solar Sales Stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <strong className="text-slate-200 block mb-1">Zero Per-Seat Fees</strong>
                Canvassers, appointment setters, and seasonal closers can log in without paying $100+/mo per rep.
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <strong className="text-slate-200 block mb-1">Fast Mobile Sizing on Roofs</strong>
                Vercel’s global Edge CDN serves sub-100ms pages to reps doing live site surveys on customer driveways.
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <strong className="text-slate-200 block mb-1">Your Own Data & Rules</strong>
                Never get locked into proprietary algorithms. Customize utility tariffs, NEM 3.0 export credits, and commission redlines on your terms.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 100% Free Stack Breakdown */}
      {activeTab === 'stack' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VERCEL_BLUEPRINT_CODE.stackOverview.map((item, index) => (
              <div
                key={index}
                className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500 uppercase font-mono tracking-wider text-[10px]">
                      {item.layer}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-[10px]">
                      {item.cost}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-100">{item.tech}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.why}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production verified & scalable</span>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Comparison vs Commercial Solar Software */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-sm text-slate-200 mb-3">
              Annual Software Cost Comparison (5-Person Solar Sales Team)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono text-xs">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Salesforce + AppExchange</span>
                <span className="text-xl font-bold text-rose-400 my-1 block">$11,400 / yr</span>
                <span className="text-[10px] text-slate-500">$150/user + $40 plugin fees</span>
              </div>
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Aurora Solar + JobNimbus</span>
                <span className="text-xl font-bold text-amber-400 my-1 block">$18,000 / yr</span>
                <span className="text-[10px] text-slate-500">$300/rep/mo + design tokens</span>
              </div>
              <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/40">
                <span className="text-emerald-400 block text-[11px] font-bold">Helios Open-Source on Vercel</span>
                <span className="text-xl font-extrabold text-emerald-400 my-1 block">$0.00 / yr</span>
                <span className="text-[10px] text-emerald-300 font-semibold">100% Free Tiers Forever</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SQL Schema */}
      {activeTab === 'sql' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Supabase / PostgreSQL DDL Migration Script
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute in your Supabase SQL Editor. Includes tables for leads, proposals, site surveys, and sales reps.
              </p>
            </div>
            <button
              onClick={() => handleCopy('sql', VERCEL_BLUEPRINT_CODE.postgresSchemaSql)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-500/30 transition-colors"
            >
              {copiedKey === 'sql' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Schema</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-emerald-400 font-mono overflow-x-auto max-h-[500px] leading-relaxed">
            {VERCEL_BLUEPRINT_CODE.postgresSchemaSql}
          </pre>
        </div>
      )}

      {/* Tab 4: Config Files */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* vercel.json */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-200">vercel.json</h4>
                <p className="text-[11px] text-slate-400">Production SPA routing and security headers</p>
              </div>
              <button
                onClick={() => handleCopy('vercel-json', VERCEL_BLUEPRINT_CODE.vercelJson)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
              >
                {copiedKey === 'vercel-json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-sky-300 font-mono overflow-x-auto">
              {VERCEL_BLUEPRINT_CODE.vercelJson}
            </pre>
          </div>

          {/* .env.example */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-200">.env.production</h4>
                <p className="text-[11px] text-slate-400">Environment variables for Vercel Dashboard</p>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    'env',
                    `# Connect to free Supabase Postgres\nVITE_SUPABASE_URL="https://your-project.supabase.co"\nVITE_SUPABASE_ANON_KEY="eyJhbGciOi..."\n\n# Solar Team Branding\nVITE_COMPANY_NAME="Solar Crest Energy"\nVITE_DEFAULT_ITC_RATE="0.30"`
                  )
                }
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
              >
                {copiedKey === 'env' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-amber-300 font-mono overflow-x-auto">
{`# Connect to free Supabase Postgres
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."

# Solar Team Branding
VITE_COMPANY_NAME="Solar Crest Energy"
VITE_DEFAULT_ITC_RATE="0.30"
VITE_DEFAULT_REDLINE_WATT="2.85"`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
