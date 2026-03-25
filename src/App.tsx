import React, { useState, useEffect } from 'react';
import { 
  Camera, QrCode, Skull, Activity, Syringe, Bug, 
  MessageSquare, TrendingUp, Droplets, Baby, 
  GitMerge, CheckCircle2, Clock, X, AlertTriangle, 
  Moon, Sun, ChevronDown, Stethoscope, Link as LinkIcon
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
  { month: 'Ene', liters: 18 }, { month: 'Feb', liters: 22 },
  { month: 'Mar', liters: 25 }, { month: 'Abr', liters: 24 },
  { month: 'May', liters: 21 }, { month: 'Jun', liters: 19 },
  { month: 'Jul', liters: 17 },
];

// --- Premium UI Components ---
const Badge = ({ children, variant = 'default', className }: any) => {
  const variants = {
    default: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors", variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
};

const Card = ({ children, className, title, icon: Icon, action }: any) => (
  <div className={cn("bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2rem] p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col transition-colors duration-500", className)}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-5">
        {title && (
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
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
    primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20 border border-orange-400/50",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-400"
  };
  return (
    <button className={cn("px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]", variants[variant as keyof typeof variants], className)} {...props}>
      {children}
    </button>
  );
};

const CustomSelect = ({ value, onChange, options, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
      >
        <span>{value ? options.find((o: any) => o.value === value)?.label : placeholder}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {options.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDeathModalOpen, setIsDeathModalOpen] = useState(false);
  const [deathCause, setDeathCause] = useState("");
  const [bathRequested, setBathRequested] = useState(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const deathOptions = [
    { value: "enfermedad", label: "Enfermedad (Infecciosa/Metabólica)" },
    { value: "accidente", label: "Accidente / Traumatismo" },
    { value: "depredacion", label: "Depredación" },
    { value: "desconocida", label: "Causa Desconocida" }
  ];

  return (
    <div className="min-h-screen w-full relative pb-10">
      
      {/* Botón Flotante Tema */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-amber-400 shadow-xl border border-slate-200 dark:border-slate-700 transition-transform hover:scale-110 active:scale-95"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 lg:space-y-8">
        
        {/* --- HERO HEADER --- */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl group">
          <div className="absolute inset-0 z-0">
            <img 
              src={animalData.photo} 
              alt="Vaca" 
              className="w-full h-full object-cover opacity-60 dark:opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent dark:from-[#0B0F19] dark:via-[#0B0F19]/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent dark:from-[#0B0F19] dark:via-transparent" />
          </div>

          <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col xl:flex-row gap-6 xl:gap-8 items-start xl:items-end justify-between">
            <div className="space-y-5 flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge variant="success"><CheckCircle2 className="w-3.5 h-3.5" /> Sana</Badge>
                <Badge variant="warning"><AlertTriangle className="w-3.5 h-3.5" /> Mastitis Leve</Badge>
              </div>
              
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                  {animalData.id}
                  <span className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-300 tracking-normal">{animalData.type}</span>
                </h1>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap gap-2 sm:gap-3">
                {[
                  { label: "Raza", value: animalData.breed }, { label: "Sexo", value: animalData.sex },
                  { label: "Edad", value: animalData.age }, { label: "Categoría", value: animalData.category },
                  { label: "Lote", value: animalData.lot }, { label: "Potrero", value: animalData.paddock },
                  { label: "C. Corporal", value: animalData.bodyCondition },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 sm:px-4 sm:py-2 flex flex-col justify-center">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold">{item.label}</span>
                    <span className="text-xs sm:text-sm font-semibold text-white truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-56 shrink-0 mt-4 xl:mt-0">
              <Button variant="secondary" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"><Camera className="w-4 h-4" /> Subir Foto</Button>
              <Button variant="secondary" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"><QrCode className="w-4 h-4" /> Descargar QR</Button>
              <Button variant="danger" className="w-full" onClick={() => setIsDeathModalOpen(true)}>
                <Skull className="w-4 h-4" /> Registrar Muerte
              </Button>
            </div>
          </div>
        </div>

        {/* --- GRID ASIMÉTRICO (IZQ: 4 Cols | DER: 8 Cols) --- */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          
          {/* LADO IZQUIERDO: DETALLE OPERATIVO (4 Columnas Escritorio | 2x2 Tablet | 1 Móvil) */}
          <div className="w-full lg:col-span-4 lg:col-start-1 flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col gap-5 sm:gap-6 lg:gap-8 order-2 lg:order-1">
            
            {/* Genealogía */}
            <Card title="Trazabilidad" icon={GitMerge}>
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs uppercase text-slate-500 font-bold mb-4">Padres Registrados</h4>
                  <div className="flex flex-col gap-3">
                    <button className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">♂</div>
                        <div className="text-left"><p className="text-xs text-slate-500">Padre</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-500 transition-colors">Toro #992</p></div>
                      </div>
                      <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                    </button>
                    <button className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">♀</div>
                        <div className="text-left"><p className="text-xs text-slate-500">Madre</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-500 transition-colors">Vaca #110</p></div>
                      </div>
                      <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reproducción */}
            <Card title="Reproducción" icon={Baby}>
               <div className="mb-4">
                <Button variant="secondary" className="w-full border-dashed"><Stethoscope className="w-4 h-4" /> Registrar Palpación</Button>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[200px]">
                <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">10/10/2023</span>
                    <Badge variant="success">Preñada</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>100 días</span>
                    <span className="text-amber-600 dark:text-amber-500/80">Secado: 20/03/2024</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
                <Button className="w-full"><Baby className="w-4 h-4" /> Iniciar Flujo de Parto</Button>
              </div>
            </Card>

            {/* Sanidad */}
            <Card title="Sanidad Preventiva" icon={Syringe}>
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-slate-800/30 border border-emerald-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Aftosa</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">05/01/2024</div>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Aplicada</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 dark:bg-slate-800/30 border border-amber-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Rabia</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">15/06/2024</div>
                    <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Proyectada</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
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

            {/* Bitácora */}
            <Card title="Bitácora de Observaciones" icon={MessageSquare}>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[200px]">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-500">Dr. Ramírez</span>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> 12/03/24</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Se observó leve cojera en pata trasera derecha. Se aplicó tratamiento tópico.</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Escribir nueva observación..." 
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-400"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* LADO DERECHO: ALWAYS ON DISPLAY GRÁFICOS (8 Columnas Escritorio | Ancho Completo Tablet/Móvil) */}
          <div className="w-full lg:col-span-8 lg:col-start-5 order-1 lg:order-2 lg:sticky lg:top-8 h-auto lg:h-[calc(100vh-6rem)]">
            <Card className="h-full flex flex-col" title="Panel Analítico: Producción de Leche" icon={Activity}>
              
              {/* KPIs Superiores para darle peso visual al panel grande */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-500 mb-1">Promedio Diario</p>
                  <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">20.8 <span className="text-sm font-medium text-slate-500">L/día</span></p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-500 mb-1">Pico de Lactancia</p>
                  <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-500">25.0 <span className="text-sm font-medium text-slate-500">L/día</span></p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-500 mb-1">Días en Leche (DEL)</p>
                  <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">112 <span className="text-sm font-medium text-slate-500">Días</span></p>
                </div>
              </div>

              {/* Gráfico Ocupando todo el espacio restante */}
              <div className="flex-1 w-full min-h-[300px] lg:min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} vertical={false} />
                    <XAxis dataKey="month" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
                        borderColor: isDarkMode ? '#1e293b' : '#e2e8f0', 
                        borderRadius: '16px', 
                        color: isDarkMode ? '#f8fafc' : '#0f172a',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                      itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="liters" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorLiters)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* --- MODAL MUERTE (PREMIUM) --- */}
      <AnimatePresence>
        {isDeathModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 dark:bg-[#0B0F19]/80 backdrop-blur-sm"
              onClick={() => setIsDeathModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-visible"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 text-red-500">
                    <div className="p-2.5 bg-red-50 dark:bg-red-500/10 rounded-2xl">
                      <Skull className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Registrar Baja</h2>
                  </div>
                  <button onClick={() => setIsDeathModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div className="relative z-50">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2">Causa Confirmada</label>
                    <CustomSelect 
                      options={deathOptions}
                      value={deathCause}
                      onChange={setDeathCause}
                      placeholder="Seleccione el motivo de la baja..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-400 mb-2">Detalles Adicionales</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none transition-all placeholder:text-slate-400"
                      placeholder="Escriba las observaciones del suceso..."
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setIsDeathModalOpen(false)}>Cancelar</Button>
                  <Button variant="danger" className="flex-1" onClick={() => setIsDeathModalOpen(false)}>Confirmar Baja</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}