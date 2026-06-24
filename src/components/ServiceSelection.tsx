import { ArrowLeft, Wrench, Fuel, Battery, Truck, Settings } from 'lucide-react';
import { ServiceType } from '../types';

interface ServiceSelectionProps {
  onSelectService: (service: ServiceType) => void;
  onBack: () => void;
}

export function ServiceSelection({ onSelectService, onBack }: ServiceSelectionProps) {
  const services = [
    { id: 'tyre-puncture' as ServiceType, name: 'Tyre Puncture', icon: Wrench },
    { id: 'fuel-assistance' as ServiceType, name: 'Fuel Assistance', icon: Fuel },
    { id: 'battery-jumpstart' as ServiceType, name: 'Battery Jumpstart', icon: Battery },
    { id: 'towing' as ServiceType, name: 'Towing', icon: Truck },
    { id: 'mechanical-help' as ServiceType, name: 'General Mechanical Help', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900 flex flex-col">
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur border-b border-teal-700/30 px-4 py-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Back</span>
        </button>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              What do you need?
            </h2>
            <p className="text-gray-300 text-base">
              Select the type of assistance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => onSelectService(service.id)}
                  className="bg-slate-800/60 backdrop-blur hover:bg-slate-700/60 border-2 border-teal-700/40 hover:border-green-500/60 rounded-2xl p-8 transition-all duration-200 active:scale-95 flex flex-col items-center space-y-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-white text-lg font-medium text-center leading-tight">
                    {service.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
