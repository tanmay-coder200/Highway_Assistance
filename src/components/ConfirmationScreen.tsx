import { CheckCircle, Phone, MessageCircle, ArrowLeft, Home, MapPin, Clock, BadgeCheck } from 'lucide-react';
import { Provider, ServiceType } from '../types';
import { services } from '../data/providers';

interface ConfirmationScreenProps {
  provider: Provider;
  serviceType: ServiceType;
  userLocation: string;
  contactMethod: 'call' | 'whatsapp';
  onBackToProviders: () => void;
  onStartOver: () => void;
}

export function ConfirmationScreen({
  provider,
  serviceType,
  userLocation,
  contactMethod,
  onBackToProviders,
  onStartOver,
}: ConfirmationScreenProps) {
  const serviceName = services.find((s) => s.id === serviceType)?.name || 'service';

  const handleCallAgain = () => {
    window.location.href = `tel:${provider.phone}`;
  };

  const handleWhatsAppAgain = () => {
    const message = encodeURIComponent(
      `I'm stranded near ${userLocation}. I need help with ${serviceName}.`
    );
    const whatsappNumber = provider.phone.replace(/\+/g, '').replace(/\s/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">

        {/* Success badge */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/40">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Help is Coming!</h2>
            <p className="text-gray-300 mt-1">
              You contacted via {contactMethod === 'call' ? 'phone call' : 'WhatsApp'}
            </p>
          </div>
        </div>

        {/* Provider details card */}
        <div className="bg-slate-800/60 backdrop-blur border border-teal-700/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold text-white">{provider.name}</h3>
            {provider.verified && (
              <BadgeCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>
                {provider.calculatedDistance !== undefined
                  ? `${provider.calculatedDistance} km away`
                  : 'Distance unavailable'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>
                {provider.calculatedEta !== undefined
                  ? `Estimated arrival: ~${provider.calculatedEta} minutes`
                  : 'ETA unavailable'}
              </span>
            </div>
          </div>

          <div className="border-t border-teal-700/30 pt-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Service requested</p>
            <p className="text-white font-medium">{serviceName}</p>
          </div>

          <div className="border-t border-teal-700/30 pt-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Your location</p>
            <p className="text-white font-medium text-sm">{userLocation}</p>
          </div>
        </div>

        {/* Contact again buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCallAgain}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>Call Again</span>
          </button>
          <button
            onClick={handleWhatsAppAgain}
            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-4 px-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Navigation buttons */}
        <div className="space-y-3">
          <button
            onClick={onBackToProviders}
            className="w-full bg-slate-800/60 hover:bg-slate-700/60 border border-teal-700/30 hover:border-teal-500/50 text-gray-200 font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Providers</span>
          </button>
          <button
            onClick={onStartOver}
            className="w-full bg-slate-800/30 hover:bg-slate-700/30 text-gray-400 hover:text-gray-200 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Start Over</span>
          </button>
        </div>
      </div>
    </div>
  );
}
