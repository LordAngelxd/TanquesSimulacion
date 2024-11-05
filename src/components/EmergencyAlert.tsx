import React from 'react';
import { AlertTriangle, X, Flame } from 'lucide-react';
import { Emergency } from '../hooks/useEmergencyScenario';

interface EmergencyAlertProps {
  emergency: Emergency;
  onRespond: () => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ emergency, onRespond }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`w-96 ${emergency.type === 'fire' ? 'bg-orange-600' : 'bg-red-600'} text-white p-6 rounded-lg shadow-lg`}>
        <div className="flex items-start gap-3">
          {emergency.type === 'fire' ? (
            <Flame className="w-6 h-6 flex-shrink-0 mt-1" />
          ) : (
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{emergency.title}</h3>
            <p className="text-sm mb-4">{emergency.description}</p>
            {emergency.systemResponse && (
              <p className={`text-sm mb-4 ${emergency.systemResponse.status === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                Sistema contra incendios: {emergency.systemResponse.message}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={onRespond}
                className="px-4 py-2 bg-white text-red-600 rounded hover:bg-red-100 transition-colors"
              >
                Iniciar Protocolo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};