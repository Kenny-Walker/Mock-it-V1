
import React from 'react';
import { Mockup } from '../types';

interface MockupGalleryProps {
  mockups: Mockup[];
  onCardClick: (mockup: Mockup) => void;
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const ViewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const MockupCard: React.FC<{ mockup: Mockup; onCardClick: (mockup: Mockup) => void; }> = ({ mockup, onCardClick }) => {
  const productName = mockup.product.name.toLowerCase().replace(/\s+/g, '-');
  const placementName = mockup.placement.name.toLowerCase().replace(/\s+/g, '-');
  const fileName = `mockup-${productName}-${placementName}.png`;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event when downloading
    const link = document.createElement('a');
    link.href = mockup.imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200/80 transform transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col">
      <div className="aspect-square w-full bg-gray-100 relative">
          <img src={mockup.imageUrl} alt={`Mockup of ${mockup.product.name} - ${mockup.placement.name}`} className="w-full h-full object-contain" loading="lazy" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="font-bold text-lg text-secondary">{mockup.product.name}</h4>
        <p className="text-medium font-semibold text-sm text-primary mb-2">{mockup.placement.name}</p>
        <p className="text-sm text-medium mb-4 flex-grow">{mockup.product.description}</p>
        <div className="mt-auto grid grid-cols-2 gap-2">
            <button
              onClick={() => onCardClick(mockup)}
              className="w-full flex items-center justify-center gap-2 bg-white text-secondary border border-gray-300 font-semibold py-2.5 px-4 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-98"
            >
              <ViewIcon />
              View
            </button>
            <button
              onClick={handleDownload}
              title={`Download as ${fileName}`}
              className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-gray-700 active:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-98"
            >
              <DownloadIcon />
              Download
            </button>
        </div>
      </div>
    </div>
  );
};


const MockupGallery: React.FC<MockupGalleryProps> = ({ mockups, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {mockups.map((mockup) => (
        <MockupCard key={`${mockup.product.id}-${mockup.placement.id}`} mockup={mockup} onCardClick={onCardClick} />
      ))}
    </div>
  );
};

export default MockupGallery;
