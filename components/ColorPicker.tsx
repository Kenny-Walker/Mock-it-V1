import React, { useRef } from 'react';

// --- Color Manipulation Utilities ---

export const parseColor = (color: string): { r: number; g: number; b: number; a: number } => {
    if (color.startsWith('#')) {
        let hex = color.slice(1);
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        if (hex.length === 4) hex = hex.split('').map(c => c + c).join('');
        if (hex.length === 6) hex += 'FF';
        if (hex.length === 8) {
             return {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16),
                a: parseInt(hex.slice(6, 8), 16) / 255,
            };
        }
    } else if (color.startsWith('rgb')) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: match[4] ? parseFloat(match[4]) : 1,
            };
        }
    }
    return { r: 255, g: 255, b: 255, a: 1 }; // Default to white
};

export const rgbaToHex = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }): string => {
    const toHex = (c: number) => ('0' + Math.round(c).toString(16)).slice(-2);
    const alphaHex = a === 1 ? '' : toHex(a * 255);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`.toUpperCase();
};

const rgbaToHsl = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }): { h: number; s: number; l: number; a: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100, a };
};

const hslToRgba = ({ h, s, l, a }: { h: number; s: number; l: number; a: number }): { r: number; g: number; b: number; a: number } => {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else if (h >= 300 && h < 360) { [r, g, b] = [c, 0, x]; }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255), a };
};

export const rgbaToCss = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }): string => `rgba(${r}, ${g}, ${b}, ${a})`;

// --- Color Picker Component ---

const ColorPicker: React.FC<{ value: string; onChange: (color: string) => void; }> = ({ value, onChange }) => {
    const rgba = parseColor(value);
    const hsl = rgbaToHsl(rgba);

    const satValRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);
    const alphaRef = useRef<HTMLDivElement>(null);

    const handleHslChange = (newHsl: Partial<{ h: number; s: number; l: number; a: number }>) => {
        const mergedHsl = { ...hsl, ...newHsl };
        onChange(rgbaToCss(hslToRgba(mergedHsl)));
    };

    const handleRgbChange = (newRgb: Partial<{ r: number; g: number; b: number; a: number }>) => {
        const mergedRgb = { ...rgba, ...newRgb };
        onChange(rgbaToCss(mergedRgb));
    };
    
    const handleHexChange = (hex: string) => {
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hex)) {
            onChange(rgbaToCss({ ...parseColor(hex), a: hsl.a }));
        }
    };

    const createSliderHandler = (
        ref: React.RefObject<HTMLDivElement>, 
        callback: (value: number) => void,
        orientation: 'horizontal' | 'vertical' = 'horizontal'
    ) => (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.buttons !== 1 || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        let val = 0;
        if (orientation === 'horizontal') {
            val = (e.clientX - rect.left) / rect.width;
        } else {
            val = (e.clientY - rect.top) / rect.height;
        }
        callback(Math.max(0, Math.min(1, val)));
    };
    
    // FIX: The original code had two handlers for the saturation/value picker.
    // `handleSatValMove` was incorrect and caused a type error.
    // `handleSatValMove2` was correct but unused under that name.
    // This combines them into a single, correct handler.
    const handleSatValMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.buttons !== 1 || !satValRef.current) return;
        const rect = satValRef.current.getBoundingClientRect();
        const s = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const l = Math.max(0, Math.min(100, (1-(e.clientY - rect.top) / rect.height) * 100));
        handleHslChange({ s, l });
    };

    const handleHueMove = createSliderHandler(hueRef, val => handleHslChange({ h: val * 360 }));
    const handleAlphaMove = createSliderHandler(alphaRef, val => handleHslChange({ a: val }));

    return (
        <div className="space-y-3 p-2 bg-gray-100 rounded-md border mt-2">
            <div
                ref={satValRef}
                className="relative w-full h-32 rounded-md cursor-pointer"
                style={{ backgroundColor: `hsl(${hsl.h}, 100%, 50%)` }}
                onMouseDown={handleSatValMove}
                onMouseMove={handleSatValMove}
            >
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, white, transparent)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, black, transparent)' }} />
                <div
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${hsl.s}%`, top: `${100 - hsl.l}%` }}
                />
            </div>

            <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full border border-black/20" style={{ backgroundColor: rgbaToCss(rgba) }}></div>
                <div className="flex-grow space-y-2">
                    <div ref={hueRef} onMouseDown={handleHueMove} onMouseMove={handleHueMove} className="w-full h-3 rounded-lg cursor-pointer relative" style={{background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'}}>
                         <div className="absolute w-4 h-4 -top-[2px] rounded-full border-2 border-white shadow-md transform -translate-x-1/2" style={{ left: `${(hsl.h / 360) * 100}%` }}/>
                    </div>
                     <div ref={alphaRef} onMouseDown={handleAlphaMove} onMouseMove={handleAlphaMove} className="w-full h-3 rounded-lg cursor-pointer relative bg-gray-200" style={{background: `linear-gradient(to right, transparent, hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%))`}}>
                         <div className="absolute w-4 h-4 -top-[2px] rounded-full border-2 border-white shadow-md transform -translate-x-1/2" style={{ left: `${hsl.a * 100}%` }}/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                    <label className="font-medium text-gray-600">HEX</label>
                    <input value={rgbaToHex(rgba).slice(0, 7)} onChange={e => handleHexChange(e.target.value)} className="w-full p-1 border rounded" />
                </div>
                <div className="grid grid-cols-3 gap-1 col-span-2">
                    <InputField label="R" value={rgba.r} onChange={v => handleRgbChange({ r: v })} max={255} />
                    <InputField label="G" value={rgba.g} onChange={v => handleRgbChange({ g: v })} max={255} />
                    <InputField label="B" value={rgba.b} onChange={v => handleRgbChange({ b: v })} max={255} />
                    <InputField label="H" value={Math.round(hsl.h)} onChange={v => handleHslChange({ h: v })} max={360} />
                    <InputField label="S" value={Math.round(hsl.s)} onChange={v => handleHslChange({ s: v })} max={100} />
                    <InputField label="L" value={Math.round(hsl.l)} onChange={v => handleHslChange({ l: v })} max={100} />
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string; value: number; onChange: (v: number) => void; max: number }> = ({ label, value, onChange, max }) => (
    <div>
        <label className="font-medium text-gray-600">{label}</label>
        <input
            type="number"
            value={value}
            onChange={e => onChange(Math.max(0, Math.min(max, parseInt(e.target.value) || 0)))}
            className="w-full p-1 border rounded"
        />
    </div>
);

export default ColorPicker;