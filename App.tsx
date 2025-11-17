
import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { Product, Mockup, Placement } from './types';
import { PRODUCTS } from './constants';
import { generateMockups } from './services/geminiService';
import LogoUploader from './components/LogoUploader';
import MockupGallery from './components/MockupGallery';
import ProductPlacementSelector from './components/ProductPlacementSelector';
import MockupViewer from './components/MockupViewer';
import TutorialGuide from './components/TutorialGuide';
import { SparklesIcon } from './components/icons/SparklesIcon';

type SelectedPlacements = Record<string, string[]>;

type LoadingState = {
    active: boolean;
    progress: number;
    total: number;
    message: string;
}

const App: React.FC = () => {
  const [logo, setLogo] = useState<{ file: File; base64: string } | null>(null);
  const [generatedMockups, setGeneratedMockups] = useState<Mockup[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({ active: false, progress: 0, total: 0, message: '' });
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPlacements, setSelectedPlacements] = useState<SelectedPlacements>({});

  const [viewingMockup, setViewingMockup] = useState<Mockup | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
        setShowTutorial(true);
    }
  }, []);

  const handleLogoUpload = (file: File, base64: string) => {
    setLogo({ file, base64 });
    setGeneratedMockups([]);
    setError(null);
    const initialPlacements: SelectedPlacements = {};
    PRODUCTS.forEach(p => {
        initialPlacements[p.id] = []; // Placements are not selected by default
    });
    setSelectedPlacements(initialPlacements);
  };

  const handlePlacementChange = (productId: string, placementId: string) => {
    setSelectedPlacements(prev => {
        const currentPlacements = prev[productId] || [];
        const newPlacements = currentPlacements.includes(placementId)
            ? currentPlacements.filter(id => id !== placementId)
            : [...currentPlacements, placementId];
        return { ...prev, [productId]: newPlacements };
    });
  };

  const handleProgressUpdate = (progress: number, total: number) => {
    setLoadingState({
        active: true,
        progress,
        total,
        message: `Generating mockup ${progress} of ${total}...`
    });
  };

  const handleGenerateClick = useCallback(async () => {
    if (!logo) {
      setError('Please upload a logo first.');
      return;
    }

    const totalSelected = Object.values(selectedPlacements).flat().length;
    if (totalSelected === 0) {
        setError('Please select at least one placement option.');
        return;
    }

    setLoadingState({ active: true, progress: 0, total: totalSelected, message: 'Starting generation...' });
    setError(null);
    setGeneratedMockups([]);

    try {
      const mockups = await generateMockups(logo.base64, PRODUCTS, selectedPlacements, handleProgressUpdate);
      setGeneratedMockups(mockups);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate mockups. ${errorMessage}`);
    } finally {
      setLoadingState({ active: false, progress: 0, total: 0, message: '' });
    }
  }, [logo, selectedPlacements]);

  const handleDownloadAll = async () => {
    if (generatedMockups.length === 0) return;

    setIsZipping(true);
    setError(null);

    try {
      const zip = new JSZip();

      for (const mockup of generatedMockups) {
        const productName = mockup.product.name.toLowerCase().replace(/\s+/g, '-');
        const placementName = mockup.placement.name.toLowerCase().replace(/\s+/g, '-');
        const fileName = `mockup-${productName}-${placementName}.png`;

        const base64Data = mockup.imageUrl.split(',')[1];
        if (base64Data) {
          zip.file(fileName, base64Data, { base64: true });
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'mockups.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error("Failed to create zip file", error);
      setError("Sorry, we couldn't create the zip file. Please try downloading images individually.");
    } finally {
      setIsZipping(false);
    }
  };

  const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );

  const Header: React.FC = () => (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <img src="https://res.cloudinary.com/denpexgm3/image/upload/v1763243155/Image_fx_-_2025-11-15T075218.189_e4keww.jpg" alt="Mock-it logo" className="h-[86px] w-auto object-contain" />
        <button 
            onClick={() => setShowTutorial(true)} 
            className="text-medium hover:text-primary transition-all duration-200 transform hover:scale-110 active:scale-95"
            aria-label="Open tutorial"
        >
            <HelpIcon className="w-7 h-7" />
        </button>
      </div>
    </header>
  );

  const Footer: React.FC = () => (
    <footer className="bg-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-medium">
            <p>&copy; {new Date().getFullYear()} Mock-it. Powered by Mockerel AI.</p>
        </div>
    </footer>
  );

  const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
  
  const isLoading = loadingState.active;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-secondary tracking-tight">
              Create Stunning Merch in Seconds
            </h2>
            <p className="mt-4 text-lg text-medium max-w-2xl mx-auto">
              Upload a logo, customize placements and backgrounds, and let our AI generate professional mockups for you.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/80 space-y-8">
            {/* Step 1 */}
            <div>
              <h3 className="text-xl font-semibold text-secondary flex items-center mb-4">
                <span className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold">1</span>
                Upload Your Logo
              </h3>
              <LogoUploader onLogoUpload={handleLogoUpload} />
            </div>

            {/* Step 2: Customization - Appears after logo is uploaded */}
            {logo && (
              <>
                <div>
                    <h3 className="text-xl font-semibold text-secondary flex items-center mb-4">
                        <span className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold">2</span>
                        Customize Your Mockups
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-lg border">
                        <ProductPlacementSelector 
                            products={PRODUCTS}
                            selectedPlacements={selectedPlacements}
                            onPlacementChange={handlePlacementChange}
                        />
                    </div>
                </div>

                {/* Step 3: Generate */}
                <div>
                  <h3 className="text-xl font-semibold text-secondary flex items-center mb-4">
                     <span className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold">3</span>
                    Generate Your Mockups
                  </h3>
                  <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-98 disabled:scale-100"
                  >
                    <SparklesIcon />
                    {isLoading ? loadingState.message : 'Generate Mockups'}
                  </button>
                </div>
              </>
            )}
          </div>
          
          {error && <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>}

          {isLoading && (
            <div className="mt-10 text-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{width: `${(loadingState.progress / loadingState.total) * 100}%`}}></div>
              </div>
              <p className="mt-4 text-medium font-semibold">{loadingState.message}</p>
            </div>
          )}

          {generatedMockups.length > 0 && !isLoading && (
            <div className="mt-12">
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 text-center">
                    <h3 className="text-2xl font-bold text-secondary">Your Mockups are Ready!</h3>
                    <button
                        onClick={handleDownloadAll}
                        disabled={isZipping}
                        className="flex items-center justify-center gap-2 bg-secondary text-white font-semibold py-2.5 px-5 rounded-md hover:bg-gray-700 active:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-98 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon />
                        {isZipping ? 'Zipping...' : 'Download All (.zip)'}
                    </button>
                </div>
               <MockupGallery 
                    mockups={generatedMockups} 
                    onCardClick={setViewingMockup}
                />
            </div>
          )}
        </div>
      </main>
      <Footer/>
      {viewingMockup && (
        <MockupViewer 
            mockup={viewingMockup} 
            onClose={() => setViewingMockup(null)}
        />
      )}
      {showTutorial && (
        <TutorialGuide onClose={() => {
            setShowTutorial(false);
            localStorage.setItem('hasSeenTutorial', 'true');
        }} />
      )}
    </div>
  );
};

export default App;
