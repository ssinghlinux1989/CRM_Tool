import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Calculator, 
  Users, 
  Plus, 
  Download, 
  Search,
  Clock,
  Hammer,
  Palette,
  FileSpreadsheet,
  MapPin,
  Shield,
  LayoutDashboard,
  Mail,
  IndianRupee,
  LogIn,
  LogOut,
  UserCheck,
  MoreHorizontal,
  ChevronDown,
  Building2,
  Share2
} from 'lucide-react';
import { SolarLead, BrandingConfig, FollowUpItem } from '../types/solar';
import { BharatSolarShaktiLogo } from './BharatSolarShaktiLogo';
import { formatInr } from '../utils/currency';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface HeaderProps {
  activeTab: 'dashboard' | 'pipeline' | 'finances' | 'calculator' | 'reps' | 'blueprint' | 'followups' | 'projects';
  setActiveTab: (tab: 'dashboard' | 'pipeline' | 'finances' | 'calculator' | 'reps' | 'blueprint' | 'followups' | 'projects') => void;
  leads: SolarLead[];
  branding: BrandingConfig;
  followUps: FollowUpItem[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  availableCities: string[];
  onOpenNewLead: () => void;
  onOpenBranding: () => void;
  onOpenImportCsv: () => void;
  onExportCsv: () => void;
  onOpenShareApp?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  leads,
  branding,
  followUps,
  selectedCity,
  setSelectedCity,
  selectedRole,
  setSelectedRole,
  availableCities,
  onOpenNewLead,
  onOpenBranding,
  onOpenImportCsv,
  onExportCsv,
  onOpenShareApp,
  searchQuery,
  setSearchQuery,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isUtilitiesMenuOpen, setIsUtilitiesMenuOpen] = useState(false);

  const totalKw = leads.reduce((acc, lead) => acc + (lead.systemSizeKw || 0), 0).toFixed(1);
  const totalPipelineValue = leads.reduce((acc, lead) => acc + (lead.financials?.grossContractValue || lead.estimatedValue || 0), 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingFollowups = followUps.filter((f) => f.status === 'pending');
  const overdueFollowupsCount = pendingFollowups.filter((f) => f.scheduledDate <= todayStr).length;

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email === 'saurabh.france@gmail.com') {
        setSelectedRole('Admin');
      }
    });
    return () => unsubscribe();
  }, [setSelectedRole]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn('Firebase popup sign-in:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const isSecondaryActive = ['projects', 'followups', 'reps'].includes(activeTab);

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
      {/* 3-ZONE TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* ZONE 1: BRAND IDENTITY (Refined, clear BSSPL Management Tool branding) */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={onOpenBranding}
            className="flex items-center gap-3 cursor-pointer group"
            title={`${branding.toolName || 'BSSPL Management Tool'} · ${branding.companyName}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-emerald-500/10 border border-amber-500/30 flex items-center justify-center p-1 group-hover:border-amber-400 transition-colors shrink-0">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.companyName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <BharatSolarShaktiLogo size="sm" showText={false} />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight leading-none group-hover:text-amber-300 transition-colors">
                  {branding.toolName || 'BSSPL Management Tool'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  ₹ INR
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-none mt-1 flex items-center gap-1.5">
                <span className="truncate max-w-[170px] sm:max-w-[220px] font-medium text-slate-300">{branding.companyName}</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400/90 font-medium hidden sm:inline">Lucknow, UP</span>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE 2: PRIMARY NAVIGATION (Clean segmented pill-free tabs) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 text-xs font-medium">
          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {/* 2. 16-Stage Workflow */}
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'pipeline'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>16-Stage Workflow</span>
            <span className="text-[10px] font-mono bg-slate-900 px-1.5 py-0.2 rounded text-slate-400">
              {leads.length}
            </span>
          </button>

          {/* 3. Finances & P&L */}
          <button
            onClick={() => setActiveTab('finances')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'finances'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Finances</span>
          </button>

          {/* 4. Proposals & Solar Sizing */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Proposals</span>
          </button>

          {/* Secondary Views Dropdown ("More") */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                isSecondaryActive
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Operations</span>
              {overdueFollowupsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isMoreMenuOpen && (
              <div 
                className="absolute left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs"
                onClick={() => setIsMoreMenuOpen(false)}
              >
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-800 ${
                    activeTab === 'projects' ? 'text-amber-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                  }`}
                >
                  <Hammer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Projects Execution</span>
                </button>
                <button
                  onClick={() => setActiveTab('followups')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 ${
                    activeTab === 'followups' ? 'text-amber-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Follow-ups Queue</span>
                  </span>
                  {overdueFollowupsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-mono">
                      {overdueFollowupsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reps')}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-800 ${
                    activeTab === 'reps' ? 'text-amber-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Team Leaderboard</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* ZONE 3: CONTEXT, UTILITIES & CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Territory Selector */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-xl px-2.5 py-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {availableCities.map((city) => (
                <option key={city} value={city} className="bg-slate-900 text-slate-100">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Share & Test App Button */}
          {onOpenShareApp && (
            <button
              onClick={onOpenShareApp}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
              title="Test & Share Live App Link with Team"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Share & Test App</span>
            </button>
          )}

          {/* Quick Tools Menu (Clean unified dropdown instead of 3 separate buttons) */}
          <div className="relative">
            <button
              onClick={() => setIsUtilitiesMenuOpen(!isUtilitiesMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800 transition-colors"
              title="Data & Settings"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isUtilitiesMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs"
                onClick={() => setIsUtilitiesMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 uppercase border-b border-slate-800">
                  Data & Settings
                </div>
                {onOpenShareApp && (
                  <button
                    onClick={onOpenShareApp}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-amber-300 hover:bg-slate-800 font-medium"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Share & Test App Link</span>
                  </button>
                )}
                <button
                  onClick={onOpenBranding}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-300 hover:bg-slate-800"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Company Profile & Branding</span>
                </button>
                <button
                  onClick={onOpenImportCsv}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-300 hover:bg-slate-800"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import Leads CSV</span>
                </button>
                <button
                  onClick={onExportCsv}
                  className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Projects CSV</span>
                </button>

                <div className="border-t border-slate-800 my-1 pt-1">
                  <div className="px-3 py-1 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Role:</span>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="bg-slate-950 text-slate-200 text-[11px] rounded px-1.5 py-0.5 border border-slate-700"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Sales Closer">Sales Closer</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Sign In / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded-xl px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="truncate max-w-[100px] sm:max-w-[140px] font-mono text-[11px]">
                {currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="text-slate-500 hover:text-rose-400 text-[10px] ml-1"
                title="Sign out"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-800 font-medium"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Login</span>
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Lead</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-slate-800/80 px-4 py-2 flex items-center justify-between overflow-x-auto text-xs gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            activeTab === 'dashboard' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            activeTab === 'pipeline' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Workflow ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('finances')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            activeTab === 'finances' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Finances
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            activeTab === 'calculator' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Proposals
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            activeTab === 'projects' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Projects
        </button>
      </div>
    </header>
  );
};
