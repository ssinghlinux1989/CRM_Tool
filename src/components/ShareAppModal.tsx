import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Laptop, 
  Share2, 
  Users, 
  ShieldCheck,
  DownloadCloud
} from 'lucide-react';
import { BharatSolarShaktiLogo } from './BharatSolarShaktiLogo';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName?: string;
  companyName?: string;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({
  isOpen,
  onClose,
  toolName = 'BSSPL Management Tool',
  companyName = 'Bharat Solar Shakti Pvt'
}) => {
  if (!isOpen) return null;

  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const sharedPreviewUrl = 'https://ais-pre-n7nyjzlksglu4defw4epg3-945268714908.asia-southeast1.run.app';
  const devAppUrl = 'https://ais-dev-n7nyjzlksglu4defw4epg3-945268714908.asia-southeast1.run.app';

  const copyToClipboard = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(label);
      setTimeout(() => setCopiedLink(null), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                <span>Test & Share {toolName}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  100% Free
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {companyName} · Live Cloud Web Application
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">

          {/* Clarification Alert: Web App vs File Download */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-amber-300 text-xs sm:text-sm">
                No File Download Required
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                This is a secure <strong>Cloud Web Application</strong> running directly on Google Cloud. You do not need to download an installer or APK file. Simply <strong>open the link in any web browser</strong> (Google Chrome, Safari, Edge) on your smartphone or computer.
              </p>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            <div className="font-bold text-slate-200 text-xs uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Live Test Links</span>
              <span className="text-slate-500 font-normal">Free for internal team access</span>
            </div>

            {/* Shared Preview URL */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Shared Team Preview URL
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Recommended for team</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={sharedPreviewUrl}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-300 select-all focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(sharedPreviewUrl, 'preview')}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  {copiedLink === 'preview' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <a
                  href={sharedPreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Direct Development URL */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300 text-xs">
                  Direct Live App URL
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Direct instance</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={devAppUrl}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-400 select-all focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(devAppUrl, 'dev')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 font-medium transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {copiedLink === 'dev' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={devAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Install Guide for Phones */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="font-bold text-slate-200 text-xs uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>How to Install on Mobile (Like an App icon)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1">
                <div className="font-semibold text-slate-200 text-xs text-amber-300">
                  Android (Chrome)
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400 leading-relaxed">
                  <li>Open the copied link in Chrome.</li>
                  <li>Tap the <strong>three dots (⋮)</strong> at top right.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>The BSSPL icon will appear on your phone!</li>
                </ol>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1">
                <div className="font-semibold text-slate-200 text-xs text-amber-300">
                  iPhone (Safari)
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400 leading-relaxed">
                  <li>Open the copied link in Safari.</li>
                  <li>Tap the <strong>Share</strong> button (square with arrow ↑).</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>Add</strong> at top right.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Zero Cost Confirmation */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-[11px] text-slate-300">
              <span className="font-bold text-slate-100">Zero Cost Internal Use:</span> You and your team members can use this link with unlimited internal access. There are no per-seat license fees.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
