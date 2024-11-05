import React from 'react';
import { Gauge, Thermometer, CircleSlash, Circle } from 'lucide-react';

interface TankProps {
  level: number;
  isEmergency?: boolean;
  internalTemp: number;
  externalTemp: number;
  isOnFire?: boolean;
}

interface ValveProps {
  isOpen: boolean;
  onToggle: () => void;
  position: 'left' | 'right';
}

interface TankDetailsProps {
  tankNumber: 1 | 2;
  level: number;
  onClose: () => void;
}

export const Tank: React.FC<TankProps> = ({ 
  level, 
  isEmergency = false, 
  internalTemp,
  externalTemp,
  isOnFire = false 
}) => {
  return (
    <div className={`relative w-full aspect-[3/4] bg-slate-800 rounded-lg border-2 ${
      isOnFire ? 'border-orange-500' : isEmergency ? 'border-red-500' : 'border-slate-600'
    } overflow-hidden cursor-pointer`}>
      <div 
        className={`absolute bottom-0 w-full transition-all duration-300 ${
          isOnFire 
            ? 'bg-gradient-to-t from-orange-600 via-red-500 to-yellow-400'
            : isEmergency 
              ? 'bg-gradient-to-t from-red-600 to-red-400'
              : 'bg-gradient-to-t from-blue-600 to-blue-400'
        }`}
        style={{ height: `${level}%` }}
      >
        <div className={`absolute inset-0 ${isOnFire ? 'animate-fire' : 'animate-pulse'} opacity-30 bg-blue-300`}></div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="text-2xl font-bold text-white drop-shadow-lg">
          {level.toFixed(1)}%
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span className="text-white">Int: {internalTemp}°C</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Thermometer className="w-4 h-4 text-blue-400" />
            <span className="text-white">Ext: {externalTemp}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Valve: React.FC<ValveProps> = ({ isOpen, onToggle, position }) => {
  return (
    <div 
      onClick={onToggle}
      className={`cursor-pointer bg-slate-700 rounded-full p-2 shadow-lg hover:bg-slate-600 transition-colors z-30`}
    >
      {isOpen ? (
        <Circle className="w-8 h-8 text-green-400" />
      ) : (
        <CircleSlash className="w-8 h-8 text-red-400" />
      )}
    </div>
  );
};

export const TankDetails: React.FC<TankDetailsProps> = ({ tankNumber, level, onClose }) => {
  const totalCapacity = 15000; // barriles
  const currentAmount = (level / 100) * totalCapacity;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Tanque {tankNumber}</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-400">Altura</p>
            <p className="font-semibold">12.2 metros</p>
          </div>
          <div>
            <p className="text-gray-400">Diámetro</p>
            <p className="font-semibold">8.5 metros</p>
          </div>
          <div>
            <p className="text-gray-400">Capacidad Total</p>
            <p className="font-semibold">{totalCapacity.toLocaleString()} barriles</p>
          </div>
          <div>
            <p className="text-gray-400">Cantidad Actual</p>
            <p className="font-semibold">{currentAmount.toLocaleString()} barriles</p>
          </div>
          <div>
            <p className="text-gray-400">Tipo de Crudo</p>
            <p className="font-semibold">Crudo Pesado</p>
          </div>
          <div>
            <p className="text-gray-400">Estado del Tanque</p>
            <p className="font-semibold text-green-400">Excelente</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export const PumpingStation: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div className={`w-24 h-24 rounded-full bg-slate-800 border-4 ${
      isActive ? 'border-green-500 animate-pulse' : 'border-slate-600'
    } flex items-center justify-center shadow-xl`}>
      <Gauge className={`w-12 h-12 ${
        isActive ? 'text-green-500 animate-spin' : 'text-slate-400'
      }`} />
    </div>
  );
};