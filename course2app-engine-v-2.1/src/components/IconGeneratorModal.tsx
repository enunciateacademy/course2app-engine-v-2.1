import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Download, Check } from 'lucide-react';

interface IconGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  instituteName: string;
  primaryColor: string;
  onApplyIcon: (dataUrl: string, type: 'launcher' | 'logo') => void;
  targetType: 'launcher' | 'logo';
}

export const IconGeneratorModal: React.FC<IconGeneratorModalProps> = ({
  isOpen,
  onClose,
  instituteName,
  primaryColor,
  onApplyIcon,
  targetType
}) => {
  const [initials, setInitials] = useState('');
  const [bgColor, setBgColor] = useState(primaryColor || '#1e3a8a');
  const [textColor, setTextColor] = useState('#ffffff');
  const [style, setStyle] = useState<'solid' | 'gradient' | 'minimal' | 'badge'>('gradient');
  const [shape, setShape] = useState<'squircle' | 'circle' | 'square'>('squircle');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (instituteName) {
      const words = instituteName.trim().split(/\s+/);
      if (words.length >= 2) {
        setInitials((words[0][0] + words[1][0]).toUpperCase());
      } else if (words.length === 1 && words[0].length > 0) {
        setInitials(words[0].substring(0, 2).toUpperCase());
      } else {
        setInitials('EA');
      }
    } else {
      setInitials('EA');
    }
  }, [instituteName]);

  useEffect(() => {
    setBgColor(primaryColor || '#1e3a8a');
  }, [primaryColor]);

  // Draw icon on 1024x1024 canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Background
    if (style === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, bgColor);
      grad.addColorStop(1, adjustColor(bgColor, -30));
      ctx.fillStyle = grad;
    } else if (style === 'minimal') {
      ctx.fillStyle = '#ffffff';
    } else {
      ctx.fillStyle = bgColor;
    }

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'squircle') {
      const radius = 220;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    // Border / Outline if minimal
    if (style === 'minimal') {
      ctx.lineWidth = 40;
      ctx.strokeStyle = bgColor;
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 20, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape === 'squircle') {
        ctx.beginPath();
        ctx.roundRect(20, 20, size - 40, size - 40, 200);
        ctx.stroke();
      }
    }

    // Decorative inner ring for badge
    if (style === 'badge') {
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 80, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Initials Text
    ctx.fillStyle = style === 'minimal' ? bgColor : textColor;
    ctx.font = 'bold 420px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials || 'A', size / 2, size / 2 + 20);

    // Small subtle graduation cap or star indicator at top
    ctx.fillStyle = style === 'minimal' ? bgColor : 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 70px sans-serif';
    ctx.fillText('★ ★ ★', size / 2, size / 2 - 280);
  }, [initials, bgColor, textColor, style, shape]);

  function adjustColor(color: string, amount: number) {
    let usePound = false;
    if (color[0] === '#') {
      color = color.slice(1);
      usePound = true;
    }
    if (color.length === 3) {
      color = color.split('').map((c) => c + c).join('');
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    let b = ((num >> 8) & 0x00ff) + amount;
    let g = (num & 0x0000ff) + amount;
    r = Math.max(Math.min(255, r), 0);
    b = Math.max(Math.min(255, b), 0);
    g = Math.max(Math.min(255, g), 0);
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }

  if (!isOpen) return null;

  const handleApply = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onApplyIcon(dataUrl, targetType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {targetType === 'launcher' ? 'Generate 1024×1024 App Icon' : 'Generate Institute Logo'}
              </h3>
              <p className="text-xs text-slate-500">Create an instant high-resolution Android launcher asset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Canvas Preview */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 p-4 border border-slate-100">
            <canvas
              ref={canvasRef}
              className="h-44 w-44 rounded-2xl shadow-md transition-transform"
            />
            <span className="mt-3 text-xs font-semibold text-slate-500">1024 × 1024 HD PNG Preview</span>
          </div>

          {/* Controls */}
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Icon Initials (1-3 Letters)</label>
              <input
                type="text"
                maxLength={3}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-bold tracking-widest text-slate-800 uppercase focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Background Color</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-mono text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Visual Style</label>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {(['gradient', 'solid', 'minimal', 'badge'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStyle(st)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                      style === st
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Preview Shape</label>
              <div className="mt-1.5 flex gap-2">
                {(['squircle', 'circle', 'square'] as const).map((sh) => (
                  <button
                    key={sh}
                    type="button"
                    onClick={() => setShape(sh)}
                    className={`flex-1 rounded-lg border px-2 py-1 text-xs font-medium capitalize ${
                      shape === sh
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95"
          >
            <Check className="h-4 w-4" />
            Use This Icon
          </button>
        </div>
      </div>
    </div>
  );
};
