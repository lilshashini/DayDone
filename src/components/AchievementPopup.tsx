import { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface AchievementPopupProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  type?: 'task' | 'progress' | 'achievement';
}

// Removed unused ConfettiPiece interface

export default function AchievementPopup({
  isVisible,
  message,
  onClose,
  type = 'achievement'
}: AchievementPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getMessage = () => {
    switch (type) {
      case 'task':
        return {
          title: 'Task Added Successfully!',
          icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
          color: 'from-green-500 to-emerald-500'
        };
      case 'progress':
        return {
          title: 'Progress Saved!',
          icon: <Sparkles className="w-12 h-12 text-purple-500" />,
          color: 'from-purple-500 to-fuchsia-500'
        };
      default:
        return {
          title: 'Achievement Unlocked!',
          icon: <CheckCircle2 className="w-12 h-12 text-amber-500" />,
          color: 'from-amber-500 to-yellow-500'
        };
    }
  };

  const msgInfo = getMessage();

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center 
        ${isAnimating ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
    >
      {/* Fullscreen backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" 
        onClick={() => {
          setIsAnimating(false);
          setTimeout(onClose, 300);
        }}
      />

      {/* Main popup content */}
      <div className={`
        relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl
        transform transition-all duration-500
        ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}
        max-w-lg w-full mx-4 overflow-hidden
      `}>
        {/* Top gradient bar */}
        <div className={`h-2 bg-gradient-to-r ${msgInfo.color}`} />

        {/* Content */}
        <div className="p-8">
          {/* Close button */}
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Mascot (with sparkles) */}
          <div className="mb-6 relative">
            <img
              src="/DaDo_hurey.svg"
              alt="Celebration Mascot"
              className={`w-32 h-32 mx-auto ${isAnimating ? 'animate-bounce' : ''}`}
            />

            {/* Sparkles around mascot */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45) * (Math.PI / 180);
              const radius = 50;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  className={`absolute w-1 h-1 bg-yellow-400 rounded-full ${isAnimating ? 'animate-ping' : 'opacity-0'}`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '1.5s'
                  }}
                />
              );
            })}
          </div>

          {/* Icon */}
          <div className="mb-4">
            <div className="mx-auto w-20 h-20 flex items-center justify-center">
              {msgInfo.icon}
            </div>
          </div>

          {/* Title and Message */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {msgInfo.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {message}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <div 
              className={`h-full transition-all duration-1000 ease-out bg-gradient-to-r ${msgInfo.color}`}
              style={{ width: isAnimating ? '100%' : '0%' }}
            />
          </div>

          {/* Encouragement message */}
          <div className="text-center">
            <div className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-slate-100 dark:bg-slate-800
              text-slate-700 dark:text-slate-200
              transform transition-all duration-500 delay-300
              ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Keep up the great work!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}