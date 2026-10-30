import React, { useState, useRef } from 'react';
import { BrandingConfig } from '../types/solar';
import { BharatSolarShaktiLogo } from './BharatSolarShaktiLogo';
import { 
  X, 
  Upload, 
  Sun, 
  Check, 
  Trash2, 
  Palette, 
  Building2, 
  FileCheck, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface BrandingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingConfig;
  onSaveBranding: (branding: BrandingConfig) => void;
}

export const BrandingSettingsModal: React.FC<BrandingSettingsModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSaveBranding,
}) => {
  if (!isOpen) return null;

  const [toolName, setToolName] = useState(branding.toolName || 'BSSPL Management Tool');
  const [companyName, setCompanyName] = useState(branding.companyName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl || '');
  const [accentColor, setAccentColor] = useState<BrandingConfig['accentColor']>(branding.accentColor);
  const [phone, setPhone] = useState(branding.phone);
  const [email, setEmail] = useState(branding.email);
  const [licenseNumber, setLicenseNumber] = useState(branding.licenseNumber);
  const [address, setAddress] = useState(branding.address);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('png') && !file.type.includes('svg') && !file.type.includes('jpeg') && !file.type.includes('webp')) {
        alert('Please upload a PNG, SVG, or WEBP image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBranding({
      toolName: toolName.trim() || 'BSSPL Management Tool',
      companyName: companyName.trim() || 'Bharat Solar Shakti Pvt',
      tagline: tagline.trim(),
      logoUrl,
      accentColor,
      phone: phone.trim(),
      email: email.trim(),
      licenseNumber: licenseNumber.trim(),
      address: address.trim(),
      currency: '₹',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Company Branding & Custom Logo
              </h3>
              <p className="text-[11px] text-slate-400">
                Brand identity reflected across proposals, reports, and CRM interface
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Logo Upload Section */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <label className="text-slate-300 font-medium block">
              Company Logo (PNG or SVG with Transparent Background)
            </label>

            <div className="flex items-center gap-4">
              {/* Preview Box */}
              <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 relative p-1.5">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company Logo Preview"
                    className="max-w-full max-h-full object-contain p-1"
                  />
                ) : (
                  <BharatSolarShaktiLogo size="sm" showText={false} />
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-2 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-medium transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>Upload Logo File</span>
                  </button>

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove Logo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">
                  Recommended size: 250×60px transparent PNG or SVG vector.
                </p>
              </div>
            </div>
          </div>

          {/* Tool & Company Details */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">CRM / Tool Name *</label>
            <input
              type="text"
              required
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. BSSPL Management Tool"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-slate-500">Official management software name shown in top navigation and browser header</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Registered Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Bharat Solar Shakti Pvt"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">DISCOM / UPNEDA License or GSTIN</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. UPNEDA Empanelled / GSTIN: 09AABCB8821F1ZX"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-300 font-medium">Tagline / Motto</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Leading Rooftop Solar & Renewable Energy EPC · PM Surya Ghar Partner"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98390 12345"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support@bharatsolarshakti.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
              />
            </div>
          </div>

          {/* Color Accent Picker */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-slate-300 font-medium block">Interface & Proposal Accent Color</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'amber', name: 'Solar Amber', bg: 'bg-amber-500', border: 'border-amber-400' },
                { id: 'sky', name: 'Clean Sky', bg: 'bg-sky-500', border: 'border-sky-400' },
                { id: 'emerald', name: 'Pure Green', bg: 'bg-emerald-500', border: 'border-emerald-400' },
                { id: 'slate', name: 'High Slate', bg: 'bg-slate-400', border: 'border-slate-300' },
              ].map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setAccentColor(color.id as any)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                    accentColor === color.id
                      ? 'bg-slate-800 border-amber-400/80 shadow-xs'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full ${color.bg}`} />
                  <span className="text-[10px] text-slate-300 font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md shadow-amber-400/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply Branding</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
