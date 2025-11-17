import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Background } from '../types';

type SelectedBackground = {
  type: 'default' | 'predefined' | 'custom' | 'solid';
  value: string | null;
};

interface BackgroundSelectorProps {
    backgrounds: Background[];
    selectedBackground: SelectedBackground;
    onSelect: (type: SelectedBackground['type'], value: string | null) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ backgrounds, selectedBackground, onSelect }) => {
  const [customBgPreview, setCustomBgPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedBackground.type === 'custom' && selectedBackground.value) {
      setCustomBgPreview(selectedBackground.value);
    } else {
      setCustomBgPreview(null);
    }
  }, [selectedBackground]);

  const handleFileChange = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, etc.).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File is too large. Please upload an image under 5MB.');
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onSelect('custom', base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onSelect]);

  const onFileChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files);
    if(event.target) event.target.value = '';
  };
  
  const handleCustomUploadClick = () => fileInputRef.current?.click();
  
  return (
    <div className="space-y-2">
        <h4 className="font-semibold text-black">2. Choose a Background</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div onClick={() => onSelect('default', null)} className={`relative aspect-square rounded-md cursor-pointer border-2 flex items-center justify-center text-center p-2 transition-all duration-200 transform hover:scale-105 ${selectedBackground.type === 'default' ? 'border-primary ring-2 ring-primary' : 'border-gray-300 hover:border-primary'}`}>
                <p className="text-sm font-medium text-black">Neutral</p>
            </div>

            {backgrounds.map(bg => (
                <div key={bg.id} onClick={() => onSelect('predefined', bg.imageUrl)} className={`relative aspect-square rounded-md cursor-pointer border-2 transition-all duration-200 transform hover:scale-105 ${selectedBackground.type === 'predefined' && selectedBackground.value === bg.imageUrl ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-primary'}`}>
                    <img src={bg.imageUrl} alt={bg.name} className="w-full h-full object-cover rounded" />
                </div>
            ))}
            
             <div onClick={handleCustomUploadClick} className={`relative aspect-square rounded-md cursor-pointer border-2 flex items-center justify-center text-center p-2 bg-gray-100 transition-all duration-200 transform hover:scale-105 ${selectedBackground.type === 'custom' ? 'border-primary ring-2 ring-primary' : 'border-dashed border-gray-300 hover:border-primary'}`} role="button" tabIndex={0}>
                <input type="file" ref={fileInputRef} onChange={onFileChangeEvent} accept="image/*" className="hidden" />
                {customBgPreview && selectedBackground.type === 'custom' ? (
                     <img src={customBgPreview} alt="Custom background preview" className="w-full h-full object-cover rounded" />
                ) : (
                    <div className="text-sm font-medium text-black flex flex-col items-center">
                        <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        Upload
                    </div>
                )}
            </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default BackgroundSelector;