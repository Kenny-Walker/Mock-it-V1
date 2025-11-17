import React, { useState, useCallback, useRef } from 'react';

interface LogoUploaderProps {
  onLogoUpload: (file: File, base64: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onLogoUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, etc.).');
        setPreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File is too large. Please upload an image under 5MB.');
        setPreview(null);
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onLogoUpload(file, base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onLogoUpload]);

  const onFileChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files);
  }

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files);
  }, [handleFileChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary bg-gray-50 transition-all duration-200 transform hover:scale-[1.01]"
        aria-label="Logo upload area"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChangeEvent}
          accept="image/*"
          className="hidden"
          aria-hidden="true"
        />
        {preview ? (
          <div className="flex flex-col items-center">
            <img src={preview} alt="Logo preview" className="max-h-32 mb-4 rounded shadow-sm" />
            <p className="text-medium">Logo selected. Click or drop to replace.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-medium">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="text-secondary font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">PNG, JPG, or SVG (max 5MB)</p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
};

export default LogoUploader;