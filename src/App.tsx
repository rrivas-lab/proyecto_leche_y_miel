import React, { useState } from 'react';
import { 
  Camera, QrCode, Skull, Activity, Syringe, Bug, 
  MessageSquare, Baby, GitMerge, CheckCircle2, Clock, X, 
  AlertTriangle, ChevronDown, Stethoscope, Link as LinkIcon, Wifi, Send
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

// --- Mock Data ---
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
  status: ["Sana", "Mastitis Leve (Tratada)"],
  photo: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2070&auto=format&fit=crop",
  tracking: {
    deviceId: "Halter HL-90X",
    isOnline: true
  }
};

const productionData = [
  { month: 'Ene', liters: 18 }, { month: 'Feb', liters: 22 },
  { month: 'Mar', liters: 25 }, { month: 'Abr', liters: 24 },
  { month: 'May', liters: 21 }, { month: 'Jun', liters: 19 },
  { month: 'Jul', liters: 17 },
];

const initialObservations = [
  { id: 1, text: "Se observó leve cojera en pata trasera derecha. Se aplicó tratamiento tópico.", date: "12/03/24 08:30", author: "Dr. Ramírez" },
  { id: 2, text: "Aumento de producción tras cambio a Potrero 4.", date: "01/03/24 10:15", author: "Ing. Gómez" },
];

// --- Premium UI Components (Light Mode Only) ---
const Badge = ({ children, variant = 'default', className }: any) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5", variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
};

const Card = ({ children, className, title, icon: Icon, action }: any) => (
  <div className={cn("bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col", className)}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-5">
        {title && (
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-amber-500" />}
            {title}
          </h3>
        )}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="flex-1 flex flex-col">{children}</div>
  </div>
);

const Button = ({ children, className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 border border-amber-600/50",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
  };
  return (
    <button className={cn("px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none", variants[variant as keyof typeof variants], className)} {...props}>
      {children}
    </button>
  );
};

