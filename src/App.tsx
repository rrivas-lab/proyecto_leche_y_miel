import React, { useState } from 'react';
import { 
  Camera, QrCode, Skull, Activity, Syringe, Bug, 
  MessageSquare, Baby, GitMerge, CheckCircle2, Clock, X, 
  AlertTriangle, ChevronDown, Stethoscope, Link as LinkIcon, 
  Wifi, Send, MapPin, ChevronLeft, ChevronRight, History, Info
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

// --- MOCK DATA ---
const animalData = {
  id: "#333018",
  type: "Vaca lechera",
  breed: "Carora-Jersey",
  color: "Castaño Claro",
  sex: "Hembra",
  dob: "12/04/2019",
  age: "4 años, 11 meses",
  category: "Vaca",
  lot: "Lote Alta Producción",
  paddock: "Potrero 4 (Bermuda)",
  origin: "Nacida en Finca",
  bodyCondition: "3.5 / 5.0",
  photo: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2070&auto=format&fit=crop",
  tracking: {
    deviceId: "Halter HL-90X",
    isOnline: true,
    location: "Potrero 4"
  }
};

const productionData = [
  { month: 'Ene', liters: 18 }, { month: 'Feb', liters: 22 },
  { month: 'Mar', liters: 25 }, { month: 'Abr', liters: 24 },
  { month: 'May', liters: 21 }, { month: 'Jun', liters: 19 },
  { month: 'Jul', liters: 17 },
];

const mockHerd = Array.from({ length: 40 }).map((_, i) => ({
  id: `V-${1000 + i}`,
  potrero: `Potrero ${Math.floor(Math.random() * 4) + 1}`,
  x: Math.random() * 80 + 10,
  y: Math.random() * 80 + 10,
}));

// --- UI COMPONENTS ---
const Badge = ({ children, variant = 'default', className }: any) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
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
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 border-transparent",
  };
  return (
    <button className={cn("px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none", variants[variant as keyof typeof variants], className)} {...props}>
      {children}
    </button>
  );
};

