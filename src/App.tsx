import { useState } from 'react';
import { WifiOff } from 'lucide-react';
import { HomeScreen } from './components/HomeScreen';
import { ServiceSelection } from './components/ServiceSelection';
import { ProviderList } from './components/ProviderList';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useGeolocation } from './hooks/useGeolocation';
import { ServiceType, Provider } from './types';

type Screen = 'home' | 'service-selection' | 'provider-list' | 'confirmation';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [contactMethod, setContactMethod] = useState<'call' | 'whatsapp'>('call');
  const isOnline = useOnlineStatus();
  const { location } = useGeolocation();

  const userLat = location?.latitude ?? null;
  const userLon = location?.longitude ?? null;
  const userAddress = location?.address || 'Highway location';

  const handleNeedHelp = () => setCurrentScreen('service-selection');

  const handleSelectService = (service: ServiceType) => {
    setSelectedService(service);
    setCurrentScreen('provider-list');
  };

  const handleContact = (provider: Provider, method: 'call' | 'whatsapp') => {
    setSelectedProvider(provider);
    setContactMethod(method);
    setCurrentScreen('confirmation');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedService(null);
    setSelectedProvider(null);
  };

  const handleBackToServices = () => {
    setCurrentScreen('service-selection');
    setSelectedService(null);
    setSelectedProvider(null);
  };

  const handleBackToProviders = () => {
    setCurrentScreen('provider-list');
    setSelectedProvider(null);
  };

  return (
    <div className="relative min-h-screen">
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-900/90 backdrop-blur border-b border-yellow-700 px-4 py-3 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-center space-x-2">
            <WifiOff className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-yellow-100">
              Offline Mode: Showing last known nearby providers
            </span>
          </div>
        </div>
      )}

      <div className={!isOnline ? 'pt-12' : ''}>
        {currentScreen === 'home' && (
          <HomeScreen onNeedHelp={handleNeedHelp} />
        )}

        {currentScreen === 'service-selection' && (
          <ServiceSelection
            onSelectService={handleSelectService}
            onBack={handleBackToHome}
          />
        )}

        {currentScreen === 'provider-list' && selectedService && (
          <ProviderList
            serviceType={selectedService}
            userLocation={userAddress}
            userLat={userLat}
            userLon={userLon}
            onBack={handleBackToServices}
            onContact={handleContact}
          />
        )}

        {currentScreen === 'confirmation' && selectedProvider && selectedService && (
          <ConfirmationScreen
            provider={selectedProvider}
            serviceType={selectedService}
            userLocation={userAddress}
            contactMethod={contactMethod}
            onBackToProviders={handleBackToProviders}
            onStartOver={handleBackToHome}
          />
        )}
      </div>
    </div>
  );
}

export default App;
