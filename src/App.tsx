import React, { useState } from 'react';
import { 
  Camera, QrCode, Skull, Activity, Syringe, Bug, 
  MessageSquare, Baby, CheckCircle2, Clock, X, 
  ChevronRight, Stethoscope, Wifi, MapPin, Network, 
  CalendarDays, Settings, Plus, ArrowRight, History
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

// --- MOCK DATA ---
const animalData = {
  id: "#333018",
  name: "Corazón",
  type: "Vaca lechera",
  breed: "Carora-Jersey",
  sex: "Hembra",
  age: "4 años, 11 meses",
  category: "Vaca",
  lot: "Lote Alta Producción",
  paddock: "Potrero 4",
  bodyCondition: "3.5 / 5.0",
  photo: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2070&auto=format&fit=crop",
  tracking: { deviceId: "Halter HL-90X", isOnline: true, location: "Potrero 4" },
  genetics: { father: "Toro #992 (Carora)", mother: "Vaca #110 (Jersey)" }
};

const productionData = [
  { month: 'Ene', liters: 18 }, { month: 'Feb', liters: 22 },
  { month: 'Mar', liters: 25 }, { month: 'Abr', liters: 24 },
  { month: 'May', liters: 21 }, { month: 'Jun', liters: 19 },
];

const mockHerd = Array.from({ length: 40 }).map((_, i) => ({
  id: `V-${1000 + i}`, potrero: `Potrero ${Math.floor(Math.random() * 4) + 1}`,
  x: Math.random() * 80 + 10, y: Math.random() * 80 + 10,
}));

// --- COMPONENTES UI BASE ---
const Badge = ({ children, variant = 'default', className }: any) => {
  const variants = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={cn("px-2.5 py-1 border rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1", variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
};

const Button = ({ children, className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: "bg-[#e65100] hover:bg-[#ef6c00] text-white shadow-sm border-[#e65100]",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 border-transparent",
  };
  return (
    <button className={cn("px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 border active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none", variants[variant as keyof typeof variants], className)} {...props}>
      {children}
    </button>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [isGraphExpanded, setIsGraphExpanded] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Estados Dinámicos
  const [deathRecord, setDeathRecord] = useState<any>(null);
  const [showAllHerd, setShowAllHerd] = useState(false);
  const [bathRequested, setBathRequested] = useState(false);

  // Estado de Vacunas (Lógica Multidosis)
  const [vaccines, setVaccines] = useState([
    { id: 1, name: "Fiebre Aftosa", dose: "1ra Dosis", planned: "05/01/2024", actual: "05/01/2024", status: "Aplicada", type: "success" },
    { id: 2, name: "Fiebre Aftosa", dose: "Refuerzo", planned: "05/07/2024", actual: "-", status: "Pendiente", type: "warning" },
    { id: 3, name: "Clostridial", dose: "Única", planned: "10/10/2023", actual: "15/10/2023", status: "Aplicada", type: "success" }
  ]);

  const applyVaccine = (id: number, name: string) => {
    // Marca como aplicada y genera la siguiente dosis a los 6 meses (Simulación)
    setVaccines(prev => prev.map(v => v.id === id ? { ...v, actual: new Date().toLocaleDateString(), status: "Aplicada", type: "success" } : v));
    setTimeout(() => {
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 6);
      setVaccines(prev => [...prev, { 
        id: Date.now(), name, dose: "Siguiente Dosis", planned: nextDate.toLocaleDateString(), actual: "-", status: "Proyectado", type: "info" 
      }]);
    }, 500);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f4f5f7] text-gray-800 font-sans selection:bg-[#ffcc80]">
      
      {/* =========================================
          PANEL IZQUIERDO: CABECERA (NO CONTRAÍDA)
          ========================================= */}
      <aside className="w-[340px] h-full bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 shadow-lg overflow-y-auto custom-scrollbar">
        <div className="h-64 w-full relative shrink-0 bg-gray-900 group cursor-pointer" onClick={() => setActiveModal('photo')}>
          <img src={animalData.photo} alt="Vaca" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {!deathRecord ? (
              <Badge variant="success" className="bg-green-500/90 text-white border-none shadow-md"><CheckCircle2 className="w-3 h-3" /> Activa / Sana</Badge>
            ) : (
              <Badge variant="danger" className="bg-red-500/90 text-white border-none shadow-md animate-pulse"><Skull className="w-3 h-3" /> Baja</Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-1">{animalData.name}</p>
            <h1 className="text-4xl font-black drop-shadow-md leading-none">{animalData.id}</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-5">
          {/* Tracking Wizard */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200">
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID Seguimiento</span>
                <span className="text-sm font-bold text-gray-800">{animalData.tracking.deviceId}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setActiveModal('mapa')} className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-[#e65100] hover:border-[#e65100] transition-colors"><MapPin className="w-4 h-4" /></button>
              <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-[#e65100] hover:border-[#e65100] transition-colors"><Settings className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Datos Maestros */}
          <div className="grid grid-cols-2 gap-3 mb-6 shrink-0">
            {[
              { l: "Raza", v: animalData.breed }, { l: "Sexo", v: animalData.sex },
              { l: "Edad", v: animalData.age }, { l: "Categoría", v: animalData.category },
              { l: "Lote", v: animalData.lot }, { l: "C. Corporal", v: animalData.bodyCondition },
            ].map((item, i) => (
              <div key={i} className="flex flex-col border-b border-gray-100 pb-2">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">{item.l}</span>
                <span className="text-sm font-semibold text-gray-800">{item.v}</span>
              </div>
            ))}
          </div>

          {/* Genética Base */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-3 flex items-center gap-1"><Network className="w-3 h-3"/> Registro Genético</h4>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 text-sm font-bold border border-gray-200 shadow-sm">♂</span>
                <div className="flex flex-col"><span className="text-[10px] text-gray-400 font-bold uppercase">Padre</span><span className="text-sm font-bold text-gray-800">{animalData.genetics.father}</span></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 text-sm font-bold border border-gray-200 shadow-sm">♀</span>
                <div className="flex flex-col"><span className="text-[10px] text-gray-400 font-bold uppercase">Madre</span><span className="text-sm font-bold text-gray-800">{animalData.genetics.mother}</span></div>
              </div>
            </div>
            <Button variant="secondary" className="w-full text-xs" onClick={() => setActiveModal('arbol')}>Ver Árbol Completo</Button>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-2 shrink-0 border-t border-gray-200">
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1"><Camera className="w-4 h-4" /> Foto</Button>
              <Button variant="secondary" className="flex-1"><QrCode className="w-4 h-4" /> QR</Button>
            </div>
            <Button variant="danger" className="w-full" onClick={() => setActiveModal('baja')}><Skull className="w-4 h-4" /> Registrar Baja</Button>
          </div>
        </div>
      </aside>

      {/* =========================================
          PANEL CENTRAL: OPERACIONES (AJUSTE DINÁMICO 1 o 2 COLUMNAS)
          ========================================= */}
      <main className="flex-1 h-full overflow-y-auto p-6 lg:p-8 relative custom-scrollbar">
        <div className="max-w-[1400px] mx-auto w-full space-y-6">
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              Panel Operativo
            </h2>
          </div>

          {/* LA MAGIA DEL GRID: Si la gráfica está cerrada, usa 2 columnas; si está abierta, usa 1 o 2 dependiendo del tamaño de pantalla */}
          <div className={cn("grid gap-6 items-start", isGraphExpanded ? "grid-cols-1 2xl:grid-cols-2" : "grid-cols-1 lg:grid-cols-2")}>

            {/* --- 1. EMBARAZO ACTIVO (SEPARADO Y DESTACADO) --- */}
            <div className={cn("bg-white border border-[#ffcc80] rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden", !isGraphExpanded && "lg:col-span-2")}>
              <div className="absolute top-0 right-0 bg-[#fff3e0] text-[#e65100] text-[10px] font-bold px-4 py-1.5 rounded-bl-xl border-b border-l border-[#ffcc80] uppercase tracking-wider">
                Gestación Activa
              </div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Baby className="w-5 h-5 text-[#e65100]" /> Seguimiento Actual</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-6">
                <div className="hidden md:block absolute top-6 left-16 right-16 h-0.5 bg-gray-200 z-0"></div>
                <div className="relative z-10 flex flex-col items-center text-center bg-white">
                  <div className="w-12 h-12 bg-green-50 rounded-full border-4 border-white flex items-center justify-center text-green-600 mb-2"><CheckCircle2 className="w-6 h-6" /></div>
                  <p className="text-xs font-bold text-gray-800">Servicio / IA</p>
                  <p className="text-[10px] text-gray-500">Padre: Toro #88</p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center bg-white">
                  <div className="w-12 h-12 bg-[#fff3e0] rounded-full border-4 border-white flex items-center justify-center text-[#e65100] mb-2"><Stethoscope className="w-6 h-6" /></div>
                  <p className="text-xs font-bold text-gray-800">Palpación</p>
                  <p className="text-[10px] font-bold text-[#e65100]">Preñada (45d)</p>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center bg-white">
                  <div className="w-12 h-12 bg-gray-100 rounded-full border-4 border-white flex items-center justify-center text-gray-400 mb-2"><Baby className="w-5 h-5" /></div>
                  <p className="text-xs font-bold text-gray-800">Parto (Estimado)</p>
                  <p className="text-[10px] font-bold text-gray-600">20/06/2024</p>
                </div>
              </div>
              <div className="flex gap-3 mt-auto">
                <Button variant="secondary" className="flex-1" onClick={() => setActiveModal('palpacion')}><Stethoscope className="w-4 h-4" /> Palpación</Button>
                <Button className="flex-1" onClick={() => setActiveModal('parto')}><Baby className="w-4 h-4" /> Registrar Parto</Button>
              </div>
            </div>

            {/* --- 2. HISTORIAL DE REPRODUCCIÓN (PASADO) --- */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4"><History className="w-4 h-4 text-gray-400" /> Historial de Preñeces</h3>
              <div className="space-y-3 overflow-y-auto pr-2 flex-1 max-h-[250px] custom-scrollbar">
                
                {/* Hijo con Padre */}
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="success">Parto Exitoso</Badge>
                      <span className="text-xs font-bold text-gray-800">20/05/2022</span>
                    </div>
                    <p className="text-sm text-gray-700">Cría: <span className="font-bold">Macho #442</span></p>
                    <p className="text-[10px] text-gray-500 uppercase mt-1">Padre de la cría: <span className="font-bold text-[#e65100]">Toro #992</span></p>
                  </div>
                  <Button variant="ghost" className="p-2 h-auto"><ArrowRight className="w-4 h-4"/></Button>
                </div>

                {/* Aborto */}
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="danger">Aborto</Badge>
                      <span className="text-xs font-bold text-gray-800">05/06/2020</span>
                    </div>
                    <p className="text-sm text-gray-700">Interrupción a los 4 meses</p>
                    <p className="text-[10px] text-gray-500 uppercase mt-1">Padre asignado: <span className="font-bold text-[#e65100]">Toro #15</span></p>
                  </div>
                </div>

              </div>
            </div>

            {/* --- 3. PLAN DE VACUNACIÓN (LÓGICA MULTIDOSIS) --- */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Syringe className="w-5 h-5 text-blue-500" /> Plan de Vacunación</h3>
                <Button variant="secondary" className="text-xs py-1.5" onClick={() => setActiveModal('vacuna')}><Plus className="w-4 h-4"/> Agendar</Button>
              </div>
              <div className="flex-1 flex flex-col rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b border-gray-200">
                  <div className="col-span-5 text-[10px] font-bold text-gray-500 uppercase">Vacuna / Dosis</div>
                  <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase text-center">Planificado</div>
                  <div className="col-span-4 text-[10px] font-bold text-gray-500 uppercase text-right">Estado</div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {vaccines.map((v) => (
                    <div key={v.id} className="grid grid-cols-12 gap-2 items-center p-3 border-b border-gray-100 last:border-0 bg-white hover:bg-gray-50">
                      <div className="col-span-5">
                        <p className="text-xs font-bold text-gray-800">{v.name}</p>
                        <p className="text-[10px] text-gray-500">{v.dose}</p>
                      </div>
                      <div className="col-span-3 text-xs font-medium text-gray-600 text-center">{v.planned}</div>
                      <div className="col-span-4 flex justify-end">
                        {v.status === 'Pendiente' || v.status === 'Proyectado' ? (
                          <button onClick={() => applyVaccine(v.id, v.name)} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 border border-blue-200 transition-colors">
                            Aplicar
                          </button>
                        ) : (
                          <Badge variant={v.type}>{v.actual}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- 4. CONTROL ANTIPARASITARIO --- */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Bug className="w-5 h-5 text-purple-500" /> Antiparasitario</h3>
                <Button variant="secondary" className="text-xs py-1.5" onClick={() => setActiveModal('parasito')}><Plus className="w-4 h-4"/> Agendar</Button>
              </div>
              <div className="flex-1 flex flex-col rounded-xl border border-gray-200 overflow-hidden mb-4">
                 <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b border-gray-200">
                  <div className="col-span-6 text-[10px] font-bold text-gray-500 uppercase">Tratamiento</div>
                  <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase text-center">Planificado</div>
                  <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase text-right">Estado</div>
                </div>
                <div className="p-3 border-b border-gray-100 bg-white flex items-center">
                   <div className="w-1/2"><p className="text-xs font-bold">Baño Aspersión</p><p className="text-[10px] text-gray-500">Amitraz</p></div>
                   <div className="w-1/4 text-xs text-center text-gray-600">12/11/23</div>
                   <div className="w-1/4 text-right"><Badge variant="success">Listo</Badge></div>
                </div>
                <div className="p-3 bg-white flex items-center">
                   <div className="w-1/2"><p className="text-xs font-bold">Desparasitante</p><p className="text-[10px] text-gray-500">Ivermectina</p></div>
                   <div className="w-1/4 text-xs text-center text-gray-600">01/05/24</div>
                   <div className="w-1/4 text-right"><Badge variant="warning">Pendiente</Badge></div>
                </div>
              </div>
              <Button variant={bathRequested ? "secondary" : "primary"} className="w-full" onClick={() => setBathRequested(true)}>
                {bathRequested ? "Orden Global Generada" : "Ejecutar Baño Inmediato"}
              </Button>
            </div>

            {/* --- 5. BITÁCORA --- */}
            <div className={cn("bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col", !isGraphExpanded && "lg:col-span-2")}>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4"><MessageSquare className="w-5 h-5 text-gray-500" /> Bitácora de Novedades</h3>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar min-h-[100px] flex-1">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-[#e65100]">Dr. Ramírez</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 12/03/24</span>
                  </div>
                  <p className="text-sm text-gray-700">Revisión general en manga. Condición corporal óptima.</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <input type="text" placeholder="Escribir observación..." className="flex-1 bg-white border border-gray-300 rounded-lg px-4 text-sm focus:border-[#e65100] outline-none" />
                <Button className="px-4"><Plus className="w-4 h-4" /></Button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* =========================================
          PANEL DERECHO: GRÁFICOS (ALWAYS ON DISPLAY & COLLAPSABLE)
          ========================================= */}
      <aside className={cn(
        "h-full bg-white border-l border-gray-200 transition-all duration-300 ease-in-out flex flex-col shrink-0 z-20 shadow-xl relative",
        isGraphExpanded ? "w-[360px] xl:w-[420px]" : "w-[60px]"
      )}>
        <button 
          onClick={() => setIsGraphExpanded(!isGraphExpanded)} 
          className="absolute -left-4 top-8 w-8 h-12 bg-white border border-gray-200 rounded-l-xl flex items-center justify-center text-gray-400 hover:text-[#e65100] shadow-[-4px_0_10px_rgba(0,0,0,0.05)] z-30"
        >
          <ChevronRight className={cn("w-5 h-5 transition-transform", isGraphExpanded ? "" : "rotate-180")} />
        </button>

        <div className={cn("flex-1 p-6 flex flex-col overflow-hidden transition-opacity duration-300", isGraphExpanded ? "opacity-100" : "opacity-0 invisible")}>
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#e65100]" /> Rendimiento (Leche)
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Promedio</p>
              <p className="text-3xl font-black text-gray-800 mt-1">20.8 <span className="text-xs font-semibold text-gray-500">L/d</span></p>
            </div>
            <div className="bg-[#fff3e0] rounded-xl p-4 border border-[#ffe0b2]">
              <p className="text-[10px] font-bold text-[#e65100] uppercase">Pico</p>
              <p className="text-3xl font-black text-[#e65100] mt-1">25.0 <span className="text-xs font-semibold text-[#e65100]/70">L/d</span></p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e65100" stopOpacity={0.3}/><stop offset="95%" stopColor="#e65100" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="liters" stroke="#e65100" strokeWidth={3} fillOpacity={1} fill="url(#colorLiters)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {!isGraphExpanded && (
          <div className="flex-1 flex justify-center pt-24">
            <span className="whitespace-nowrap -rotate-90 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] h-fit">Analíticas Ocultas</span>
          </div>
        )}
      </aside>

      {/* =========================================
          SISTEMA DE MODALES / WIZARDS
          ========================================= */}
      <AnimatePresence>
        
        {/* WIZARD: MAPA Y SEGUIMIENTO IOT */}
        {activeModal === 'mapa' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-4xl h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Ubicación GPS: {animalData.tracking.deviceId}</h2>
                  <p className="text-xs text-gray-500">Visualización en tiempo real</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <input type="checkbox" checked={showAllHerd} onChange={(e) => setShowAllHerd(e.target.checked)} className="accent-[#e65100] w-4 h-4" />
                    <span className="text-xs font-bold text-gray-600">Ver todo el rebaño</span>
                  </label>
                  <button onClick={closeModal} className="p-2 bg-gray-100 rounded-full text-gray-500"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex-1 bg-[#eef2f5] p-6 relative">
                <div className="absolute inset-6 grid grid-cols-2 grid-rows-2 gap-4">
                  {['Potrero 1', 'Potrero 2', 'Potrero 3', 'Potrero 4'].map((p, i) => (
                    <div key={i} className="bg-[#dce5df] border-2 border-[#b5cbbd] rounded-3xl relative overflow-hidden">
                      <span className="absolute bottom-4 left-4 text-sm font-black text-gray-400 opacity-50 uppercase tracking-widest">{p}</span>
                      {p === animalData.tracking.location && !showAllHerd && (
                        <motion.div className="absolute w-6 h-6 bg-[#e65100] rounded-full border-2 border-white shadow-lg z-20 flex items-center justify-center"
                          initial={{ left: '50%', top: '50%' }} animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }} transition={{ duration: 10, repeat: Infinity }}
                        >
                           <div className="absolute -top-8 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded">{animalData.id}</div>
                        </motion.div>
                      )}
                      {showAllHerd && mockHerd.filter(v => v.potrero === p).map((v) => (
                        <motion.div key={v.id} className={cn("absolute rounded-full border border-white", v.id === animalData.id ? "bg-[#e65100] w-4 h-4 z-20" : "bg-gray-500 w-3 h-3")}
                          style={{ left: `${v.x}%`, top: `${v.y}%` }} animate={{ x: [0, Math.random() * 20 - 10, 0], y: [0, Math.random() * 20 - 10, 0] }} transition={{ duration: 15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL: FORMULARIO PALPACIÓN */}
        {activeModal === 'palpacion' && (
          <GenericFormModal title="Registrar Palpación" icon={Stethoscope} onClose={closeModal}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1">Fecha</label><input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:border-[#e65100] outline-none text-sm" /></div>
              <div className="col-span-2 md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1">Diagnóstico</label><select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:border-[#e65100] outline-none text-sm"><option>Preñada</option><option>Vacía</option></select></div>
              <div className="col-span-2"><label className="block text-xs font-bold text-gray-500 mb-1">Observaciones</label><textarea rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:border-[#e65100] outline-none text-sm resize-none"></textarea></div>
            </div>
            <Button className="w-full mt-6" onClick={closeModal}>Guardar</Button>
          </GenericFormModal>
        )}

        {/* MODAL: FORMULARIO PARTO */}
        {activeModal === 'parto' && (
          <GenericFormModal title="Registrar Parto" icon={Baby} onClose={closeModal}>
             <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-xs font-bold text-gray-500 mb-1">Sexo de la Cría</label><select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:border-[#e65100] outline-none text-sm"><option>Macho</option><option>Hembra</option></select></div>
              <div className="col-span-2 md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1">Peso (Kg)</label><input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:border-[#e65100] outline-none text-sm" /></div>
              <div className="col-span-2 md:col-span-1"><label className="block text-xs font-bold text-gray-500 mb-1">Estado</label><select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:border-[#e65100] outline-none text-sm"><option>Vivo</option><option>Muerto</option></select></div>
            </div>
            <Button className="w-full mt-6" onClick={closeModal}>Generar Arete Hijo</Button>
          </GenericFormModal>
        )}

        {/* MODAL: ÁRBOL GENEALÓGICO */}
        {activeModal === 'arbol' && (
          <GenericFormModal title="Árbol Genealógico" icon={Network} onClose={closeModal}>
            <div className="flex flex-col items-center py-6 gap-6">
              {/* Padres */}
              <div className="flex gap-10">
                <div className="border border-gray-200 p-3 rounded-xl text-center shadow-sm w-36"><p className="text-[10px] text-gray-400 uppercase font-bold">Padre</p><p className="text-sm font-bold">{animalData.genetics.father}</p></div>
                <div className="border border-gray-200 p-3 rounded-xl text-center shadow-sm w-36"><p className="text-[10px] text-gray-400 uppercase font-bold">Madre</p><p className="text-sm font-bold">{animalData.genetics.mother}</p></div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              {/* Animal */}
              <div className="bg-[#e65100] text-white p-4 rounded-xl text-center shadow-md w-48 border-2 border-[#ffcc80]"><p className="text-[10px] uppercase font-bold text-white/80">Animal Actual</p><h3 className="text-2xl font-black">{animalData.id}</h3></div>
              <div className="w-px h-8 bg-gray-300"></div>
              {/* Hijos */}
              <div className="flex gap-6">
                 <div className="border border-green-200 bg-green-50 p-3 rounded-xl text-center shadow-sm w-36"><p className="text-[10px] text-green-600 uppercase font-bold">Hijo</p><p className="text-sm font-bold">Macho #442</p></div>
                 <div className="border border-yellow-200 bg-yellow-50 p-3 rounded-xl text-center shadow-sm w-36"><p className="text-[10px] text-yellow-600 uppercase font-bold">En Gestación</p><p className="text-sm font-bold">Jun 2024</p></div>
              </div>
            </div>
          </GenericFormModal>
        )}

      </AnimatePresence>
    </div>
  );
}

// Componente Wrapper para Formularios
function GenericFormModal({ children, title, icon: Icon, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="bg-gray-50 p-5 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3 text-gray-800"><div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200"><Icon className="w-5 h-5 text-[#e65100]" /></div><h2 className="text-lg font-bold">{title}</h2></div>
          <button onClick={onClose} className="p-2 bg-white border border-gray-200 rounded-full text-gray-500"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </motion.div>
    </div>
  );
}