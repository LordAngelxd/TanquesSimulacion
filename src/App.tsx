import React, { useState, useEffect } from 'react';
import { Tank, PumpingStation, Valve, TankDetails } from './components/Tank';
import { Cylinder, ArrowRight, ArrowLeft, ArrowLeftRight, XCircle, Droplet, Gauge, AlertTriangle } from 'lucide-react';
import { EmergencyAlert } from './components/EmergencyAlert';
import { useEmergencyScenario } from './hooks/useEmergencyScenario';

function App() {
  const [tank1Level, setTank1Level] = useState(80);
  const [tank2Level, setTank2Level] = useState(20);
  const [isFlowing, setIsFlowing] = useState(false);
  const [flowDirection, setFlowDirection] = useState<'right' | 'left' | null>(null);
  const [pressure, setPressure] = useState(0);
  const [flowRate, setFlowRate] = useState(0);
  const [isEqualizing, setIsEqualizing] = useState(false);
  const [valve1Open, setValve1Open] = useState(true);
  const [valve2Open, setValve2Open] = useState(true);
  const [selectedTank, setSelectedTank] = useState<1 | 2 | null>(null);
  const maxCapacity = 100;

  // Temperature states
  const [tank1InternalTemp, setTank1InternalTemp] = useState(25);
  const [tank1ExternalTemp, setTank1ExternalTemp] = useState(25);
  const [tank2InternalTemp, setTank2InternalTemp] = useState(25);
  const [tank2ExternalTemp, setTank2ExternalTemp] = useState(25);

  const setTank1Temps = (internal: number, external: number) => {
    setTank1InternalTemp(internal);
    setTank1ExternalTemp(external);
  };

  const setTank2Temps = (internal: number, external: number) => {
    setTank2InternalTemp(internal);
    setTank2ExternalTemp(external);
  };

  const {
    emergency,
    triggerRandomEmergency,
    handleEmergencyResponse,
    isEmergencyActive
  } = useEmergencyScenario({ 
    tank1Level, 
    tank2Level, 
    setTank1Level, 
    setTank2Level, 
    setIsFlowing,
    setTank1Temps,
    setTank2Temps
  });

  useEffect(() => {
    if (isFlowing || isEqualizing) {
      if (!valve1Open || !valve2Open) {
        setIsFlowing(false);
        setIsEqualizing(false);
        return;
      }

      const interval = setInterval(() => {
        if (isFlowing) {
          if (flowDirection === 'right') {
            setTank1Level(prev => Math.max(prev - 1, 0));
            setTank2Level(prev => Math.min(prev + 1, maxCapacity));
          } else {
            setTank1Level(prev => Math.min(prev + 1, maxCapacity));
            setTank2Level(prev => Math.max(prev - 1, 0));
          }
          setPressure(Math.random() * (150 - 120) + 120);
          setFlowRate(2.5);
        } else if (isEqualizing) {
          const average = (tank1Level + tank2Level) / 2;
          const step = 0.5;
          
          setTank1Level(prev => {
            const diff = average - prev;
            return Math.abs(diff) < step ? average : prev + (diff > 0 ? step : -step);
          });
          
          setTank2Level(prev => {
            const diff = average - prev;
            return Math.abs(diff) < step ? average : prev + (diff > 0 ? step : -step);
          });

          setPressure(Math.random() * (130 - 100) + 100);
          setFlowRate(1.8);

          if (Math.abs(tank1Level - average) < step && Math.abs(tank2Level - average) < step) {
            setIsEqualizing(false);
            setPressure(0);
            setFlowRate(0);
          }
        }
      }, 50);
      return () => clearInterval(interval);
    }
    setPressure(0);
    setFlowRate(0);
  }, [isFlowing, isEqualizing, flowDirection, tank1Level, tank2Level, valve1Open, valve2Open]);

  const transferOil = (direction: 'right' | 'left') => {
    if (!valve1Open || !valve2Open) return;
    
    if ((direction === 'right' && tank1Level > 0 && tank2Level < maxCapacity) ||
        (direction === 'left' && tank2Level > 0 && tank1Level < maxCapacity)) {
      setFlowDirection(direction);
      setIsFlowing(true);
    }
  };

  const equalizeOil = () => {
    if (!valve1Open || !valve2Open) return;
    setIsFlowing(false);
    setIsEqualizing(true);
  };

  const stopFlow = () => {
    setIsFlowing(false);
    setIsEqualizing(false);
    setFlowDirection(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Simulación de Tanques de Crudo</h1>
      
      <div className="max-w-6xl mx-auto">
        {emergency && (
          <EmergencyAlert 
            emergency={emergency} 
            onRespond={handleEmergencyResponse}
          />
        )}

        <div className="relative flex justify-between items-center mb-12">
          {/* Connecting Pipes - Moved before tanks to be behind */}
          <div className="absolute w-full h-4 top-1/2 -translate-y-1/2">
            <div 
              className={`h-full bg-gradient-to-r ${
                isFlowing || isEqualizing
                  ? 'from-blue-500 via-blue-400 to-blue-500'
                  : 'from-gray-700 via-gray-600 to-gray-700'
              } rounded-full transform -translate-y-1/2 shadow-lg`} 
              style={{
                animation: (isFlowing || isEqualizing) 
                  ? `flowAnimation 2s linear infinite ${flowDirection === 'left' ? 'reverse' : ''}` 
                  : 'none'
              }}
            />
          </div>

          {/* Valves on the pipeline */}
          <div className="absolute left-[35%] top-1/2 -translate-y-[calc(50%+5px)]">
            <Valve 
              isOpen={valve1Open} 
              onToggle={() => setValve1Open(!valve1Open)}
              position="right"
            />
          </div>
          <div className="absolute right-[35%] top-1/2 -translate-y-[calc(50%+5px)]">
            <Valve 
              isOpen={valve2Open} 
              onToggle={() => setValve2Open(!valve2Open)}
              position="left"
            />
          </div>

          {/* Tank 1 */}
          <div className="w-1/4 relative z-10" onClick={() => setSelectedTank(1)}>
            <Tank 
              level={tank1Level} 
              isEmergency={isEmergencyActive && emergency?.affectedTank === 1}
              internalTemp={tank1InternalTemp}
              externalTemp={tank1ExternalTemp}
              isOnFire={emergency?.type === 'fire' && emergency.affectedTank === 1}
            />
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">Tanque 1</p>
              <p className="text-sm">{tank1Level.toFixed(1)}% lleno</p>
            </div>
          </div>

          {/* Pumping Station */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <PumpingStation isActive={isFlowing || isEqualizing} />
          </div>

          {/* Tank 2 */}
          <div className="w-1/4 relative z-10" onClick={() => setSelectedTank(2)}>
            <Tank 
              level={tank2Level} 
              isEmergency={isEmergencyActive && emergency?.affectedTank === 2}
              internalTemp={tank2InternalTemp}
              externalTemp={tank2ExternalTemp}
              isOnFire={emergency?.type === 'fire' && emergency.affectedTank === 2}
            />
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">Tanque 2</p>
              <p className="text-sm">{tank2Level.toFixed(1)}% lleno</p>
            </div>
          </div>
        </div>

        {/* Tank Details Modal */}
        {selectedTank && (
          <TankDetails
            tankNumber={selectedTank}
            level={selectedTank === 1 ? tank1Level : tank2Level}
            onClose={() => setSelectedTank(null)}
          />
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => transferOil('left')}
            disabled={isFlowing || isEqualizing || tank2Level === 0 || tank1Level === maxCapacity || isEmergencyActive || !valve1Open || !valve2Open}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <ArrowLeft className="w-5 h-5" />
            Transferir ←
          </button>
          <button
            onClick={() => transferOil('right')}
            disabled={isFlowing || isEqualizing || tank1Level === 0 || tank2Level === maxCapacity || isEmergencyActive || !valve1Open || !valve2Open}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <ArrowRight className="w-5 h-5" />
            Transferir →
          </button>
          <button
            onClick={equalizeOil}
            disabled={isFlowing || isEqualizing || isEmergencyActive || !valve1Open || !valve2Open}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <ArrowLeftRight className="w-5 h-5" />
            Equalizar
          </button>
          <button
            onClick={stopFlow}
            disabled={!isFlowing && !isEqualizing}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <XCircle className="w-5 h-5" />
            Detener
          </button>
          <button
            onClick={triggerRandomEmergency}
            disabled={isEmergencyActive}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <AlertTriangle className="w-5 h-5" />
            Simulacro
          </button>
        </div>

        {/* Metrics */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Métricas del Sistema</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Gauge className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Presión</p>
                <p className="font-semibold">{pressure.toFixed(2)} PSI</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplet className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Flujo</p>
                <p className="font-semibold">
                  {flowRate.toFixed(1)} m³/s
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Cylinder className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Volumen Total</p>
                <p className="font-semibold">{(tank1Level + tank2Level).toFixed(1)} m³</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;