export default function App() {
  // Modals & States
  const [isDeathModalOpen, setIsDeathModalOpen] = useState(false);
  const [isPalpationModalOpen, setIsPalpationModalOpen] = useState(false);
  const [isPartoModalOpen, setIsPartoModalOpen] = useState(false);
  const [bathRequested, setBathRequested] = useState(false);
  
  // Bitácora interactiva
  const [observations, setObservations] = useState(initialObservations);
  const [newObs, setNewObs] = useState("");

  const handleAddObservation = () => {
    if (!newObs.trim()) return;
    const date = new Date();
    setObservations([{
      id: Date.now(),
      author: "Usuario Actual",
      date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
      text: newObs
    }, ...observations]);
    setNewObs("");
  };

  return (
    <div className="min-h-screen w-full relative pb-10 bg-slate-50 font-sans text-slate-800">
      
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* --- GRID DE 3 COLUMNAS (IZQ: Fija | CENTRO: Operativa | DER: Fija Gráficos) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA 1: CARNET DEL ANIMAL (Fija a la izquierda en Desktop) */}
          <div className="w-full md:col-span-4 lg:col-span-3 md:sticky md:top-6 flex flex-col gap-4">
            
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              {/* Imagen Siempre Visible */}
              <div className="h-56 w-full relative">
                <img 
                  src={animalData.photo} 
                  alt="Vaca" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="success"><CheckCircle2 className="w-3.5 h-3.5" /> Sana</Badge>
                </div>
              </div>
              
              <div className="p-5">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {animalData.id}
                </h1>
                <p className="text-lg font-medium text-slate-500 mb-4">{animalData.type}</p>

                {/* ID DE SEGUIMIENTO IOT (Nuevo Requerimiento) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200">
                      <Wifi className={cn("w-4 h-4", animalData.tracking.isOnline ? "text-emerald-500" : "text-slate-400")} />
                      {animalData.tracking.isOnline && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dispositivo</p>
                      <p className="text-sm font-bold text-slate-700">{animalData.tracking.deviceId}</p>
                    </div>
                  </div>
                  <Badge variant={animalData.tracking.isOnline ? "success" : "default"}>
                    {animalData.tracking.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>

                {/* Badges de Información Básica */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[
                    { label: "Raza", value: animalData.breed }, 
                    { label: "Sexo", value: animalData.sex },
                    { label: "Edad", value: animalData.age }, 
                    { label: "Categoría", value: animalData.category },
                    { label: "Lote", value: animalData.lot }, 
                    { label: "Potrero", value: animalData.paddock },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-0.5">{item.label}</span>
                      <span className="text-xs font-semibold text-slate-800 truncate block">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Botones Rápidos */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1 px-2 text-xs"><Camera className="w-4 h-4" /> Foto</Button>
                    <Button variant="secondary" className="flex-1 px-2 text-xs"><QrCode className="w-4 h-4" /> QR</Button>
                  </div>
                  <Button variant="danger" className="w-full" onClick={() => setIsDeathModalOpen(true)}>
                    <Skull className="w-4 h-4" /> Registrar Baja
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA 2: DETALLE OPERATIVO (Scrollable en el centro) */}
          <div className="w-full md:col-span-8 lg:col-span-5 flex flex-col gap-6">
            
            <Card title="Trazabilidad" icon={GitMerge}>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h4 className="text-xs uppercase text-slate-500 font-bold mb-3">Padres Registrados</h4>
                <div className="flex flex-col gap-2">
                  <button className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">♂</div>
                      <div className="text-left"><p className="text-xs text-slate-500">Padre</p><p className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Toro #992</p></div>
                    </div>
                    <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                  </button>
                  <button className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">♀</div>
                      <div className="text-left"><p className="text-xs text-slate-500">Madre</p><p className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Vaca #110</p></div>
                    </div>
                    <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                  </button>
                </div>
              </div>
            </Card>

            <Card title="Reproducción" icon={Baby}>
               <div className="mb-4">
                <Button variant="secondary" className="w-full border-dashed" onClick={() => setIsPalpationModalOpen(true)}>
                  <Stethoscope className="w-4 h-4" /> Registrar Palpación
                </Button>
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-800">10/10/2023</span>
                    <Badge variant="success">Preñada</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>100 días</span>
                    <span className="text-amber-600 font-bold">Secado: 20/03/2024</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <Button className="w-full" onClick={() => setIsPartoModalOpen(true)}>
                  <Baby className="w-4 h-4" /> Iniciar Flujo de Parto
                </Button>
              </div>
            </Card>

            <Card title="Sanidad Preventiva" icon={Syringe}>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-slate-800">Aftosa</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-600">05/01/2024</div>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Aplicada</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-sm font-bold text-slate-800">Rabia</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-600">15/06/2024</div>
                    <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Proyectada</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Button 
                  variant={bathRequested ? "secondary" : "primary"} 
                  className="w-full"
                  onClick={() => setBathRequested(true)}
                  disabled={bathRequested}
                >
                  <Bug className="w-4 h-4" /> 
                  {bathRequested ? "Baño Programado (Orden Global)" : "Solicitar Baño Garrapaticida"}
                </Button>
              </div>
            </Card>

            <Card title="Bitácora de Observaciones" icon={MessageSquare}>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[300px]">
                {observations.map((obs) => (
                  <div key={obs.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-amber-600">{obs.author}</span>
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> {obs.date}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{obs.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={newObs}
                    onChange={(e) => setNewObs(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddObservation()}
                    placeholder="Escribir nueva observación..." 
                    className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-400"
                  />
                  <button onClick={handleAddObservation} className="absolute right-2 p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm active:scale-95">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* COLUMNA 3: GRÁFICOS (Fija a la derecha, Paralela y Contextual) */}
          <div className="w-full lg:col-span-4 lg:sticky lg:top-6">
            <Card className="h-full" title="Rendimiento (Leche)" icon={Activity}>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Promedio</p>
                  <p className="text-xl font-extrabold text-slate-800">20.8 <span className="text-xs font-medium text-slate-500">L/día</span></p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Pico</p>
                  <p className="text-xl font-extrabold text-amber-600">25.0 <span className="text-xs font-medium text-slate-500">L/día</span></p>
                </div>
              </div>

              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="liters" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLiters)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* --- MODALES INTERACTIVOS --- */}
      <AnimatePresence>
        {isDeathModalOpen && (
          <GenericModal 
            title="Registrar Baja" icon={Skull} color="red"
            onClose={() => setIsDeathModalOpen(false)}
            actionText="Confirmar Baja"
          >
            <p className="text-sm text-slate-600 mb-4">¿Estás seguro de registrar la baja de este animal? Esta acción inhabilitará el arete en el sistema.</p>
            <select className="w-full mb-4 bg-white border border-slate-300 rounded-xl py-3 px-4 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none">
              <option>Seleccione Causa...</option>
              <option>Enfermedad</option>
              <option>Accidente</option>
            </select>
          </GenericModal>
        )}
        
        {isPalpationModalOpen && (
          <GenericModal 
            title="Registrar Palpación" icon={Stethoscope} color="amber"
            onClose={() => setIsPalpationModalOpen(false)}
            actionText="Guardar Registro"
          >
            <p className="text-sm text-slate-600 mb-4">Ingresa los resultados del diagnóstico reproductivo.</p>
            <select className="w-full mb-4 bg-white border border-slate-300 rounded-xl py-3 px-4 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none">
              <option>Estado Fisiológico...</option>
              <option>Preñada</option>
              <option>Vacía</option>
            </select>
          </GenericModal>
        )}

        {isPartoModalOpen && (
          <GenericModal 
            title="Flujo de Parto" icon={Baby} color="emerald"
            onClose={() => setIsPartoModalOpen(false)}
            actionText="Crear Becerro"
          >
            <p className="text-sm text-slate-600 mb-4">Se dará de alta un nuevo arete en el sistema asociado a esta madre.</p>
            <select className="w-full mb-4 bg-white border border-slate-300 rounded-xl py-3 px-4 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none">
              <option>Sexo de la cría...</option>
              <option>Macho</option>
              <option>Hembra</option>
            </select>
          </GenericModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente helper para modales limpios
function GenericModal({ children, title, icon: Icon, color, onClose, actionText }: any) {
  const colorMap = {
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
        className="relative w-full max-w-sm bg-white border border-slate-200 rounded-[2rem] shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center gap-3 font-bold ${colorMap[color as keyof typeof colorMap].split(' ')[0]}`}>
            <div className={`p-2.5 rounded-2xl ${colorMap[color as keyof typeof colorMap].split(' ')[1]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl">{title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
        <Button variant={color === 'red' ? 'danger' : 'primary'} className="w-full" onClick={onClose}>{actionText}</Button>
      </motion.div>
    </div>
  );
}