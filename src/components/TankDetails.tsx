import React from 'react';
import { X, Info, Droplet, Ruler, Circle, Database, Activity } from 'lucide-react';

interface TankDetailsProps {
  tankNumber: number;
  level: number;
  onClose: () => void;
  internalTemp: number;
  externalTemp: number;
}

export const TankDetails: React.FC<TankDetailsProps> = ({ 
  tankNumber, 
  level, 
  onClose,
  internalTemp,
  externalTemp
}) => {
  const height = 12; // metros
  const diameter = 20; // metros
  const maxCapacity = 15000; // barriles
  const currentCapacity = Math.round(maxCapacity * (level / 100));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-96 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Info className="w-6 h-6" />
          Tanque {tankNumber}
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Ruler className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Altura</p>
              <p className="font-semibold">{height} metros</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Circle className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Diámetro</p>
              <p className="font-semibold">{diameter} metros</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Capacidad Máxima</p>
              <p className="font-semibold">{maxCapacity.toLocaleString()} barriles</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Droplet className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Capacidad Actual</p>
              <p className="font-semibold">{currentCapacity.toLocaleString()} barriles ({level}%)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Estado del Tanque</p>
              <p className="font-semibold text-green-400">Excelente</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-slate-700 rounded-lg">
            <h3 className="font-semibold mb-2">Información del Crudo</h3>
            <p className="text-sm text-gray-300">Tipo: Crudo Pesado</p>
            <p className="text-sm text-gray-300">Temperatura Interna: {internalTemp}°C</p>
            <p className="text-sm text-gray-300">Temperatura Externa: {externalTemp}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};