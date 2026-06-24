import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

interface HomeScreenProps {
  onNeedHelp: () => void;
}

export function HomeScreen({ onNeedHelp }: HomeScreenProps) {
  const { location, status, error } = useGeolocation();

  const getLocationMessage = () => {
    switch (status) {
      case 'detecting':
        return 'Detecting your location...';
      case 'detected':
        return location?.address || 'Location detected';
      case 'error':
        return 'Unable to detect location';
      default:
        return '';
    }
  };

  const getLocationIcon = () => {
    switch (status) {
      case 'detecting':
        return <Loader2 className="w-6 h-6 animate-spin text-teal-300" />;
      case 'detected':
        return <MapPin className="w-6 h-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full flex flex-col items-center space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Turbo Aid
          </h1>
          <p className="text-lg text-gray-300">
            Help is on the way
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur px-6 py-4 rounded-2xl border border-teal-700/30">
          {getLocationIcon()}
          <span className="text-gray-200 text-base">
            {getLocationMessage()}
          </span>
        </div>

        {error && (
          <p className="text-sm text-yellow-300 text-center px-4">
            Continue anyway - you can share your location manually
          </p>
        )}

        <button
          onClick={onNeedHelp}
          className="w-full max-w-xs bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-2xl font-semibold py-6 px-8 rounded-3xl shadow-2xl shadow-green-900/50 active:scale-95 transition-all duration-200 border-2 border-green-400/30"
        >
          I NEED HELP
        </button>

        <p className="text-sm text-gray-400 text-center px-4 max-w-xs">
          Tap the button above to find nearby assistance services
        </p>
      </div>
    </div>
  );
}
