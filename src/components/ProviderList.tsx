import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle, XCircle, BadgeCheck } from 'lucide-react';
import { ServiceType, Provider } from '../types';
import { providers } from '../data/providers';
import { services } from '../data/providers';

interface ProviderListProps {
  serviceType: ServiceType;
  userLocation: string;
  onBack: () => void;
}

export function ProviderList({ serviceType, userLocation, onBack }: ProviderListProps) {
  const filteredProviders = providers.filter((provider) =>
    provider.services.includes(serviceType)
  ).sort((a, b) => a.distance - b.distance);

  const serviceName = services.find((s) => s.id === serviceType)?.name || 'service';

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    const message = encodeURIComponent(
      `I'm stranded near ${userLocation}. I need help with ${serviceName}.`
    );
    const whatsappNumber = phone.replace(/\+/g, '').replace(/\s/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Nearby Help
            </h2>
            <p className="text-gray-300 text-base">
              {serviceName}
            </p>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="bg-slate-800/60 backdrop-blur border border-teal-700/30 rounded-2xl p-8 text-center">
              <p className="text-gray-300 text-lg">
                No providers found for this service in your area
              </p>
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
                        <h3 className="text-xl font-semibold text-white">
                          {provider.name}
                        </h3>
                        {provider.verified && (
                          <BadgeCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span className="text-sm">{provider.distance} km away</span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-300">
                          <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span className="text-sm">Arrives in ~{provider.eta} mins</span>
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
                      onClick={() => handleCall(provider.phone)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call</span>
                    </button>

                    <button
                      onClick={() => handleWhatsApp(provider.phone)}
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
