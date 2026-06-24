import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle, XCircle, BadgeCheck, Loader2, AlertTriangle, Navigation } from 'lucide-react';
import { ServiceType, Provider } from '../types';
import { services } from '../data/providers';
import { useProviders } from '../hooks/useProviders';

interface ProviderListProps {
  serviceType: ServiceType;
  userLocation: string;
  userLat: number | null;
  userLon: number | null;
  onBack: () => void;
  onContact: (provider: Provider, method: 'call' | 'whatsapp') => void;
}

export function ProviderList({
  serviceType,
  userLocation,
  userLat,
  userLon,
  onBack,
  onContact,
}: ProviderListProps) {
  const { providers: filteredProviders, loading } = useProviders(serviceType, userLat, userLon);
  const serviceName = services.find((s) => s.id === serviceType)?.name || 'service';

  const handleCall = (provider: Provider) => {
    onContact(provider, 'call');
    window.location.href = `tel:${provider.phone}`;
  };

  const handleWhatsApp = (provider: Provider) => {
    onContact(provider, 'whatsapp');
    const message = encodeURIComponent(
      `I'm stranded near ${userLocation}. I need help with ${serviceName}.`
    );
    const whatsappNumber = provider.phone.replace(/\+/g, '').replace(/\s/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const distanceLabel = (p: Provider) => {
    if (p.calculatedDistance !== undefined) return `${p.calculatedDistance} km away`;
    return 'Location permission denied';
  };

  const etaLabel = (p: Provider) => {
    if (p.calculatedEta !== undefined) return `~${p.calculatedEta} min`;
    return 'ETA unavailable';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900 flex flex-col">
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur border-b border-teal-700/30 px-4 py-4 z-10">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Back</span>
        </button>
      </div>

      <div className="flex-1 p-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Nearby Help</h2>
            <p className="text-gray-300 text-base">{serviceName}</p>
            {userLat === null && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-yellow-400 text-sm">
                <Navigation className="w-4 h-4" />
                <span>Enable location for accurate distances</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
              <p className="text-gray-300 text-base">Finding nearby providers...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="bg-slate-800/60 backdrop-blur border border-teal-700/30 rounded-2xl p-8 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto" />
              <p className="text-gray-200 text-lg font-medium">No providers found nearby</p>
              <p className="text-gray-400 text-sm">
                No providers within 10 km. Try a different service type.
              </p>
              <button
                onClick={onBack}
                className="mt-2 text-teal-400 hover:text-teal-300 text-sm underline transition-colors"
              >
                Try another service
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-slate-800/60 backdrop-blur border border-teal-700/30 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-white">{provider.name}</h3>
                        {provider.verified && (
                          <BadgeCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span className="text-sm">{distanceLabel(provider)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span className="text-sm">Arrives in {etaLabel(provider)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {provider.isOpen ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-sm text-green-400 font-medium">Open</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                              <span className="text-sm text-yellow-400 font-medium">Closed</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleCall(provider)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call</span>
                    </button>
                    <button
                      onClick={() => handleWhatsApp(provider)}
                      className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
