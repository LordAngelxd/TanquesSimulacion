import { useState, useCallback } from 'react';

export interface Emergency {
  id: string;
  title: string;
  description: string;
  affectedTank: 1 | 2;
  action: 'transfer' | 'shutdown' | 'fire-response';
  targetLevel?: number;
  type: 'operational' | 'fire';
  systemResponse?: {
    status: 'success' | 'failure';
    message: string;
  };
}

const FIRE_RESPONSES = [
  { status: 'success', message: 'Sistema activado exitosamente' },
  { status: 'failure', message: 'Activación fallida - Iniciando sistema secundario' }
];

const EMERGENCY_SCENARIOS: Emergency[] = [
  {
    id: 'leak',
    title: '¡Fuga Detectada!',
    description: 'Se ha detectado una fuga en el Tanque 1. Es necesario transferir el 50% del contenido al Tanque 2 inmediatamente.',
    affectedTank: 1,
    action: 'transfer',
    targetLevel: 50,
    type: 'operational'
  },
  {
    id: 'pressure',
    title: '¡Presión Crítica!',
    description: 'Presión crítica detectada en el Tanque 2. Protocolo de emergencia: reducir nivel al 30%.',
    affectedTank: 2,
    action: 'transfer',
    targetLevel: 30,
    type: 'operational'
  },
  {
    id: 'fire-1',
    title: '¡ALERTA DE INCENDIO!',
    description: 'Temperatura crítica detectada en Tanque 1. Temperatura interna: 2500°C y aumentando.',
    affectedTank: 1,
    action: 'fire-response',
    type: 'fire'
  },
  {
    id: 'fire-2',
    title: '¡ALERTA DE INCENDIO!',
    description: 'Temperatura crítica detectada en Tanque 2. Temperatura interna: 4800°C y aumentando.',
    affectedTank: 2,
    action: 'fire-response',
    type: 'fire'
  }
];

interface UseEmergencyScenarioProps {
  tank1Level: number;
  tank2Level: number;
  setTank1Level: (value: number) => void;
  setTank2Level: (value: number) => void;
  setIsFlowing: (value: boolean) => void;
  setTank1Temps: (internal: number, external: number) => void;
  setTank2Temps: (internal: number, external: number) => void;
}

export const useEmergencyScenario = ({
  tank1Level,
  tank2Level,
  setTank1Level,
  setTank2Level,
  setIsFlowing,
  setTank1Temps,
  setTank2Temps,
}: UseEmergencyScenarioProps) => {
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const triggerRandomEmergency = useCallback(() => {
    const randomScenario = {...EMERGENCY_SCENARIOS[Math.floor(Math.random() * EMERGENCY_SCENARIOS.length)]};
    
    if (randomScenario.type === 'fire') {
      const response = FIRE_RESPONSES[Math.floor(Math.random() * FIRE_RESPONSES.length)];
      randomScenario.systemResponse = response;
      
      // Set critical temperatures for the affected tank
      const maxTemp = Math.floor(Math.random() * 3000) + 2000; // Random temp between 2000-5000°C
      if (randomScenario.affectedTank === 1) {
        setTank1Temps(maxTemp, maxTemp * 0.7);
      } else {
        setTank2Temps(maxTemp, maxTemp * 0.7);
      }
    }
    
    setEmergency(randomScenario);
    setIsEmergencyActive(true);
  }, [setTank1Temps, setTank2Temps]);

  const handleEmergencyResponse = useCallback(() => {
    if (!emergency) return;

    if (emergency.action === 'shutdown') {
      setIsFlowing(false);
    } else if (emergency.action === 'fire-response') {
      // Reset temperatures after fire response
      if (emergency.affectedTank === 1) {
        setTank1Temps(25, 25);
      } else {
        setTank2Temps(25, 25);
      }
    } else if (emergency.action === 'transfer' && emergency.targetLevel !== undefined) {
      const currentLevel = emergency.affectedTank === 1 ? tank1Level : tank2Level;
      const difference = currentLevel - emergency.targetLevel;
      
      if (emergency.affectedTank === 1) {
        setTank1Level(emergency.targetLevel);
        setTank2Level(tank2Level + difference);
      } else {
        setTank2Level(emergency.targetLevel);
        setTank1Level(tank1Level + difference);
      }
    }

    setEmergency(null);
    setIsEmergencyActive(false);
  }, [emergency, tank1Level, tank2Level, setTank1Level, setTank2Level, setIsFlowing, setTank1Temps, setTank2Temps]);

  return {
    emergency,
    isEmergencyActive,
    triggerRandomEmergency,
    handleEmergencyResponse,
  };
};