// --- MAIN APP ---
export default function App() {
  // States
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const [isDeathModalOpen, setIsDeathModalOpen] = useState(false);
  const [deathRecord, setDeathRecord] = useState<{ cause: string, obs: string, date: string } | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showAllHerd, setShowAllHerd] = useState(false);
  const [historyModal, setHistoryModal] = useState<{ isOpen: boolean, title: string, data: any[] }>({ isOpen: false, title: '', data: [] });

  // Registro Baja
  const handleDeathRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setDeathRecord({
      cause: formData.get('cause') as string,
      obs: formData.get('obs') as string,
      date: new Date().toLocaleDateString()
    });
    setIsDeathModalOpen(false);
  };

  // Historial Mock Data Launcher
  const openHistory = (type: string) => {
    let data: any[] = [];
    let title = "";
    if (type === 'repro') {
      title = "Historial Reproductivo";
      data = [
        { date: "10/10/2023", event: "Palpación", detail: "Preñada - 100 días", status: "success" },
        { date: "20/05/2022", event: "Parto", detail: "Cría Macho (Arete #442)", status: "info" },
        { date: "10/02/2022", event: "Servicio", detail: "Inseminación Artificial (Toro #992)", status: "default" }
      ];
    } else if (type === 'sanidad') {
      title = "Historial Sanitario";
      data = [
        { date: "05/01/2024", event: "Vacunación", detail: "Fiebre Aftosa (Lote 45)", status: "success" },
        { date: "12/11/2023", event: "Baño Garrapaticida", detail: "Aspersión Dorsal", status: "success" },
        { date: "15/06/2023", event: "Vacunación", detail: "Rabia Silvestre", status: "success" }
      ];
    }
    setHistoryModal({ isOpen: true, title, data });
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 text-slate-800 font-sans">
      
      {/* =========================================
          PANEL IZQUIERDO: CABECERA CONDENSADA (NO SCROLL)
          ========================================= */}
      <aside className="w-[300px] xl:w-[340px] h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-xl">
        {/* Foto Condensada */}
        <div className="h-48 w-full relative shrink-0 bg-slate-900">
          <img src={animalData.photo} alt="Vaca" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {!deathRecord ? (
              <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Activo / Sano</Badge>
            ) : (
              <Badge variant="danger" className="animate-pulse"><Skull className="w-3 h-3" /> Animal de Baja</Badge>
            )}
          </div>
          {/* Info Principal sobre la foto */}
          <div className="absolute bottom-3 left-3 text-white">
            <h1 className="text-3xl font-black drop-shadow-md">{animalData.id}</h1>
            <p className="text-sm font-medium opacity-90">{animalData.type}</p>
          </div>
        </div>

        {/* Data Condensada */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          
          {/* Si está muerto, mostrar banner rojo fijo */}
          {deathRecord && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 shrink-0">
              <p className="text-xs font-bold text-red-700 uppercase mb-1">Causa de Baja: {deathRecord.cause}</p>
              <p className="text-xs text-red-600 leading-tight">{deathRecord.obs}</p>
              <p className="text-[10px] text-red-400 mt-2">Registrado: {deathRecord.date}</p>
            </div>
          )}

          {/* ID de Seguimiento con Botón a Mapa */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-4 flex items-center justify-between shrink-0 hover:border-amber-400 transition-colors cursor-pointer" onClick={() => setIsMapModalOpen(true)}>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 shrink-0">
                <Wifi className={cn("w-4 h-4", animalData.tracking.isOnline ? "text-emerald-500" : "text-slate-400")} />
                {animalData.tracking.isOnline && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">GPS Tracker</span>
                <span className="text-xs font-bold text-slate-700 leading-tight">{animalData.tracking.deviceId}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase">{animalData.tracking.location}</span>
            </div>
          </div>

          {/* Grid de Datos (Ultra Compacto) */}
          <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
            {[
              { l: "Raza", v: animalData.breed }, { l: "Sexo", v: animalData.sex },
              { l: "Edad", v: animalData.age }, { l: "Categoría", v: animalData.category },
              { l: "Lote", v: animalData.lot }, { l: "C. Corporal", v: animalData.bodyCondition },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-lg px-2 py-1.5 flex flex-col justify-center">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{item.l}</span>
                <span className="text-xs font-semibold text-slate-800 truncate">{item.v}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-2 shrink-0 border-t border-slate-100">
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 py-1.5"><Camera className="w-4 h-4" /> Foto</Button>
              <Button variant="secondary" className="flex-1 py-1.5"><QrCode className="w-4 h-4" /> QR</Button>
            </div>
            {!deathRecord && (
              <Button variant="danger" className="w-full py-1.5" onClick={() => setIsDeathModalOpen(true)}>
                <Skull className="w-4 h-4" /> Registrar Baja
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================
          PANEL CENTRAL: OPERACIONES E HISTORIALES (SCROLLABLE)
          ========================================= */}
      <main className="flex-1 h-full overflow-y-auto p-6 xl:p-10 flex flex-col gap-6 relative">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Panel Operativo
            </h2>
          </div>

          {/* Trazabilidad (Solo los Padres Activos) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><GitMerge className="w-4 h-4 text-amber-500" /> Trazabilidad Genética</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors text-left group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-100">♂</div>
                <div><p className="text-[10px] uppercase text-slate-500 font-bold">Padre</p><p className="text-sm font-bold text-slate-800 group-hover:text-amber-600">Toro #992</p></div>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors text-left group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-100">♀</div>
                <div><p className="text-[10px] uppercase text-slate-500 font-bold">Madre</p><p className="text-sm font-bold text-slate-800 group-hover:text-amber-600">Vaca #110</p></div>
              </button>
            </div>
          </div>

          {/* Reproducción (Solo Estado Actual + Botón Historial) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Baby className="w-4 h-4 text-amber-500" /> Reproducción (Estado Actual)</h3>
              <Button variant="ghost" className="h-8 text-xs py-0 px-2 text-amber-600 hover:bg-amber-50" onClick={() => openHistory('repro')}>
                <History className="w-3.5 h-3.5" /> Ver Historial
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 border border-amber-100 mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Última Palpación (10/10/2023)</p>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs px-3">PREÑADA</Badge>
                  <span className="text-sm font-bold text-slate-700">100 días de gestación</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Proyectado</p>
                <p className="text-sm font-bold text-amber-600">Secado: 20/03/2024</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 border-dashed bg-slate-50" disabled={!!deathRecord}><Stethoscope className="w-4 h-4" /> Registrar Palpación</Button>
              <Button className="flex-1" disabled={!!deathRecord}><Baby className="w-4 h-4" /> Iniciar Parto</Button>
            </div>
          </div>

          {/* Sanidad (Solo Estado Actual + Botón Historial) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Syringe className="w-4 h-4 text-amber-500" /> Sanidad Preventiva</h3>
              <Button variant="ghost" className="h-8 text-xs py-0 px-2 text-amber-600 hover:bg-amber-50" onClick={() => openHistory('sanidad')}>
                <History className="w-3.5 h-3.5" /> Ver Historial
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex flex-col p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-sm font-bold text-slate-800 mb-1">Aftosa</span>
                <div className="flex justify-between items-end mt-auto">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Aplicada</span>
                  <span className="text-xs font-semibold text-slate-500">05/01/2024</span>
                </div>
              </div>
              <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-amber-200">
                <span className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">Rabia <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /></span>
                <div className="flex justify-between items-end mt-auto">
                  <span className="text-[10px] text-amber-600 font-bold uppercase">Pendiente</span>
                  <span className="text-xs font-semibold text-slate-500">15/06/2024</span>
                </div>
              </div>
            </div>

            <Button variant="secondary" className="w-full bg-slate-50 border-dashed" disabled={!!deathRecord}><Bug className="w-4 h-4" /> Solicitar Baño Garrapaticida</Button>
          </div>

        </div>
      </main>

      {/* =========================================
          PANEL DERECHO: GRÁFICOS COLAPSABLES
          ========================================= */}
      <aside className={cn(
        "h-full bg-white border-l border-slate-200 transition-all duration-300 ease-in-out flex flex-col shrink-0 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] z-20",
        isGraphExpanded ? "w-[400px]" : "w-[60px]"
      )}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsGraphExpanded(!isGraphExpanded)}
          className="w-full h-16 flex items-center justify-center border-b border-slate-100 hover:bg-slate-50 transition-colors text-slate-400 hover:text-amber-500"
        >
          {isGraphExpanded ? <ChevronRight className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
        </button>

        {/* Contenido (Solo visible si está expandido) */}
        <div className={cn("flex-1 overflow-y-auto p-6 flex flex-col opacity-0 transition-opacity duration-300 delay-100", isGraphExpanded && "opacity-100")}>
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" /> Rendimiento de Leche
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Promedio</p>
              <p className="text-2xl font-black text-slate-800 tracking-tight">20.8 <span className="text-xs font-semibold text-slate-500">L/día</span></p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600/70 uppercase">Pico</p>
              <p className="text-2xl font-black text-amber-600 tracking-tight">25.0 <span className="text-xs font-semibold text-amber-600/70">L/día</span></p>
            </div>
          </div>

          <div className="flex-1 min-h-[300px] w-full bg-white">
            {isGraphExpanded && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="liters" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLiters)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Título Vertical si está colapsado */}
        {!isGraphExpanded && (
          <div className="flex-1 flex justify-center mt-10">
            <span className="whitespace-nowrap -rotate-90 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] h-fit">
              Panel Analítico
            </span>
          </div>
        )}
      </aside>

      {/* =========================================
          MODALES
          ========================================= */}
      <AnimatePresence>
        
        {/* MODAL: REGISTRO DE BAJA (MUERTE) */}
        {isDeathModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeathModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-red-600 font-bold">
                  <div className="p-2.5 bg-red-50 rounded-xl"><Skull className="w-6 h-6" /></div>
                  <h2 className="text-xl">Registrar Baja de Animal</h2>
                </div>
                <button onClick={() => setIsDeathModalOpen(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
              </div>
              
              <form onSubmit={handleDeathRegistration} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Motivo / Causa Confirmada</label>
                  <select name="cause" required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none font-medium text-slate-700">
                    <option value="">Seleccione el motivo de la baja...</option>
                    <option value="Enfermedad Infecciosa">Enfermedad Infecciosa</option>
                    <option value="Enfermedad Metabólica">Enfermedad Metabólica</option>
                    <option value="Accidente / Traumatismo">Accidente / Traumatismo</option>
                    <option value="Depredación">Depredación</option>
                    <option value="Problemas Reproductivos">Problemas Reproductivos graves</option>
                    <option value="Edad Avanzada (Descarte)">Edad Avanzada (Descarte)</option>
                    <option value="Baja Producción (Descarte)">Baja Producción (Descarte)</option>
                    <option value="Causa Desconocida">Causa Desconocida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Observaciones / Evidencia</label>
                  <textarea name="obs" required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none text-slate-700" placeholder="Describe los síntomas previos, lugar del hallazgo o justificación del descarte..."></textarea>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsDeathModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" variant="danger" className="flex-1">Confirmar Baja</Button>
                </div>
              </form>

            </motion.div>
          </div>
        )}

        {/* MODAL: HISTORIAL GENERICO */}
        {historyModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setHistoryModal({ ...historyModal, isOpen: false })} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} 
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 md:p-8">
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><History className="w-5 h-5 text-amber-500"/> {historyModal.title}</h2>
                <button onClick={() => setHistoryModal({ ...historyModal, isOpen: false })} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
                {historyModal.data.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={cn("flex items-center justify-center w-3 h-3 rounded-full border-[3px] box-content shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-3.5 md:ml-auto", item.status === 'success' ? 'bg-emerald-500 border-emerald-100' : 'bg-slate-400 border-slate-100')} />
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:pr-6 md:group-even:pl-6">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left">
                        <div className="text-[10px] text-slate-400 font-bold mb-0.5">{item.date}</div>
                        <div className="text-sm font-bold text-slate-800">{item.event}</div>
                        <div className="text-xs text-slate-600 mt-1">{item.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL: MAPA SIMULADOR DE FINCA (IoT) */}
        {isMapModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-4xl h-[80vh] bg-white border border-slate-200 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
              
              {/* Header Mapa */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg"><MapPin className="w-5 h-5 text-slate-700" /></div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">Ubicación en Finca</h2>
                    <p className="text-xs text-slate-500">Visualización en tiempo real vía GPS</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <input type="checkbox" checked={showAllHerd} onChange={(e) => setShowAllHerd(e.target.checked)} className="accent-amber-500 w-4 h-4 cursor-pointer" />
                    <span className="text-xs font-bold text-slate-600">Mostrar Todo el Rebaño</span>
                  </label>
                  <button onClick={() => setIsMapModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Grid de Potreros (Simulación) */}
              <div className="flex-1 bg-[#f4f7f6] p-6 relative overflow-hidden">
                <div className="absolute inset-6 grid grid-cols-2 grid-rows-2 gap-4">
                  {['Potrero 1', 'Potrero 2', 'Potrero 3', 'Potrero 4'].map((p, i) => (
                    <div key={i} className="bg-[#e6efe9] border-2 border-[#c2d6cb] rounded-3xl relative overflow-hidden">
                      <span className="absolute bottom-4 left-4 text-sm font-black text-[#8daea0] opacity-50 uppercase tracking-widest">{p}</span>
                      
                      {/* Vaca Actual (Si está en este potrero) */}
                      {p === animalData.tracking.location && !showAllHerd && (
                        <motion.div 
                          className="absolute w-6 h-6 bg-amber-500 rounded-full border-2 border-white shadow-lg z-20 flex items-center justify-center cursor-pointer"
                          initial={{ left: '50%', top: '50%' }}
                          animate={{ 
                            x: [0, 20, -10, 0], y: [0, -15, 10, 0], 
                            boxShadow: ['0 0 0 0 rgba(245, 158, 11, 0.4)', '0 0 0 15px rgba(245, 158, 11, 0)'],
                          }}
                          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">{animalData.id}</div>
                        </motion.div>
                      )}

                      {/* Todo el Rebaño */}
                      {showAllHerd && mockHerd.filter(v => v.potrero === p).map((v, i) => (
                        <motion.div 
                          key={v.id}
                          className={cn("absolute w-3 h-3 rounded-full border border-white cursor-pointer hover:scale-150 transition-transform", v.id === animalData.id ? "bg-amber-500 w-4 h-4 z-20" : "bg-slate-600")}
                          style={{ left: `${v.x}%`, top: `${v.y}%` }}
                          animate={{ x: [0, Math.random() * 20 - 10, 0], y: [0, Math.random() * 20 - 10, 0] }}
                          transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
                          title={`Ver detalle de ${v.id}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}