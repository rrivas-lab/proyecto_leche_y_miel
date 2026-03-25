import React, { useState } from 'react';
import { 
  Camera, QrCode, Skull, Activity, Syringe, Bug, 
  MessageSquare, Calendar, TrendingUp, Droplets, 
  Baby, GitMerge, Plus, CheckCircle2, Clock, X, AlertTriangle
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
  photo: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2070&auto=format&fit=crop"
};

const productionData = [
  { month: 'Ene', liters: 18 },
  { month: 'Feb', liters: 22 },
  { month: 'Mar', liters: 25 },
  { month: 'Abr', liters: 24 },
  { month: 'May', liters: 21 },
  { month: 'Jun', liters: 19 },
  { month: 'Jul', liters: 17 },
];

const timelineData = [
  { date: '12/04/2019', event: 'Nacimiento (Becerro)' },
  { date: '15/10/2019', event: 'Destete (Maute)' },
  { date: '20/05/2021', event: '1er Servicio (Novilla)' },
  { date: '10/02/2022', event: '1er Parto (Vaca)' },
];

const palpationData = [
  { date: '15/08/2023', status: 'Preñada', days: '45 días', next: 'Parto: 20/05/2024' },
  { date: '10/10/2023', status: 'Preñada', days: '100 días', next: 'Secado: 20/03/2024' },
];

const healthData = {
  vaccines: [
    { name: 'Aftosa', status: 'Aplicada', date: '05/01/2024' },
    { name: 'Rabia', status: 'Proyectada', date: '15/06/2024' },
  ]
};

const observations = [
  { id: 1, text: "Se observó leve cojera en pata trasera derecha. Se aplicó tratamiento tópico.", date: "12/03/2024 08:30 AM", author: "Dr. Ramírez" },
  { id: 2, text: "Aumento de producción tras cambio a Potrero 4.", date: "01/03/2024 10:15 AM", author: "Ing. Gómez" },
];

// --- Components ---

const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'outline' | 'success' | 'warning' }) => {
  const variants = {
    default: "bg-slate-800 text-slate-300 border border-slate-700",
    outline: "bg-transparent text-slate-400 border border-slate-700",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5", variants[variant], className)}>
      {children}
    </span>
  );
};

const Card = ({ children, className, title, icon: Icon, action }: { children: React.ReactNode, className?: string, title?: string, icon?: any, action?: React.ReactNode }) => (
  <div className={cn("bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 shadow-2xl shadow-black/20 flex flex-col", className)}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-6">
        {title && (
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-amber-500" />}
            {title}
          </h3>
        )}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  </div>
);

