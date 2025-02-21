import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const simulateProgress = () => {
      if (progress >= 100) {
        // Chiamiamo onLoadingComplete solo quando il progresso è completo
        timeoutId = setTimeout(() => {
          onLoadingComplete();
        }, 500);
        return;
      }

      // Calcola l'incremento in base al progresso attuale
      const increment = progress < 80 ? 2 : 1;
      const delay = progress < 80 ? 50 : 100;

      timeoutId = setTimeout(() => {
        setProgress(prev => Math.min(prev + increment, 100));
      }, delay);
    };

    simulateProgress();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [progress, onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Benvenuto!
      </h1>
      <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-gray-600">
        {progress < 30 && "Inizializzazione mappa..."}
        {progress >= 30 && progress < 60 && "Caricamento dati..."}
        {progress >= 60 && progress < 85 && "Preparazione markers..."}
        {progress >= 85 && "Quasi pronto..."}
      </p>
    </div>
  );
};

export default LoadingScreen; 