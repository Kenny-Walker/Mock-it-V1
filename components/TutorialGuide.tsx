
import React, { useState, useEffect } from 'react';

interface TutorialGuideProps {
    onClose: () => void;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>;
const CustomizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>;
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>;
const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;


const TUTORIAL_STEPS = [
    {
      title: 'Step 1: Upload Your Logo',
      content: 'Start by dragging and dropping your logo or clicking the upload area. We recommend a high-quality PNG with a transparent background for the best results.',
      Icon: UploadIcon,
    },
    {
      title: 'Step 2: Customize Products',
      content: 'Select the products you want to see your logo on. For each product, choose from the various placement options available.',
      Icon: CustomizeIcon,
    },
    {
      title: 'Step 3: Generate & View',
      content: 'Once you\'re ready, hit "Generate Mockups". Our AI will create your designs. Click "View" on any mockup to zoom in for a closer look.',
      Icon: SparklesIcon,
    },
    {
      title: 'Step 4: Download Your Mockups',
      content: 'Happy with the results? Download individual images or get them all in a handy .zip file. You\'re all set to showcase your brand!',
      Icon: DownloadIcon,
    }
];

const TutorialGuide: React.FC<TutorialGuideProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200); // Animation duration
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const stepData = TUTORIAL_STEPS[currentStep];

    return (
        <div className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`} onClick={handleClose}>
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden ${isClosing ? 'animate-popup-out' : 'animate-popup-in'}`} onClick={(e) => e.stopPropagation()}>
                <div className="p-6 relative">
                    <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-all transform hover:scale-110 hover:rotate-90 active:scale-95" aria-label="Close tutorial">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                    <div className="flex justify-center items-center h-24 w-24 rounded-full bg-primary/10 mx-auto mb-4 text-primary">
                        <stepData.Icon className="w-12 h-12"/>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-secondary mb-2">{stepData.title}</h2>
                    <p className="text-center text-medium leading-relaxed">{stepData.content}</p>
                </div>

                <div className="bg-gray-50 p-4 flex items-center justify-between border-t">
                    <div className="flex items-center gap-2">
                        {TUTORIAL_STEPS.map((_, index) => (
                            <div 
                                key={index} 
                                className={`h-2 rounded-full transition-all ${index === currentStep ? 'w-6 bg-primary' : 'w-2 bg-gray-300'}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <button onClick={handlePrev} className="font-semibold py-2 px-4 rounded-md text-secondary hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-98">
                                Previous
                            </button>
                        )}
                        <button onClick={handleNext} className="font-bold py-2 px-4 rounded-md text-white bg-primary hover:bg-primary-hover transition-all duration-200 transform hover:scale-105 active:scale-98">
                            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialGuide;
