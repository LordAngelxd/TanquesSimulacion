import React from 'react';
import { CircleDot } from 'lucide-react';

interface ValveProps {
  isOpen: boolean;
  onToggle: () => void;
  position: 'left' | 'right';
}

export const Valve: React.FC<ValveProps> = ({ isOpen, onToggle, position }) => {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation(); // Prevent tank click event
        onToggle();
      }}
      className={`absolute top-1/2 ${position === 'left' ? '-right-6' : '-left-6'} -translate-y-1/2 z-20 
        ${isOpen ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}
        transition-colors duration-300`}
      title={`${isOpen ? 'Cerrar' : 'Abrir'} válvula`}
    >
      <CircleDot 
        className={`w-12 h-12 transform ${isOpen ? 'rotate-0' : 'rotate-90'} 
          transition-transform duration-300`}
      />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium">
        {isOpen ? 'Abierta' : 'Cerrada'}
      </div>
    </button>
  );
};