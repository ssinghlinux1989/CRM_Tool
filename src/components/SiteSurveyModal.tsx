import React, { useState, useRef } from 'react';
import { SolarLead, SiteSurveyData, RoofType, SurveyPhoto } from '../types/solar';
import { checkNec120Rule } from '../utils/solarMath';
import { 
  X, 
  Save, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Home, 
  Camera, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';

interface SiteSurveyModalProps {
  lead: SolarLead | null;
  onClose: () => void;
  onSaveSurvey: (leadId: string, survey: SiteSurveyData) => void;
}

export const SiteSurveyModal: React.FC<SiteSurveyModalProps> = ({ lead, onClose, onSaveSurvey }) => {
  if (!lead) return null;

  const initialSurvey: SiteSurveyData = lead.survey || {
    roofType: 'rcc_flat_concrete',
    roofAgeYears: 5,
    roofPitchDegrees: 22,
    roofAzimuthDegrees: 180,
    roofShadingPercent: 5,
    roofAreaSqFt: 650,
    mainPanelAmpRating: 200,
    busbarAmpRating: 200,
    mpuRequired: false,
    structuralApproved: true,
    notes: 'Standard site audit.',
    inspectorName: 'Carlos M.',
    surveyDate: new Date().toISOString().split('T')[0],
    photos: []
  };

  const [roofType, setRoofType] = useState<RoofType>(initialSurvey.roofType);
  const [roofAge, setRoofAge] = useState<number>(initialSurvey.roofAgeYears);
  const [roofPitch, setRoofPitch] = useState<number>(initialSurvey.roofPitchDegrees);
  const [roofAzimuth, setRoofAzimuth] = useState<number>(initialSurvey.roofAzimuthDegrees);
  const [shadingPercent, setShadingPercent] = useState<number>(initialSurvey.roofShadingPercent);
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number>(initialSurvey.roofAreaSqFt || 650);
  const [mainPanelAmps, setMainPanelAmps] = useState<number>(initialSurvey.mainPanelAmpRating);
  const [busbarAmps, setBusbarAmps] = useState<number>(initialSurvey.busbarAmpRating);
  const [structuralApproved, setStructuralApproved] = useState<boolean>(initialSurvey.structuralApproved);
  const [notes, setNotes] = useState<string>(initialSurvey.notes);
  const [inspectorName, setInspectorName] = useState<string>(initialSurvey.inspectorName || 'Field Tech');
  const [photos, setPhotos] = useState<SurveyPhoto[]>(initialSurvey.photos || []);
  const [activePhotoCategory, setActivePhotoCategory] = useState<SurveyPhoto['category']>('Roof Plane');
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live NEC 120% rule evaluation
  const necCheck = checkNec120Rule(mainPanelAmps, busbarAmps, lead.systemSizeKw);

  // Client-Side Canvas Downsampling to compress photo to ~150KB
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200; // max width or height
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to WebP or JPEG at 0.78 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

        const newPhoto: SurveyPhoto = {
          id: `photo-${Date.now()}`,
          title: `${activePhotoCategory} - ${file.name.slice(0, 15)}`,
          category: activePhotoCategory,
          dataUrl: compressedDataUrl,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fileSizeKb: sizeKb,
        };

        setPhotos((prev) => [newPhoto, ...prev]);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleSave = () => {
    const updatedSurvey: SiteSurveyData = {
      roofType,
      roofAgeYears: roofAge,
      roofPitchDegrees: roofPitch,
      roofAzimuthDegrees: roofAzimuth,
      roofShadingPercent: shadingPercent,
      roofAreaSqFt,
      mainPanelAmpRating: mainPanelAmps,
      busbarAmpRating: busbarAmps,
      mpuRequired: necCheck.mpuRequired,
      structuralApproved,
      notes,
      inspectorName,
      surveyDate: new Date().toISOString().split('T')[0],
      photos,
    };

    onSaveSurvey(lead.id, updatedSurvey);
    onClose();
  };

  const estimatedPanelsFit = Math.floor(roofAreaSqFt / 18.5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Site Survey Audit & Roof Measurements
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {lead.fullName} · {lead.address}, {lead.city} · {lead.systemSizeKw}kW
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

        {/* Modal Form */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Section 1: Electrical Service Panel & NEC 120% Rule */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Electrical Panel & NEC 120% Rule Audit
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">NEC 705.12(B)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Main Breaker Rating (Amps)</label>
                <select
                  value={mainPanelAmps}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMainPanelAmps(val);
                    if (busbarAmps < val) setBusbarAmps(val);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
                >
                  <option value={100}>100 Amp (Older Service)</option>
                  <option value={125}>125 Amp</option>
                  <option value={150}>150 Amp</option>
                  <option value={200}>200 Amp (Standard Modern)</option>
                  <option value={400}>400 Amp (Dual 200A)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Panel Busbar Rating (Amps)</label>
                <select
                  value={busbarAmps}
                  onChange={(e) => setBusbarAmps(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
                >
                  <option value={100}>100 Amp Bus</option>
                  <option value={125}>125 Amp Bus</option>
                  <option value={200}>200 Amp Bus</option>
                  <option value={225}>225 Amp Bus (Solar-Ready)</option>
                  <option value={400}>400 Amp Bus</option>
                </select>
              </div>
            </div>

            {/* NEC 120% Calculation Feedback Box */}
            <div className={`p-3 rounded-xl border font-mono text-xs ${
              necCheck.mpuRequired 
                ? 'bg-rose-950/30 border-rose-800/40 text-rose-300' 
                : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {necCheck.mpuRequired ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>
                  {necCheck.mpuRequired ? 'Main Panel Upgrade (MPU) Required!' : 'Panel Capacity Approved (Passes 120% Rule)'}
                </span>
              </div>
              <div className="text-[11px] leading-relaxed text-slate-300">
                {necCheck.recommendation}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                <span>Allowed Backfeed: {necCheck.allowedBackfeedAmps}A</span>
                <span>System Required: {necCheck.solarBackfeedAmpsRequired}A (for {lead.systemSizeKw}kW)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Roof Measurements & Area Fit */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-sky-400" />
                Roof Geometry & Usable Area
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">
                Fits up to {estimatedPanelsFit} panels (Need: {lead.specs.panelCount})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Roof Material</label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value as RoofType)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
                >
                  <option value="rcc_flat_concrete">RCC Flat Concrete Terrace (Parapet)</option>
                  <option value="standing_seam_metal">GI / Tin Metal Shed / Trapezoidal</option>
                  <option value="elevated_superstructure">Elevated GI Superstructure (Walkable)</option>
                  <option value="tin_shed">Industrial Tin Shed</option>
                  <option value="tiled_roof">Clay Tile / Pitched Roof</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Usable Area (sq ft)</label>
                <input
                  type="number"
                  min="200"
                  max="5000"
                  value={roofAreaSqFt}
                  onChange={(e) => setRoofAreaSqFt(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Pitch (Degrees)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={roofPitch}
                  onChange={(e) => setRoofPitch(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Azimuth (° South=180)</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={roofAzimuth}
                  onChange={(e) => setRoofAzimuth(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Photo Uploads (Roof, Electrical, Meter) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  Site Survey Photos & Documentation
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Client-side downsampled to ~150KB (Fits thousands within free 1 GB tier)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={activePhotoCategory}
                  onChange={(e) => setActivePhotoCategory(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                >
                  <option value="Roof Plane">Roof Plane</option>
                  <option value="Main Electrical Panel">Main Panel</option>
                  <option value="Utility Meter">Utility Meter</option>
                  <option value="Inverter / Battery Location">Inverter / ESS</option>
                  <option value="Attic / Rafters">Attic Rafters</option>
                </select>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            {photos.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-600 border border-dashed border-slate-800 rounded-xl">
                No site photos uploaded yet. Snap photos of the roof planes, electric panel busbar, and utility meter.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative bg-slate-900 rounded-xl border border-slate-800 overflow-hidden"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={photo.title}
                      className="w-full h-24 object-cover cursor-pointer"
                      onClick={() => setEnlargedPhoto(photo.dataUrl)}
                    />
                    <div className="p-2 space-y-0.5 text-[10px]">
                      <div className="font-semibold text-slate-300 truncate">{photo.category}</div>
                      <div className="text-slate-500 font-mono flex justify-between">
                        <span>{photo.uploadedAt}</span>
                        <span>{photo.fileSizeKb} KB</span>
                      </div>
                    </div>

                    {/* Delete action overlay */}
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-slate-950/80 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Notes */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-400">Engineering & Surveyor Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl shadow-md shadow-sky-400/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Survey & Photos</span>
          </button>
        </div>
      </div>

      {/* Enlarged Photo Modal */}
      {enlargedPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setEnlargedPhoto(null)}
        >
          <img
            src={enlargedPhoto}
            alt="Enlarged Survey Photo"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
