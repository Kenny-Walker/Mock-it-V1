
import React, { useState, useEffect } from 'react';
import { Mockup } from '../types';

interface MockupViewerProps {
    mockup: Mockup;
    onClose: () => void;
}

const ZoomInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;
const ZoomOutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const MockupViewer: React.FC<MockupViewerProps> = ({ mockup, onClose }) => {
    const [zoom, setZoom] = useState(1);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200); // Animation duration
    };

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`} onClick={handleClose} role="dialog" aria-modal="true">
            <div className={`bg-white rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden ${isClosing ? 'animate-popup-out' : 'animate-popup-in'}`} onClick={(e) => e.stopPropagation()}>
                
                {/* Image Panel */}
                <div className="flex-grow bg-gray-200 flex items-center justify-center relative overflow-auto transition-colors duration-300">
                    <img 
                        src={mockup.imageUrl} 
                        alt={`Mockup of ${mockup.product.name}`} 
                        className="max-w-full max-h-full object-contain transition-transform duration-300 origin-center"
                        style={{ transform: `scale(${zoom})` }}
                    />
                </div>

                {/* Controls Panel */}
                <div className="w-full md:max-w-sm bg-gray-50 p-6 flex flex-col space-y-6 overflow-y-auto relative">
                     <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-all transform hover:scale-110 hover:rotate-90 active:scale-95" aria-label="Close viewer">
                        <CloseIcon className="w-7 h-7" />
                    </button>
                    <div>
                        <h3 className="text-xl font-bold text-secondary pr-10">{mockup.product.name}</h3>
                        <p className="text-md text-primary font-semibold">{mockup.placement.name}</p>
                    </div>
                    
                    {/* Zoom Controls */}
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-secondary mb-2">Zoom</h4>
                        <div className="flex items-center space-x-2">
                            <ZoomOutIcon className="text-gray-500"/>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                aria-label="Zoom slider"
                            />
                            <ZoomInIcon className="text-gray-500" />
                        </div>
                        <div className="text-center font-mono mt-2 text-sm text-medium">{(zoom * 100).toFixed(0)}%</div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default MockupViewer;