const Button = ({ children, className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20 border border-orange-400/50",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200"
  };
  return (
    <button 
      className={cn("px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95", variants[variant as keyof typeof variants], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default function App() {
  const [isDeathModalOpen, setIsDeathModalOpen] = useState(false);
  const [bathRequested, setBathRequested] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Hero Header --- */}
        <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={animalData.photo} 
              alt="Vaca" 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
            <div className="space-y-6 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Sana</Badge>
                <Badge variant="warning"><AlertTriangle className="w-3 h-3" /> Mastitis Leve</Badge>
              </div>
              
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight flex items-baseline gap-4">
                  {animalData.id}
                  <span className="text-2xl md:text-3xl font-medium text-slate-400 tracking-normal">{animalData.type}</span>
                </h1>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-4">
                {[
                  { label: "Raza", value: animalData.breed },
                  { label: "Sexo", value: animalData.sex },
                  { label: "Edad", value: animalData.age },
                  { label: "Categoría", value: animalData.category },
                  { label: "Lote", value: animalData.lot },
                  { label: "Potrero", value: animalData.paddock },
                  { label: "C. Corporal", value: animalData.bodyCondition },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-950/50 backdrop-blur-md border border-slate-800/80 rounded-2xl px-4 py-2 flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{item.label}</span>
                    <span className="text-sm font-medium text-slate-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap md:flex-col gap-3 w-full md:w-auto shrink-0">
              <Button variant="secondary" className="flex-1 md:flex-none"><Camera className="w-4 h-4" /> Subir Foto</Button>
              <Button variant="secondary" className="flex-1 md:flex-none"><QrCode className="w-4 h-4" /> Descargar QR</Button>
              <Button variant="danger" className="w-full" onClick={() => setIsDeathModalOpen(true)}>
                <Skull className="w-4 h-4" /> Registrar Muerte
              </Button>
            </div>
          </div>
        </div>

        {/* --- Main Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Always On Display - Chart (Spans full width on mobile, 8 cols on desktop) */}
          <Card className="lg:col-span-8 min-h-[300px]" title="Producción de Leche (Últimos 7 meses)" icon={Activity}>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f59e0b' }}
                  />
                  <Area type="monotone" dataKey="liters" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLiters)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Card 1: Genealogía y Trazabilidad */}
          <Card className="lg:col-span-4" title="Trazabilidad" icon={GitMerge}>
            <div className="space-y-6">
              <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
                <h4 className="text-xs uppercase text-slate-500 font-semibold mb-3">Genealogía</h4>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-slate-400">
                      ♂
                    </div>
                    <span className="text-xs text-slate-300">Toro #992</span>
                  </div>
                  <div className="h-px bg-slate-700 flex-1 mx-2 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-slate-400">
                      ♀
                    </div>
                    <span className="text-xs text-slate-300">Vaca #110</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase text-slate-500 font-semibold mb-3">Línea de Tiempo</h4>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:to-slate-800">
                  {timelineData.map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-[#0B0F19] bg-amber-500 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-0 md:ml-auto" />
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:pr-4 md:group-even:pl-4">
                        <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50 transition-colors hover:bg-slate-800">
                          <div className="text-xs text-amber-500 font-medium mb-1">{item.date}</div>
                          <div className="text-sm text-slate-200">{item.event}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Palpación y Reproducción */}
          <Card className="lg:col-span-4" title="Reproducción" icon={Baby} action={<Button variant="ghost" className="p-2"><Plus className="w-4 h-4" /></Button>}>
            <div className="space-y-4 flex-1">
              {palpationData.map((p, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-300">{p.date}</span>
                    <Badge variant="success">{p.status}</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{p.days}</span>
                    <span className="text-amber-500/80">{p.next}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6"><Baby className="w-4 h-4" /> Registrar Parto</Button>
          </Card>

          {/* Card 3: Sanidad */}
          <Card className="lg:col-span-4" title="Sanidad" icon={Syringe}>
            <div className="space-y-4 flex-1">
              <div className="space-y-3">
                <h4 className="text-xs uppercase text-slate-500 font-semibold">Vacunación</h4>
                {healthData.vaccines.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", v.status === 'Aplicada' ? "bg-emerald-500" : "bg-slate-600")} />
                      <span className="text-sm text-slate-200">{v.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">{v.date}</div>
                      <div className="text-[10px] text-slate-500">{v.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800">
              <Button 
                variant={bathRequested ? "secondary" : "primary"} 
                className="w-full"
                onClick={() => setBathRequested(true)}
                disabled={bathRequested}
              >
                <Bug className="w-4 h-4" /> 
                {bathRequested ? "Baño Pendiente (Orden Global)" : "Solicitar Baño Garrapaticida"}
              </Button>
            </div>
          </Card>

          {/* Card 4: Observaciones Generales */}
          <Card className="lg:col-span-4" title="Bitácora" icon={MessageSquare} action={<Button variant="ghost" className="p-2"><Plus className="w-4 h-4" /></Button>}>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {observations.map((obs) => (
                <div key={obs.id} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-amber-500">{obs.author}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {obs.date}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{obs.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Añadir observación..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {isDeathModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm"
              onClick={() => setIsDeathModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 text-red-400">
                    <div className="p-2 bg-red-500/10 rounded-xl">
                      <Skull className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-100">Registrar Muerte</h2>
                  </div>
                  <button onClick={() => setIsDeathModalOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Causa de Muerte</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 appearance-none">
                      <option value="">Seleccione una causa...</option>
                      <option value="enfermedad">Enfermedad (Infecciosa/Metabólica)</option>
                      <option value="accidente">Accidente / Traumatismo</option>
                      <option value="depredacion">Depredación</option>
                      <option value="desconocida">Causa Desconocida</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Observaciones Adicionales</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 resize-none"
                      placeholder="Detalles sobre el suceso..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setIsDeathModalOpen(false)}>Cancelar</Button>
                  <Button variant="danger" className="flex-1" onClick={() => setIsDeathModalOpen(false)}>Confirmar Registro</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
