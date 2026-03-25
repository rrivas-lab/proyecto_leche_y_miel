import React, { useState } from 'react';
import { 
  Camera, QrCode, Skull, Activity, Syringe, Bug, 
  MessageSquare, Baby, CheckCircle2, Clock, X, 
  AlertTriangle, ChevronRight, Stethoscope, Wifi, 
  MapPin, Network, CalendarDays, FileText, ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

// --- MOCK DATA MEJORADA ---
const animalData = {
  id: "#333018",
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
  genetics: {
    father: "Toro #992 (Carora Puro)",
    mother: "Vaca #110 (Jersey Pura)"
  }
};

const pregnancies = [
  {
    id: 3,
    status: "Gestación Activa",
    current: true,
    serviceDate: "15/09/2023",
    father: "Toro #88",
    palpationDate: "10/10/2023",
    palpationResult: "Preñada",
    projectedBirth: "20/06/2024"
  },
  {
    id: 2,
    status: "Parto Exitoso",
    current: false,
    serviceDate: "01/07/2021",
    father: "Toro #992",
    endDate: "20/05/2022",
    resultDetail: "Cría Macho (Arete #442)"
  },
  {
    id: 1,
    status: "Aborto Espontáneo",
    current: false,
    serviceDate: "10/02/2020",
    father: "Toro #15",
    endDate: "05/06/2020",
    resultDetail: "Gestación interrumpida a los 4 meses"
  }
];

const healthPlan = {
  vaccines: [
    { name: "Fiebre Aftosa", planned: "05/01/2024", actual: "05/01/2024", status: "Aplicada", type: "success" },
    { name: "Rabia Silvestre", planned: "15/06/2024", actual: "-", status: "Pendiente", type: "warning" },
    { name: "Clostridial", planned: "10/10/2023", actual: "15/10/2023", status: "Aplicada (Atraso)", type: "info" }
  ],
  parasites: [
    { name: "Baño Aspersión (Amitraz)", planned: "12/11/2023", actual: "12/11/2023", status: "Aplicado", type: "success" },
    { name: "Desparasitante (Ivermectina)", planned: "01/05/2024", actual: "-", status: "Proyectado", type: "warning" }
  ]
};

const productionData = [
  { month: 'Ene', liters: 18 }, { month: 'Feb', liters: 22 },
  { month: 'Mar', liters: 25 }, { month: 'Abr', liters: 24 },
  { month: 'May', liters: 21 }, { month: 'Jun', liters: 19 },
];

// --- COMPONENTES UI ---
const Badge = ({ children, variant = 'default', className }: any) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={cn("px-2 py-0.5 border rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1", variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
};

const Button = ({ children, className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-amber-600/50",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border-slate-300",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
  };
  return (
    <button className={cn("px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none", variants[variant as keyof typeof variants], className)} {...props}>
      {children}
    </button>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  
  // Estados de Modales (Procesos)
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f8fafc] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* =========================================
          PANEL IZQUIERDO: CABECERA Y GENÉTICA
          ========================================= */}
      <aside className="w-[300px] xl:w-[320px] h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-xl overflow-y-auto custom-scrollbar">
        <div className="h-48 w-full relative shrink-0 bg-slate-900">
          <img src={animalData.photo} alt="Vaca" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Activa / Sana</Badge>
          </div>
          <div className="absolute bottom-3 left-3 text-white">
            <h1 className="text-3xl font-black drop-shadow-md">{animalData.id}</h1>
            <p className="text-sm font-medium opacity-90">{animalData.type}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4">
          
          {/* Tracking */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200">
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">GPS Tracker</span>
                <span className="text-xs font-bold text-slate-700 leading-tight">{animalData.tracking.deviceId}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md cursor-pointer hover:bg-amber-100 transition-colors">
              <MapPin className="w-3 h-3" />
            </div>
          </div>

          {/* Datos Maestros */}
          <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
            {[
              { l: "Raza", v: animalData.breed }, { l: "Sexo", v: animalData.sex },
              { l: "Edad", v: animalData.age }, { l: "Categoría", v: animalData.category },
              { l: "Lote", v: animalData.lot }, { l: "C. Corporal", v: animalData.bodyCondition },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-lg px-2 py-1.5 flex flex-col justify-center shadow-sm">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{item.l}</span>
                <span className="text-xs font-bold text-slate-800 truncate">{item.v}</span>
              </div>
            ))}
          </div>

          {/* GENÉTICA TRASLADADA A CABECERA */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
            <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-2 flex items-center gap-1"><Network className="w-3 h-3"/> Registro Genético</h4>
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold border border-slate-200">♂</span>
                <div className="flex flex-col"><span className="text-[9px] text-slate-400 font-bold uppercase">Padre</span><span className="text-xs font-bold text-slate-700">{animalData.genetics.father}</span></div>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold border border-slate-200">♀</span>
                <div className="flex flex-col"><span className="text-[9px] text-slate-400 font-bold uppercase">Madre</span><span className="text-xs font-bold text-slate-700">{animalData.genetics.mother}</span></div>
              </div>
            </div>
            <Button variant="secondary" className="w-full text-xs py-2 bg-white" onClick={() => setActiveModal('arbol')}>
              <Network className="w-4 h-4 text-amber-500" /> Ver Árbol Genealógico
            </Button>
          </div>

          <div className="mt-auto flex flex-col gap-2 shrink-0 border-t border-slate-100 pt-3">
            <Button variant="danger" className="w-full py-2 text-xs" onClick={() => setActiveModal('baja')}>
              <Skull className="w-4 h-4" /> Registrar Baja
            </Button>
          </div>
        </div>
      </aside>

      {/* =========================================
          PANEL CENTRAL: OPERACIONES Y PROCESOS
          ========================================= */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 relative custom-scrollbar bg-slate-100/50">
        <div className="max-w-6xl mx-auto w-full space-y-6">
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-amber-500" /> Panel Operativo
            </h2>
          </div>

          <div className={cn("grid gap-6", isGraphExpanded ? "grid-cols-1" : "grid-cols-1 2xl:grid-cols-2")}>

            {/* --- REPRODUCCIÓN (LISTA HISTÓRICA COMPLETA) --- */}
            <div className={cn("bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col", isGraphExpanded ? "" : "2xl:col-span-2")}>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Baby className="w-5 h-5 text-amber-500" /> Seguimiento Reproductivo</h3>
                <div className="flex gap-2">
                  <Button variant="secondary" className="text-xs py-1.5" onClick={() => setActiveModal('palpacion')}><Stethoscope className="w-4 h-4" /> Registrar Palpación</Button>
                  <Button className="text-xs py-1.5" onClick={() => setActiveModal('parto')}><Baby className="w-4 h-4" /> Iniciar Parto</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {pregnancies.map((preg) => (
                  <div key={preg.id} className={cn("rounded-2xl border transition-all", preg.current ? "bg-amber-50/30 border-amber-200 shadow-sm" : "bg-slate-50/50 border-slate-200")}>
                    
                    {/* Header del Registro */}
                    <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", preg.current ? "bg-amber-500 animate-pulse" : preg.status === "Aborto Espontáneo" ? "bg-red-500" : "bg-emerald-500")} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{preg.status}</p>
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            Servicio: {preg.serviceDate} | Padre: <span className="text-amber-600">{preg.father}</span>
                          </p>
                        </div>
                      </div>
                      {!preg.current && (
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-700">{preg.resultDetail}</p>
                          <p className="text-[10px] font-semibold text-slate-500">Fin: {preg.endDate}</p>
                        </div>
                      )}
                    </div>

                    {/* Timeline si es el actual */}
                    {preg.current && (
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between relative gap-6 md:gap-0">
                          <div className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-amber-200 z-0"></div>

                          <div className="relative z-10 flex flex-col items-center text-center bg-white p-2 rounded-xl">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full border-4 border-white flex items-center justify-center text-emerald-600 shadow-sm mb-2">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-800">Servicio Confirmado</p>
                            <p className="text-[10px] text-slate-500">{preg.serviceDate}</p>
                          </div>

                          <div className="relative z-10 flex flex-col items-center text-center bg-white p-2 rounded-xl">
                            <div className="w-12 h-12 bg-amber-100 rounded-full border-4 border-white flex items-center justify-center text-amber-600 shadow-sm mb-2">
                              <Stethoscope className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-800">Palpación</p>
                            <p className="text-[10px] font-bold text-amber-600">{preg.palpationResult}</p>
                            <p className="text-[10px] text-slate-500">{preg.palpationDate}</p>
                          </div>

                          <div className="relative z-10 flex flex-col items-center text-center bg-white p-2 rounded-xl">
                            <div className="w-12 h-12 bg-slate-100 rounded-full border-4 border-white flex items-center justify-center text-slate-400 shadow-sm mb-2">
                              <Baby className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-slate-800">Parto Proyectado</p>
                            <p className="text-[10px] font-bold text-slate-600">Aprox. {preg.projectedBirth}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* --- PLAN DE VACUNACIÓN (PLANIFICADO VS REAL) --- */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Syringe className="w-5 h-5 text-emerald-500" /> Plan de Vacunación</h3>
                <Button variant="ghost" className="text-xs py-1.5 border border-slate-200" onClick={() => setActiveModal('vacuna')}>
                  Nueva Vacuna
                </Button>
              </div>
              
              <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 border-b border-slate-200">
                  <div className="col-span-5 text-[10px] font-bold text-slate-500 uppercase">Tratamiento</div>
                  <div className="col-span-3 text-[10px] font-bold text-slate-500 uppercase text-center">Planificado</div>
                  <div className="col-span-4 text-[10px] font-bold text-slate-500 uppercase text-right">Real / Estado</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {healthPlan.vaccines.map((v, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="col-span-5 text-xs font-bold text-slate-800">{v.name}</div>
                      <div className="col-span-3 text-xs font-medium text-slate-500 text-center">{v.planned}</div>
                      <div className="col-span-4 text-right flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-slate-700">{v.actual}</span>
                        <Badge variant={v.type}>{v.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- CONTROL ANTIPARASITARIO (PLANIFICADO VS REAL) --- */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Bug className="w-5 h-5 text-purple-500" /> Control Antiparasitario</h3>
                <Button variant="ghost" className="text-xs py-1.5 border border-slate-200" onClick={() => setActiveModal('parasito')}>
                  Registrar Baño
                </Button>
              </div>
              
              <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 border-b border-slate-200">
                  <div className="col-span-5 text-[10px] font-bold text-slate-500 uppercase">Tratamiento</div>
                  <div className="col-span-3 text-[10px] font-bold text-slate-500 uppercase text-center">Planificado</div>
                  <div className="col-span-4 text-[10px] font-bold text-slate-500 uppercase text-right">Real / Estado</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {healthPlan.parasites.map((p, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="col-span-5 text-xs font-bold text-slate-800">{p.name}</div>
                      <div className="col-span-3 text-xs font-medium text-slate-500 text-center">{p.planned}</div>
                      <div className="col-span-4 text-right flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-slate-700">{p.actual}</span>
                        <Badge variant={p.type}>{p.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* =========================================
          PANEL DERECHO: GRÁFICOS COLAPSABLES
          ========================================= */}
      <aside className={cn(
        "h-full bg-white border-l border-slate-200 transition-all duration-500 ease-in-out flex flex-col shrink-0 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] z-20",
        isGraphExpanded ? "w-[380px] xl:w-[450px]" : "w-[60px]"
      )}>
        <button onClick={() => setIsGraphExpanded(!isGraphExpanded)} className="w-full h-16 flex items-center justify-center border-b border-slate-100 hover:bg-slate-50 transition-colors text-slate-400 hover:text-amber-500 bg-white">
          <ChevronRight className={cn("w-6 h-6 transition-transform duration-500", isGraphExpanded ? "" : "rotate-180")} />
        </button>

        <div className={cn("flex-1 overflow-y-auto p-6 flex flex-col transition-opacity duration-300", isGraphExpanded ? "opacity-100 delay-200" : "opacity-0 hidden")}>
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" /> Rendimiento (Leche)
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Promedio Producción</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">20.8 <span className="text-xs font-semibold text-slate-500">L/día</span></p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="liters" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLiters)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {!isGraphExpanded && (
          <div className="flex-1 flex justify-center mt-10">
            <span className="whitespace-nowrap -rotate-90 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] h-fit">Analíticas Producción</span>
          </div>
        )}
      </aside>

      {/* =========================================
          SISTEMA DE MODALES (WIZARDS OPERATIVOS)
          ========================================= */}
      <AnimatePresence>
        
        {/* MODAL: ÁRBOL GENEALÓGICO */}
        {activeModal === 'arbol' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#f8fafc] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-white p-6 flex justify-between items-center border-b border-slate-200 z-10">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Network className="w-6 h-6 text-amber-500"/> Ramificación Genética</h2>
                <button onClick={closeModal} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 flex flex-col items-center gap-8 custom-scrollbar relative">
                
                {/* Generación Anterior (Abuelos) */}
                <div className="flex gap-16 w-full justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm w-40 text-center relative after:absolute after:w-px after:h-8 after:bg-slate-300 after:-bottom-8 after:left-1/2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Abuelo Paterno</p>
                      <p className="text-sm font-bold text-slate-700">Toro #01</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm w-40 text-center relative after:absolute after:w-px after:h-8 after:bg-slate-300 after:-bottom-8 after:left-1/2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Abuela Paterna</p>
                      <p className="text-sm font-bold text-slate-700">Vaca #45</p>
                    </div>
                  </div>
                </div>

                {/* Padres */}
                <div className="flex gap-24 w-full justify-center relative">
                  <div className="absolute top-0 w-80 h-px bg-slate-300 -z-10"></div>
                  <div className="bg-white border-2 border-slate-300 p-4 rounded-2xl shadow-sm w-48 text-center relative after:absolute after:w-px after:h-8 after:bg-amber-400 after:-bottom-8 after:left-1/2 before:absolute before:w-px before:h-8 before:bg-slate-300 before:-top-8 before:left-1/2">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-2 text-sm font-bold">♂</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Padre</p>
                    <p className="text-sm font-bold text-slate-800">{animalData.genetics.father}</p>
                  </div>
                  <div className="bg-white border-2 border-slate-300 p-4 rounded-2xl shadow-sm w-48 text-center relative after:absolute after:w-px after:h-8 after:bg-amber-400 after:-bottom-8 after:left-1/2 before:absolute before:w-px before:h-8 before:bg-slate-300 before:-top-8 before:left-1/2">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-2 text-sm font-bold">♀</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Madre</p>
                    <p className="text-sm font-bold text-slate-800">{animalData.genetics.mother}</p>
                  </div>
                </div>

                {/* Animal Actual */}
                <div className="relative">
                  <div className="absolute -top-8 w-64 h-px bg-amber-400 left-1/2 -translate-x-1/2"></div>
                  <div className="bg-amber-500 text-white p-5 rounded-[2rem] shadow-xl w-64 text-center border-4 border-white relative after:absolute after:w-px after:h-12 after:bg-slate-300 after:-bottom-12 after:left-1/2">
                    <p className="text-xs font-bold text-amber-100 uppercase tracking-widest mb-1">Animal Actual</p>
                    <h3 className="text-3xl font-black drop-shadow-sm">{animalData.id}</h3>
                    <p className="text-sm font-medium">{animalData.type}</p>
                  </div>
                </div>

                {/* Descendencia */}
                <div className="flex gap-8 w-full justify-center relative mt-4">
                  <div className="absolute -top-4 w-48 h-px bg-slate-300"></div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm w-40 text-center relative before:absolute before:w-px before:h-4 before:bg-slate-300 before:-top-4 before:left-1/2 hover:border-amber-400 cursor-pointer transition-colors">
                    <Badge variant="success" className="mb-2">Activo</Badge>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Hijo (2022)</p>
                    <p className="text-sm font-bold text-slate-800">Macho #442</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm w-40 text-center relative before:absolute before:w-px before:h-4 before:bg-slate-300 before:-top-4 before:left-1/2 hover:border-amber-400 cursor-pointer transition-colors">
                    <Badge variant="warning" className="mb-2">Gestación</Badge>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Proyectado</p>
                    <p className="text-sm font-bold text-slate-800">Junio 2024</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL: FORMULARIO PALPACIÓN */}
        {activeModal === 'palpacion' && (
          <GenericFormModal title="Proceso: Registro de Palpación" icon={Stethoscope} onClose={closeModal}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fecha de Palpación</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Diagnóstico / Estado</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700">
                  <option>Preñada</option>
                  <option>Vacía</option>
                  <option>Reabsorción</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Días Estimados de Gestación</label>
                <input type="number" placeholder="Ej. 45" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Observaciones Clínicas</label>
                <textarea rows={3} placeholder="Condición corporal, anomalías..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none resize-none text-sm text-slate-700"></textarea>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={closeModal}>Guardar Registro Reproductivo</Button>
          </GenericFormModal>
        )}

        {/* MODAL: FORMULARIO PARTO */}
        {activeModal === 'parto' && (
          <GenericFormModal title="Proceso: Registro de Parto (Nueva Cría)" icon={Baby} onClose={closeModal}>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-xs text-amber-800 font-medium">
              Al guardar este formulario, se creará automáticamente un nuevo arete en el sistema de inventario atado a esta madre.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo de Parto</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700">
                  <option>Normal (Eutócico)</option>
                  <option>Con Ayuda (Distócico)</option>
                  <option>Gemelar</option>
                  <option>Aborto</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sexo de la Cría</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700">
                  <option>Macho</option>
                  <option>Hembra</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Peso al Nacer (Kg)</label>
                <input type="number" placeholder="Ej. 35" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Estado de la Cría</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700">
                  <option>Vivo y Sano</option>
                  <option>Débil</option>
                  <option>Nacido Muerto</option>
                </select>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={closeModal}>Registrar Parto y Dar de Alta Arete</Button>
          </GenericFormModal>
        )}

        {/* MODAL: FORMULARIO VACUNA */}
        {activeModal === 'vacuna' && (
          <GenericFormModal title="Control Sanitario: Vacunación" icon={Syringe} onClose={closeModal}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo de Vacuna</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700">
                  <option>Fiebre Aftosa</option>
                  <option>Rabia Silvestre</option>
                  <option>Clostridial (Excell-10)</option>
                  <option>Brucelosis (RV-51)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fecha Aplicada</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lote / Producto</label>
                  <input type="text" placeholder="Ej. Lote-55X" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Próxima Aplicación (Planificación)</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
              </div>
            </div>
            <Button className="w-full mt-6" onClick={closeModal}>Guardar Registro de Vacuna</Button>
          </GenericFormModal>
        )}

        {/* MODAL: FORMULARIO ANTIPARASITARIO */}
        {activeModal === 'parasito' && (
          <GenericFormModal title="Control Sanitario: Antiparasitario" icon={Bug} onClose={closeModal}>
             <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Método de Aplicación</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700">
                  <option>Baño de Aspersión Dorsal</option>
                  <option>Baño de Inmersión</option>
                  <option>Inyectado (Endectocida)</option>
                  <option>Oral</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Producto Utilizado</label>
                <input type="text" placeholder="Ej. Amitraz 12.5% o Ivermectina 1%" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fecha Realizada</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Próxima Dosis</label>
                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-amber-500 outline-none text-sm font-medium text-slate-700" />
                </div>
              </div>
            </div>
            <Button className="w-full mt-6" onClick={closeModal}>Registrar Tratamiento</Button>
          </GenericFormModal>
        )}

      </AnimatePresence>
    </div>
  );
}

// Componente helper para modales con formularios
function GenericFormModal({ children, title, icon: Icon, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 p-6 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3 text-slate-800 font-black">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Icon className="w-6 h-6" /></div>
            <h2 className="text-xl">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
}