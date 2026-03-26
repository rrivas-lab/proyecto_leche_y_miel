import React, { useState } from 'react';
import { 
  Camera, QrCode, Skull, Activity, Syringe, Bug, 
  MessageSquare, Baby, CheckCircle2, Clock, X, 
  ChevronRight, Stethoscope, Wifi, MapPin, Network, 
  Settings, Plus, ArrowRight, AlertCircle, CalendarDays,
  ArrowLeft, Search, Filter, LayoutGrid
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

// --- IMAGEN POR DEFECTO (FALLBACK ANTI-ERRORES) ---
const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2070&auto=format&fit=crop";

// --- MOCK DATA ESTÁTICA DINÁMICA ---
const chartDataLeche = [
  { month: 'Ene', value: 18 }, { month: 'Feb', value: 22 },
  { month: 'Mar', value: 25 }, { month: 'Abr', value: 24 },
  { month: 'May', value: 21 }, { month: 'Jun', value: 19 },
];

const chartDataPeso = [
  { month: 'Ene', value: 45 }, { month: 'Feb', value: 65 },
  { month: 'Mar', value: 90 }, { month: 'Abr', value: 115 },
  { month: 'May', value: 140 }, { month: 'Jun', value: 175 },
];

const mockHerd = Array.from({ length: 40 }).map((_, i) => ({
  id: `V-${1000 + i}`, potrero: `Potrero ${Math.floor(Math.random() * 4) + 1}`,
  x: Math.random() * 80 + 10, y: Math.random() * 80 + 10,
}));

// Base de Datos Estructurada Inicial con URLs de fotos corregidas y estables
const initialInventory = [
  { 
    id: "#333018", name: "Corazón", category: "Vaca", breed: "Carora-Jersey", sex: "Hembra", age: "4 años, 11 meses", lot: "Lote Alta Producción", paddock: "Potrero 4", status: "Activa", type: "success", bodyCondition: "3.5", reproStatus: "Preñada (45d)", tracking: true, photo: DEFAULT_PHOTO,
    trackingData: { deviceId: "Halter HL-90X", isOnline: true, location: "Potrero 4" },
    genetics: { father: "Toro #992 (Carora)", mother: "Vaca #110 (Jersey)" },
    activePregnancy: { id: 3, serviceDate: "15/09/2023", father: "Toro #88", palpationDate: "10/10/2023", palpationResult: "Preñada (45d)", projectedBirth: "20/06/2024" },
    pregnancyHistory: [
      { id: 2, status: "Parto Exitoso", serviceDate: "01/07/2021", father: "Toro #992", endDate: "20/05/2022", resultDetail: "Cría Macho (Arete #442)" },
      { id: 1, status: "Aborto Espontáneo", serviceDate: "10/02/2020", father: "Toro #15", endDate: "05/06/2020", resultDetail: "Gestación interrumpida a los 4 meses" }
    ],
    descendants: [{ id: "Macho #442", date: "2022", status: "Activo", type: "success" }],
    vaccines: [
      { id: 1, name: "Fiebre Aftosa", dose: "1ra Dosis", planned: "05/01/2024", actual: "05/01/2024", status: "Aplicada", type: "success" },
      { id: 2, name: "Fiebre Aftosa", dose: "Refuerzo", planned: "05/07/2024", actual: "-", status: "Pendiente", type: "warning" },
    ],
    parasites: [{ id: 1, name: "Baño Aspersión", product: "Amitraz 12.5%", planned: "12/11/2023", actual: "12/11/2023", status: "Listo", type: "success" }],
    observations: [{ id: 1, author: "Dr. Ramírez", date: "12/03/24 08:30", text: "Revisión general en manga. Condición corporal óptima." }],
    deathRecord: null
  },
  { 
    id: "#42125", name: "Pinto", category: "Becerro", breed: "Holstein", sex: "Macho", age: "6 meses", lot: "Levante", paddock: "Potrero 2", status: "Activo", type: "success", bodyCondition: "2.8", reproStatus: "N/A", tracking: false, photo: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?q=80&w=2070&auto=format&fit=crop",
    trackingData: { deviceId: "Sin dispositivo", isOnline: false, location: "Potrero 2" },
    genetics: { father: "Toro #15 (Holstein)", mother: "Vaca #33 (Holstein)" },
    activePregnancy: null, pregnancyHistory: [], descendants: [],
    vaccines: [{ id: 1, name: "Clostridial", dose: "Única", planned: "10/10/2023", actual: "-", status: "Pendiente", type: "warning" }],
    parasites: [], observations: [], deathRecord: null
  },
  { 
    id: "#53823", name: "Gyr", category: "Mauta", breed: "Gyr", sex: "Hembra", age: "18 meses", lot: "Desarrollo", paddock: "Potrero 3", status: "Activa", type: "success", bodyCondition: "3.0", reproStatus: "Vacía", tracking: true, photo: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2070&auto=format&fit=crop",
    trackingData: { deviceId: "Halter HL-22Z", isOnline: true, location: "Potrero 3" },
    genetics: { father: "Toro #77 (Gyr)", mother: "Vaca #12 (Gyr)" },
    activePregnancy: null, pregnancyHistory: [], descendants: [],
    vaccines: [], parasites: [], observations: [], deathRecord: null
  },
  { 
    id: "#04024", name: "Soncola", category: "Becerra", breed: "Holstein", sex: "Hembra", age: "2 meses", lot: "Enfermería", paddock: "Corral 1", status: "En Tratamiento", type: "warning", bodyCondition: "2.0", reproStatus: "N/A", tracking: false, photo: "https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?q=80&w=2070&auto=format&fit=crop",
    trackingData: { deviceId: "Sin dispositivo", isOnline: false, location: "Corral 1" },
    genetics: { father: "Desconocido", mother: "Vaca #09" },
    activePregnancy: null, pregnancyHistory: [], descendants: [],
    vaccines: [], parasites: [], 
    observations: [{ id: 1, author: "Dr. Ramírez", date: "10/03/24 10:00", text: "Presenta cuadro febril. En aislamiento."}], 
    deathRecord: null
  },
  { 
    id: "#99201", name: "Relámpago", category: "Toro", breed: "Carora Puro", sex: "Macho", age: "5 años", lot: "Reproductores", paddock: "Potrero 1", status: "Activo", type: "success", bodyCondition: "4.0", reproStatus: "Reproductor", tracking: true, photo: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=2070&auto=format&fit=crop",
    trackingData: { deviceId: "Halter HL-99X", isOnline: true, location: "Potrero 1" },
    genetics: { father: "Toro #01 (Importado)", mother: "Vaca #05 (Carora)" },
    activePregnancy: null, pregnancyHistory: [], 
    descendants: [{ id: "Macho #442", date: "2022", status: "Activo", type: "success" }, { id: "Hembra #551", date: "2023", status: "Activo", type: "success" }],
    vaccines: [{ id: 1, name: "Fiebre Aftosa", dose: "Refuerzo", planned: "05/01/2024", actual: "05/01/2024", status: "Aplicada", type: "success" }], 
    parasites: [], observations: [], deathRecord: null
  },
];

// --- COMPONENTES UI BASE (GLASSMORPHISM) ---
const Badge = ({ children, variant = 'default', className }: any) => {
  const variants = {
    default: "bg-white/40 text-gray-700 border-white/50 backdrop-blur-md",
    success: "bg-green-400/20 text-green-800 border-green-300/50 backdrop-blur-md",
    warning: "bg-amber-400/20 text-amber-800 border-amber-300/50 backdrop-blur-md",
    danger: "bg-red-400/20 text-red-800 border-red-300/50 backdrop-blur-md",
    info: "bg-blue-400/20 text-blue-800 border-blue-300/50 backdrop-blur-md",
  };
  return (
    <span className={cn("px-2.5 py-1 border rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-[0_2px_10px_rgba(0,0,0,0.02)]", variants[variant as keyof typeof variants], className)}>
      {children}
    </span>
  );
};

const Button = ({ children, className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#e65100] to-[#ff7043] hover:from-[#ef6c00] hover:to-[#ff9800] text-white shadow-lg shadow-orange-500/30 border border-orange-400/50",
    secondary: "bg-white/40 hover:bg-white/60 backdrop-blur-md text-gray-800 border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.03)]",
    danger: "bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md border border-red-400/50 shadow-lg shadow-red-500/20",
    ghost: "bg-transparent hover:bg-white/30 text-gray-700 border-transparent backdrop-blur-sm",
  };
  return (
    <button className={cn("px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 border active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none", variants[variant as keyof typeof variants], className)} {...props}>
      {children}
    </button>
  );
};

// Componente Wrapper para Formularios
function GenericFormModal({ children, title, icon: Icon, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="relative w-full max-w-xl bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col max-h-[90vh] overflow-hidden border border-white/60">
        <div className="bg-white/40 backdrop-blur-md p-5 flex items-center justify-between border-b border-white/50">
          <div className="flex items-center gap-3 text-gray-800"><div className="p-2 bg-white/60 rounded-xl shadow-sm border border-white/60"><Icon className="w-5 h-5 text-[#e65100]" /></div><h2 className="text-lg font-black">{title}</h2></div>
          <button onClick={onClose} className="p-2 bg-white/50 hover:bg-white/80 border border-white/60 rounded-full text-gray-600 transition-colors shadow-sm"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </motion.div>
    </div>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  // ENRUTAMIENTO Y SELECCIÓN DE ANIMAL
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [inventory, setInventory] = useState<any[]>(initialInventory);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);

  // ESTADOS DE LA VISTA DETALLE
  const [isGraphExpanded, setIsGraphExpanded] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const closeModal = () => setActiveModal(null);
  
  const [bathRequested, setBathRequested] = useState(false);
  const [showAllHerd, setShowAllHerd] = useState(false);

  // Obtener el animal actualmente seleccionado
  const currentAnimal = inventory.find(a => a.id === selectedAnimalId) || inventory[0];

  // Lógica de Gráfico Dinámico (Leche vs Peso)
  const isLeche = currentAnimal.sex === 'Hembra' && currentAnimal.category === 'Vaca';
  const graphTitle = isLeche ? "Rendimiento (Leche)" : "Curva de Crecimiento";
  const graphUnit = isLeche ? "L/d" : "Kg";
  const currentChartData = isLeche ? chartDataLeche : chartDataPeso;

  // --- LÓGICAS DE NEGOCIO Y MUTACIÓN DE ESTADO ---
  
  const handleCreateManualAnimal = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAnimal = {
      id: formData.get('arete') as string,
      name: formData.get('nombre') as string || "Sin Nombre",
      category: formData.get('categoria') as string,
      breed: formData.get('raza') as string,
      sex: formData.get('sexo') as string,
      age: "Recién Ingresado",
      lot: formData.get('lote') as string,
      paddock: formData.get('potrero') as string,
      status: "Activo",
      type: "success",
      bodyCondition: formData.get('cc') as string || "3.0",
      reproStatus: formData.get('sexo') === 'Macho' ? 'N/A' : 'Vacía',
      tracking: false,
      photo: DEFAULT_PHOTO,
      trackingData: { deviceId: "Sin dispositivo", isOnline: false, location: formData.get('potrero') as string },
      genetics: { father: "Desconocido", mother: "Desconocido" },
      activePregnancy: null, pregnancyHistory: [], descendants: [],
      vaccines: [], parasites: [], observations: [], deathRecord: null
    };
    setInventory([newAnimal, ...inventory]);
    closeModal();
  };

  const handleDeathRegistration = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const record = { cause: formData.get('cause'), obs: formData.get('obs'), date: new Date().toLocaleDateString() };
    
    setInventory(prev => prev.map(a => a.id === selectedAnimalId ? { ...a, status: "Baja", type: "danger", deathRecord: record } : a));
    closeModal();
  };

  const handleParto = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sexo = formData.get('sexo') as string;
    const peso = formData.get('peso') as string;
    const estado = formData.get('estado') as string;
    
    const newAreteId = `${sexo.substring(0,1).toUpperCase()}-${Math.floor(Math.random() * 1000 + 500)}`;
    const isAlive = estado !== 'Muerto';

    setInventory(prev => prev.map(animal => {
      if (animal.id !== selectedAnimalId) return animal;

      const newHistory = [{
        id: Date.now(), status: isAlive ? "Parto Exitoso" : "Parto (Cría Muerta)",
        serviceDate: animal.activePregnancy.serviceDate, father: animal.activePregnancy.father,
        endDate: new Date().toLocaleDateString(), resultDetail: `Cría ${sexo} (${newAreteId}) - Peso: ${peso}Kg`
      }, ...animal.pregnancyHistory];

      const newDescendants = isAlive ? [...animal.descendants, { id: newAreteId, date: new Date().getFullYear().toString(), status: "Cría Nueva", type: "success" }] : animal.descendants;

      return { ...animal, pregnancyHistory: newHistory, descendants: newDescendants, activePregnancy: null, reproStatus: "Vacía" };
    }));

    if(isAlive) {
      setInventory(prev => [{
        id: newAreteId, name: `Cría de ${currentAnimal.id}`, category: sexo === 'Macho' ? 'Becerro' : 'Becerra', breed: currentAnimal.breed, sex: sexo, age: "0 Días", lot: "Maternidad", paddock: currentAnimal.paddock, status: "Activo", type: "success", bodyCondition: "N/A", reproStatus: "N/A", tracking: false, photo: DEFAULT_PHOTO,
        trackingData: { deviceId: "Sin dispositivo", isOnline: false, location: currentAnimal.paddock },
        genetics: { father: currentAnimal.activePregnancy?.father || "Desconocido", mother: currentAnimal.id },
        activePregnancy: null, pregnancyHistory: [], descendants: [], vaccines: [], parasites: [], observations: [], deathRecord: null
      }, ...prev]);
    }
    closeModal();
  };

  const handlePalpacion = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const diagnostico = formData.get('diagnostico') as string;
    const obs = formData.get('obs') as string;

    setInventory(prev => prev.map(animal => {
      if (animal.id !== selectedAnimalId) return animal;

      if (!animal.activePregnancy && diagnostico === 'Preñada') {
        return { ...animal, reproStatus: "Preñada (Confirmada)", activePregnancy: { id: Date.now(), serviceDate: "Por determinar", father: "Monta Múltiple", palpationDate: new Date().toLocaleDateString(), palpationResult: "Preñada", projectedBirth: "Calculando..." } };
      } else if (animal.activePregnancy && diagnostico === 'Vacía') {
        const newHistory = [{ id: Date.now(), status: "Pérdida / Aborto", serviceDate: animal.activePregnancy.serviceDate, father: animal.activePregnancy.father, endDate: new Date().toLocaleDateString(), resultDetail: "Diagnosticada vacía. " + obs }, ...animal.pregnancyHistory];
        return { ...animal, activePregnancy: null, pregnancyHistory: newHistory, reproStatus: "Vacía" };
      } else if (animal.activePregnancy && diagnostico === 'Preñada') {
        return { ...animal, activePregnancy: { ...animal.activePregnancy, palpationDate: new Date().toLocaleDateString(), palpationResult: "Preñada (Confirmada)" } };
      }
      return animal;
    }));
    closeModal();
  };

  const applyVaccine = (vaccineId: number, name: string) => {
    setInventory(prev => prev.map(animal => {
      if (animal.id !== selectedAnimalId) return animal;
      const updatedVaccines = animal.vaccines.map((v:any) => v.id === vaccineId ? { ...v, actual: new Date().toLocaleDateString(), status: "Aplicada", type: "success" } : v);
      const nextDate = new Date(); nextDate.setMonth(nextDate.getMonth() + 6);
      updatedVaccines.push({ id: Date.now(), name, dose: "Siguiente Dosis", planned: nextDate.toLocaleDateString(), actual: "-", status: "Proyectado", type: "info" });
      return { ...animal, vaccines: updatedVaccines };
    }));
  };

  const applyParasite = (parasiteId: number, name: string) => {
    setInventory(prev => prev.map(animal => {
      if (animal.id !== selectedAnimalId) return animal;
      const updatedParasites = animal.parasites.map((p:any) => p.id === parasiteId ? { ...p, actual: new Date().toLocaleDateString(), status: "Aplicado", type: "success" } : p);
      return { ...animal, parasites: updatedParasites };
    }));
  };

  const handleAddObservation = (e: any) => {
    e.preventDefault();
    const text = e.target.elements.obsText.value;
    if (!text.trim()) return;
    setInventory(prev => prev.map(animal => {
      if (animal.id !== selectedAnimalId) return animal;
      return { ...animal, observations: [{ id: Date.now(), author: "Usuario Actual", date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), text }, ...animal.observations] };
    }));
    e.target.reset();
  };

  // =========================================
  // RENDER: VISTA DE LISTADO (INVENTARIO DATA GRID)
  // =========================================
  const renderListView = () => (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-8 relative custom-scrollbar z-10">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 backdrop-blur-2xl border border-white/60 p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div>
            <h1 className="text-3xl font-black text-slate-800 drop-shadow-sm flex items-center gap-3">
              <LayoutGrid className="w-8 h-8 text-[#e65100]" /> Inventario Global
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1">Gestión y control de rebaño ({inventory.length} animales registrados en la finca)</p>
          </div>
          <Button onClick={() => setActiveModal('nuevo_animal')} className="shadow-orange-500/40 py-3 px-6 whitespace-nowrap">
            <Plus className="w-5 h-5" /> Registrar Animal
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Buscar por arete, nombre, raza, categoría o potrero..." className="w-full bg-white/50 backdrop-blur-xl border border-white/60 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:border-[#e65100] outline-none shadow-inner transition-colors" />
          </div>
          <Button variant="secondary" className="px-6 hidden sm:flex"><Filter className="w-5 h-5" /> Filtros Avanzados</Button>
        </div>

        <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/40 border-b border-white/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Identificación</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Clasificación</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Ubicación & IoT</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Salud & Físico</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Reproductivo</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(animal => (
                  <tr key={animal.id} className="border-b border-white/30 hover:bg-white/60 transition-colors cursor-pointer group" onClick={() => { setSelectedAnimalId(animal.id); setCurrentView('detail'); }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Agregado onError por si algún enlace a imagen falla */}
                        <img 
                          src={animal.photo} 
                          onError={(e) => { e.currentTarget.src = DEFAULT_PHOTO; }} 
                          className="w-12 h-12 rounded-xl object-cover border border-white/80 shadow-sm" 
                          alt={animal.name} 
                        />
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-[#e65100] transition-colors flex items-center gap-1">
                            {animal.id} <span className="text-[10px] font-bold text-slate-400">{animal.sex === 'Macho' ? '♂' : '♀'}</span>
                          </p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{animal.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{animal.category}</p>
                      <p className="text-[10px] font-semibold text-slate-500">{animal.breed} • {animal.age}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{animal.lot}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <p className="text-[10px] font-semibold text-slate-500">{animal.paddock}</p>
                        {animal.tracking && (
                          <div className="flex items-center gap-1 ml-2 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            <Wifi className="w-2.5 h-2.5 text-emerald-500" />
                            <span className="text-[8px] font-bold text-emerald-600 uppercase">GPS Activo</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={animal.type} className="mb-1">{animal.status}</Badge>
                      <p className="text-[10px] font-bold text-slate-500">C.C: <span className="text-slate-700">{animal.bodyCondition}</span></p>
                    </td>
                    <td className="px-6 py-4">
                      {animal.reproStatus !== 'N/A' ? (
                        <div className="flex flex-col">
                          <span className={cn("text-xs font-bold", animal.reproStatus.includes('Preñada') ? "text-[#e65100]" : "text-slate-600")}>{animal.reproStatus}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase">No Aplica</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2.5 bg-white/60 border border-white/80 rounded-xl text-slate-500 group-hover:text-[#e65100] group-hover:border-[#e65100]/30 transition-all shadow-sm">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================
  // RENDER: VISTA DETALLE (DINÁMICA POR ANIMAL)
  // =========================================
  const renderDetailView = () => (
    <>
      <aside className="w-[340px] h-full bg-white/40 backdrop-blur-2xl border-r border-white/60 flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.05)] overflow-y-auto custom-scrollbar relative">
        <div className="bg-white/30 backdrop-blur-md border-b border-white/40 p-4 flex items-center gap-3 cursor-pointer hover:bg-white/60 transition-colors" onClick={() => setCurrentView('list')}>
          <div className="p-1.5 bg-white/60 rounded-lg shadow-sm border border-white/80"><ArrowLeft className="w-4 h-4 text-slate-700" /></div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Volver al Inventario</span>
        </div>

        <div className="h-64 w-full relative shrink-0 bg-gray-900 group">
          {/* Agregado onError por si algún enlace a imagen falla en el detalle */}
          <img 
            src={currentAnimal.photo} 
            onError={(e) => { e.currentTarget.src = DEFAULT_PHOTO; }} 
            alt="Animal" 
            className="w-full h-full object-cover opacity-90 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {!currentAnimal.deathRecord ? (
              <Badge variant="success" className="bg-emerald-500/80 backdrop-blur-md text-white border-white/30"><CheckCircle2 className="w-3 h-3" /> {currentAnimal.status}</Badge>
            ) : (
              <Badge variant="danger" className="bg-red-500/80 backdrop-blur-md text-white border-white/30 animate-pulse"><Skull className="w-3 h-3" /> Baja</Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-1">{currentAnimal.name}</p>
            <h1 className="text-4xl font-black drop-shadow-xl leading-none">{currentAnimal.id}</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-5">
          <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-3 mb-5 flex items-center justify-between shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-sm border border-white">
                <Wifi className={cn("w-5 h-5", currentAnimal.trackingData.isOnline ? "text-emerald-500" : "text-slate-400")} />
                {currentAnimal.trackingData.isOnline && <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID Seguimiento</span>
                <span className="text-sm font-black text-slate-800">{currentAnimal.trackingData.deviceId}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setActiveModal('mapa')} className="p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 text-slate-600 hover:text-[#e65100] shadow-sm transition-all hover:scale-105"><MapPin className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6 shrink-0">
            {[
              { l: "Raza", v: currentAnimal.breed }, { l: "Sexo", v: currentAnimal.sex },
              { l: "Edad", v: currentAnimal.age }, { l: "Categoría", v: currentAnimal.category },
              { l: "Lote", v: currentAnimal.lot }, { l: "C. Corporal", v: currentAnimal.bodyCondition },
            ].map((item, i) => (
              <div key={i} className="flex flex-col bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">{item.l}</span>
                <span className="text-xs font-black text-slate-800">{item.v}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-4 mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
            <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-3 flex items-center gap-1"><Network className="w-3 h-3"/> Registro Genético</h4>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-500 text-sm font-bold border border-white shadow-sm">♂</span>
                <div className="flex flex-col"><span className="text-[10px] text-slate-500 font-bold uppercase">Padre</span><span className="text-sm font-bold text-slate-800">{currentAnimal.genetics.father}</span></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-500 text-sm font-bold border border-white shadow-sm">♀</span>
                <div className="flex flex-col"><span className="text-[10px] text-slate-500 font-bold uppercase">Madre</span><span className="text-sm font-bold text-slate-800">{currentAnimal.genetics.mother}</span></div>
              </div>
            </div>
            <Button variant="secondary" className="w-full text-xs" onClick={() => setActiveModal('arbol')}>Árbol Genealógico</Button>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-2 shrink-0 border-t border-white/50">
            {!currentAnimal.deathRecord && (
              <Button variant="danger" className="w-full py-2.5" onClick={() => setActiveModal('baja')}><Skull className="w-4 h-4" /> Registrar Baja</Button>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-6 lg:p-8 relative custom-scrollbar z-10">
        <div className="max-w-[1000px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-black text-slate-800 drop-shadow-sm flex items-center gap-2">Panel Operativo</h2>
          </div>
          <div className="flex flex-col gap-6 w-full">
            
            {/* LÓGICA DINÁMICA: Mostrar estado reproductivo solo si aplica */}
            {currentAnimal.sex === 'Hembra' && (currentAnimal.category === 'Vaca' || currentAnimal.category === 'Novilla') ? (
              <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col w-full relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-white/50 pb-4">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Baby className="w-6 h-6 text-[#e65100]" /> Estado Reproductivo</h3>
                  <Button variant="secondary" className="text-xs" onClick={() => setActiveModal('historial_repro')}><CalendarDays className="w-4 h-4" /> Historial de Preñeces</Button>
                </div>
                {currentAnimal.activePregnancy ? (
                  <div className="bg-orange-100/40 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 relative shadow-inner">
                    <div className="absolute top-0 right-0 bg-orange-200/60 backdrop-blur-md text-[#e65100] text-[10px] font-black px-4 py-2 rounded-bl-2xl rounded-tr-2xl border-b border-l border-white/50 uppercase tracking-wider">Gestación Activa</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mt-4">
                      <div className="hidden md:block absolute top-6 left-24 right-24 h-0.5 bg-orange-300/50 z-0"></div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full border-2 border-white flex items-center justify-center text-emerald-500 shadow-md mb-3"><CheckCircle2 className="w-6 h-6" /></div>
                        <p className="text-xs font-bold text-slate-800">Servicio Confirmado</p>
                        <p className="text-[10px] text-slate-500 font-medium">Padre: {currentAnimal.activePregnancy.father}</p>
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-orange-100/80 backdrop-blur-sm rounded-full border-2 border-white flex items-center justify-center text-[#e65100] shadow-md mb-3"><Stethoscope className="w-6 h-6" /></div>
                        <p className="text-xs font-bold text-slate-800">Palpación</p>
                        <p className="text-[10px] font-black text-[#e65100]">{currentAnimal.activePregnancy.palpationResult}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{currentAnimal.activePregnancy.palpationDate}</p>
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full border-2 border-white flex items-center justify-center text-slate-400 shadow-md mb-3"><Baby className="w-5 h-5" /></div>
                        <p className="text-xs font-bold text-slate-800">Parto Estimado</p>
                        <p className="text-[10px] font-bold text-slate-600">{currentAnimal.activePregnancy.projectedBirth}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Button variant="secondary" className="flex-1 border-dashed" onClick={() => setActiveModal('palpacion')} disabled={!!currentAnimal.deathRecord}><Stethoscope className="w-4 h-4" /> Actualizar Palpación</Button>
                      <Button className="flex-1 shadow-orange-500/40" onClick={() => setActiveModal('parto')} disabled={!!currentAnimal.deathRecord}><Baby className="w-4 h-4" /> Confirmar Parto</Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/40 backdrop-blur-sm border border-dashed border-white/80 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-inner">
                    <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center shadow-sm border border-white mb-4 text-slate-400"><AlertCircle className="w-8 h-8" /></div>
                    <h4 className="text-slate-800 font-black text-xl mb-2">Sin Gestación Activa</h4>
                    <p className="text-sm text-slate-500 mb-8 max-w-md font-medium">La vaca se encuentra actualmente vacía u horra. Registre un nuevo servicio o una palpación positiva para iniciar un nuevo ciclo.</p>
                    <Button onClick={() => setActiveModal('palpacion')} disabled={!!currentAnimal.deathRecord}><Stethoscope className="w-4 h-4"/> Registrar Servicio / Palpación</Button>
                  </div>
                )}
              </div>
            ) : currentAnimal.sex === 'Macho' ? (
              <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-orange-100/80 rounded-full flex items-center justify-center shadow-sm border border-white mb-4 text-[#e65100]"><Activity className="w-8 h-8" /></div>
                <h4 className="text-slate-800 font-black text-xl mb-2">Control de Semental</h4>
                <p className="text-sm text-slate-500 max-w-md font-medium">El seguimiento de gestación y partos no aplica para machos. Toda la descendencia engendrada por este animal se refleja en su árbol genealógico interactivo.</p>
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-100/80 rounded-full flex items-center justify-center shadow-sm border border-white mb-4 text-blue-500"><Baby className="w-8 h-8" /></div>
                <h4 className="text-slate-800 font-black text-xl mb-2">Aún no apta para reproducción</h4>
                <p className="text-sm text-slate-500 max-w-md font-medium">Este animal ({currentAnimal.category}) se encuentra en etapa de desarrollo o levante. El módulo reproductivo se activará cuando alcance la categoría de Novilla.</p>
              </div>
            )}

            {/* --- 2. PLAN DE VACUNACIÓN --- */}
            <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col w-full">
              <div className="flex justify-between items-center mb-5 border-b border-white/50 pb-4">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Syringe className="w-6 h-6 text-blue-500" /> Plan de Vacunación</h3>
                <Button variant="secondary" className="text-xs py-1.5" onClick={() => setActiveModal('vacuna')} disabled={!!currentAnimal.deathRecord}><Plus className="w-4 h-4"/> Nueva Vacuna</Button>
              </div>
              <div className="flex-1 flex flex-col rounded-2xl border border-white/60 overflow-hidden bg-white/30 backdrop-blur-sm shadow-inner">
                <div className="grid grid-cols-12 gap-2 p-4 bg-white/40 border-b border-white/50">
                  <div className="col-span-5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Vacuna / Dosis</div>
                  <div className="col-span-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Planificado</div>
                  <div className="col-span-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Estado</div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {currentAnimal.vaccines.map((v:any) => (
                    <div key={v.id} className="grid grid-cols-12 gap-2 items-center p-4 border-b border-white/40 last:border-0 hover:bg-white/50 transition-colors">
                      <div className="col-span-5"><p className="text-sm font-bold text-slate-800">{v.name}</p><p className="text-[10px] font-semibold text-slate-500">{v.dose}</p></div>
                      <div className="col-span-3 text-xs font-bold text-slate-600 text-center">{v.planned}</div>
                      <div className="col-span-4 flex justify-end">
                        {v.status === 'Pendiente' || v.status === 'Proyectado' ? (
                          <button onClick={() => applyVaccine(v.id, v.name)} className="text-[10px] font-bold bg-blue-500/10 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 border border-blue-300/50 transition-colors shadow-sm active:scale-95" disabled={!!currentAnimal.deathRecord}>Aplicar Dosis</button>
                        ) : (<Badge variant={v.type}>{v.actual}</Badge>)}
                      </div>
                    </div>
                  ))}
                  {currentAnimal.vaccines.length === 0 && <div className="p-4 text-center text-xs text-slate-500">No hay vacunas registradas.</div>}
                </div>
              </div>
            </div>

            {/* --- 3. CONTROL ANTIPARASITARIO --- */}
            <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col w-full">
              <div className="flex justify-between items-center mb-5 border-b border-white/50 pb-4">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Bug className="w-6 h-6 text-purple-500" /> Antiparasitario</h3>
                <Button variant="secondary" className="text-xs" onClick={() => setActiveModal('parasito')} disabled={!!currentAnimal.deathRecord}><Plus className="w-4 h-4"/> Nuevo Baño</Button>
              </div>
              <div className="flex flex-col rounded-2xl border border-white/60 overflow-hidden mb-5 bg-white/30 backdrop-blur-sm shadow-inner">
                 <div className="grid grid-cols-12 gap-2 p-4 bg-white/40 border-b border-white/50">
                  <div className="col-span-6 text-[10px] font-black text-slate-500 uppercase tracking-wider">Tratamiento</div>
                  <div className="col-span-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Planificado</div>
                  <div className="col-span-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Estado</div>
                </div>
                {currentAnimal.parasites.map((p:any) => (
                  <div key={p.id} className="p-4 border-b border-white/40 last:border-0 flex items-center hover:bg-white/50 transition-colors">
                    <div className="w-1/2"><p className="text-sm font-bold text-slate-800">{p.name}</p><p className="text-[10px] font-semibold text-slate-500">{p.product}</p></div>
                    <div className="w-1/4 text-xs font-bold text-center text-slate-600">{p.planned}</div>
                    <div className="w-1/4 flex justify-end">
                      {p.status === 'Pendiente' ? (
                        <button onClick={() => applyParasite(p.id, p.name)} className="text-[10px] font-bold bg-purple-500/10 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-500/20 border border-purple-300/50 transition-colors shadow-sm active:scale-95" disabled={!!currentAnimal.deathRecord}>Aplicar</button>
                      ) : (<Badge variant={p.type}>{p.status}</Badge>)}
                    </div>
                  </div>
                ))}
                {currentAnimal.parasites.length === 0 && <div className="p-4 text-center text-xs text-slate-500">No hay tratamientos registrados.</div>}
              </div>
              <Button variant={bathRequested ? "secondary" : "primary"} className="w-full" onClick={() => setBathRequested(true)} disabled={!!currentAnimal.deathRecord}>{bathRequested ? "Orden Global Generada" : "Solicitar Nuevo Baño"}</Button>
            </div>

            {/* --- 4. BITÁCORA --- */}
            <div className="bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col w-full">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-5 border-b border-white/50 pb-4"><MessageSquare className="w-6 h-6 text-slate-500" /> Bitácora de Novedades</h3>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar min-h-[100px] flex-1">
                {currentAnimal.observations.map((obs:any) => (
                  <div key={obs.id} className="p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-2"><span className="text-xs font-black text-[#e65100] bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-200/50">{obs.author}</span><span className="text-[10px] text-slate-500 font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> {obs.date}</span></div>
                    <p className="text-sm font-medium text-slate-700">{obs.text}</p>
                  </div>
                ))}
                {currentAnimal.observations.length === 0 && <div className="text-center text-xs text-slate-500 mt-4">Sin observaciones recientes.</div>}
              </div>
              <form onSubmit={handleAddObservation} className="mt-5 pt-5 border-t border-white/50 flex gap-3">
                <input type="text" name="obsText" required placeholder="Escribir observación..." className="flex-1 bg-white/60 backdrop-blur-md border border-white/80 rounded-xl px-4 text-sm font-medium text-slate-800 focus:bg-white focus:border-[#e65100] outline-none shadow-inner transition-all placeholder:text-slate-400" />
                <Button type="submit" className="px-5 shadow-orange-500/40"><Plus className="w-5 h-5" /></Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <aside className={cn("h-full bg-white/40 backdrop-blur-2xl border-l border-white/60 transition-all duration-500 ease-in-out flex flex-col shrink-0 z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.05)] relative", isGraphExpanded ? "w-[360px] xl:w-[420px]" : "w-[70px]")}>
        <button onClick={() => setIsGraphExpanded(!isGraphExpanded)} className="absolute -left-5 top-10 w-10 h-14 bg-white/70 backdrop-blur-xl border border-white/80 rounded-l-2xl flex items-center justify-center text-slate-500 hover:text-[#e65100] shadow-[-4px_4px_15px_rgba(0,0,0,0.05)] z-30 transition-colors">
          <ChevronRight className={cn("w-6 h-6 transition-transform duration-500", isGraphExpanded ? "" : "rotate-180")} />
        </button>
        <div className={cn("flex-1 p-6 lg:p-8 flex flex-col overflow-hidden transition-opacity duration-300", isGraphExpanded ? "opacity-100" : "opacity-0 invisible")}>
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2"><Activity className="w-6 h-6 text-[#e65100]" /> {graphTitle}</h3>
          
          {isLeche ? (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm"><p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Promedio</p><p className="text-4xl font-black text-slate-800 mt-2 drop-shadow-sm">20.8 <span className="text-sm font-bold text-slate-500">{graphUnit}</span></p></div>
              <div className="bg-orange-100/40 backdrop-blur-md rounded-2xl p-5 border border-orange-200/50 shadow-sm"><p className="text-[10px] font-black text-[#e65100] uppercase tracking-wider">Pico</p><p className="text-4xl font-black text-[#e65100] mt-2 drop-shadow-sm">25.0 <span className="text-sm font-bold text-[#e65100]/70">{graphUnit}</span></p></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 mb-8">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm"><p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Peso Actual Estimado</p><p className="text-4xl font-black text-slate-800 mt-2 drop-shadow-sm">175.0 <span className="text-sm font-bold text-slate-500">{graphUnit}</span></p></div>
            </div>
          )}
          
          <div className="flex-1 w-full min-h-[300px] bg-white/30 backdrop-blur-md rounded-3xl border border-white/50 p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs><linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e65100" stopOpacity={0.4}/><stop offset="95%" stopColor="#e65100" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.5)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} fontFamily="font-bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="font-bold" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="value" stroke="#e65100" strokeWidth={4} fillOpacity={1} fill="url(#colorLiters)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </aside>
    </>
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex font-sans selection:bg-[#ffcc80] relative text-slate-800">
      {/* BACKGROUND ANIMADO GLASSMORPHISM */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#eef2f6]">
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-400/20 blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-orange-500/15 blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-emerald-400/15 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '4s' }} />
      </div>

      {currentView === 'list' ? renderListView() : renderDetailView()}

      {/* =========================================
          SISTEMA DE MODALES WIZARD (GLASSMORPHISM)
          ========================================= */}
      <AnimatePresence>
        
        {/* WIZARD: NUEVO ANIMAL (MANUAL DESDE INVENTARIO) */}
        {activeModal === 'nuevo_animal' && (
          <GenericFormModal title="Registrar Nuevo Animal" icon={Plus} onClose={closeModal}>
            <form onSubmit={handleCreateManualAnimal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Número de Arete / ID</label><input type="text" name="arete" required className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" placeholder="Ej. #99882" /></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Nombre (Opcional)</label><input type="text" name="nombre" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" placeholder="Ej. Estrella" /></div>
                
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Sexo</label><select name="sexo" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner"><option>Hembra</option><option>Macho</option></select></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Categoría</label><select name="categoria" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner"><option>Vaca</option><option>Novilla</option><option>Mauta</option><option>Becerra</option><option>Toro</option><option>Maute</option><option>Becerro</option></select></div>
                
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Raza Principal</label><select name="raza" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner"><option>Carora</option><option>Holstein</option><option>Jersey</option><option>Gyr</option><option>Mestizo</option></select></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Condición Corporal</label><input type="number" step="0.1" name="cc" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" placeholder="Ej. 3.5" /></div>

                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Lote / Grupo</label><select name="lote" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner"><option>Lote Alta Producción</option><option>Levante</option><option>Desarrollo</option><option>Enfermería</option></select></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Potrero (Ubicación)</label><select name="potrero" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner"><option>Potrero 1</option><option>Potrero 2</option><option>Potrero 3</option><option>Potrero 4</option></select></div>
              </div>
              <Button type="submit" className="w-full mt-4 py-3 shadow-orange-500/40">Guardar Nuevo Animal</Button>
            </form>
          </GenericFormModal>
        )}

        {/* WIZARD: HISTORIAL DE PREÑECES */}
        {activeModal === 'historial_repro' && (
          <GenericFormModal title="Historial de Gestaciones" icon={CalendarDays} onClose={closeModal}>
             <div className="space-y-4">
                {currentAnimal.pregnancyHistory.map((preg:any) => (
                  <div key={preg.id} className="p-5 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={preg.status.includes('Exitoso') ? 'success' : 'danger'}>{preg.status}</Badge>
                        <span className="text-xs font-bold text-slate-700">Cierre: {preg.endDate}</span>
                      </div>
                      <p className="text-sm text-slate-800 font-black">{preg.resultDetail}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Servicio: {preg.serviceDate} | Padre: <span className="font-black text-[#e65100]">{preg.father}</span></p>
                    </div>
                  </div>
                ))}
                {currentAnimal.pregnancyHistory.length === 0 && <div className="text-center text-sm text-slate-500">No hay gestaciones previas.</div>}
              </div>
          </GenericFormModal>
        )}

        {/* WIZARD: MAPA IOT */}
        {activeModal === 'mapa' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-4xl h-[80vh] bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-white/60">
              <div className="px-6 py-5 border-b border-white/50 flex justify-between items-center bg-white/40 z-10">
                <div><h2 className="text-lg font-black text-slate-800">Ubicación GPS: {currentAnimal.trackingData.deviceId}</h2></div>
                <button onClick={closeModal} className="p-2 bg-white/60 border border-white/80 rounded-full text-slate-600 shadow-sm"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 bg-slate-100/40 p-6 relative">
                <div className="absolute inset-6 grid grid-cols-2 grid-rows-2 gap-4">
                  {['Potrero 1', 'Potrero 2', 'Potrero 3', 'Potrero 4'].map((p, i) => (
                    <div key={i} className="bg-emerald-100/30 backdrop-blur-sm border-2 border-emerald-200/50 rounded-3xl relative overflow-hidden shadow-inner">
                      <span className="absolute bottom-4 left-4 text-sm font-black text-emerald-800 opacity-30 uppercase tracking-widest">{p}</span>
                      {p === currentAnimal.trackingData.location && (
                        <motion.div className="absolute w-6 h-6 bg-[#e65100] rounded-full border-2 border-white shadow-[0_0_15px_rgba(230,81,0,0.5)] z-20 flex items-center justify-center"
                          initial={{ left: '50%', top: '50%' }} animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }} transition={{ duration: 10, repeat: Infinity }}
                        >
                           <div className="absolute -top-8 bg-slate-800/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20">{currentAnimal.id}</div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* WIZARD: REGISTRO DE BAJA */}
        {activeModal === 'baja' && (
          <GenericFormModal title={`Registrar Baja de ${currentAnimal.id}`} icon={Skull} onClose={closeModal}>
            <form onSubmit={handleDeathRegistration} className="space-y-4">
                <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Motivo</label><select name="cause" required className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-slate-800 shadow-inner"><option value="Enfermedad Infecciosa">Enfermedad Infecciosa</option><option value="Accidente">Accidente / Traumatismo</option></select></div>
                <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Observaciones</label><textarea name="obs" required rows={3} className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 text-sm font-bold focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none resize-none text-slate-800 shadow-inner"></textarea></div>
                <Button type="submit" variant="danger" className="w-full mt-2 py-3 shadow-red-500/40">Confirmar Baja</Button>
            </form>
          </GenericFormModal>
        )}

        {/* WIZARD: PALPACIÓN */}
        {activeModal === 'palpacion' && (
          <GenericFormModal title="Registrar Palpación" icon={Stethoscope} onClose={closeModal}>
            <form onSubmit={handlePalpacion}>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Diagnóstico</label><select name="diagnostico" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner"><option>Preñada</option><option>Vacía</option></select></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Observaciones</label><input type="text" name="obs" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" /></div>
              </div>
              <Button type="submit" className="w-full mt-8 py-3">Guardar Resultado</Button>
            </form>
          </GenericFormModal>
        )}

        {/* WIZARD: PARTO */}
        {activeModal === 'parto' && (
          <GenericFormModal title="Registrar Parto" icon={Baby} onClose={closeModal}>
            <form onSubmit={handleParto}>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Sexo de la Cría</label><select name="sexo" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner"><option>Macho</option><option>Hembra</option></select></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Peso (Kg)</label><input type="number" name="peso" defaultValue={35} className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" /></div>
                <div className="col-span-2 md:col-span-1"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Estado</label><select name="estado" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner"><option>Vivo</option><option>Muerto</option></select></div>
              </div>
              <Button type="submit" className="w-full mt-8 py-3">Confirmar Parto y Generar Arete</Button>
            </form>
          </GenericFormModal>
        )}

        {/* WIZARD: NUEVA VACUNA */}
        {activeModal === 'vacuna' && (
          <GenericFormModal title="Nueva Vacuna" icon={Syringe} onClose={closeModal}>
            <div className="space-y-5">
              <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Tipo de Vacuna</label><input type="text" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" placeholder="Ej. Brucelosis" /></div>
              <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Fecha Programada</label><input type="date" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" /></div>
              <Button className="w-full mt-4 py-3" onClick={closeModal}>Agendar Vacuna</Button>
            </div>
          </GenericFormModal>
        )}

        {/* WIZARD: NUEVO ANTIPARASITARIO */}
        {activeModal === 'parasito' && (
          <GenericFormModal title="Nuevo Control Antiparasitario" icon={Bug} onClose={closeModal}>
            <div className="space-y-5">
              <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Tratamiento / Método</label><input type="text" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" placeholder="Ej. Baño de inmersión" /></div>
              <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Producto</label><input type="text" className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-xl py-3.5 px-4 focus:border-[#e65100] focus:ring-2 focus:ring-[#e65100]/20 outline-none text-sm font-bold text-slate-800 shadow-inner" placeholder="Ej. Ivermectina" /></div>
              <Button className="w-full mt-4 py-3" onClick={closeModal}>Agendar Tratamiento</Button>
            </div>
          </GenericFormModal>
        )}

        {/* WIZARD: ÁRBOL GENEALÓGICO */}
        {activeModal === 'arbol' && (
          <GenericFormModal title="Árbol Genealógico" icon={Network} onClose={closeModal}>
            <div className="flex flex-col items-center py-6 gap-6">
              <div className="flex gap-10">
                <div className="bg-white/60 backdrop-blur-md border border-white/80 p-4 rounded-2xl text-center shadow-sm w-40"><p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Padre</p><p className="text-sm font-black text-slate-800 mt-1">{currentAnimal.genetics.father}</p></div>
                <div className="bg-white/60 backdrop-blur-md border border-white/80 p-4 rounded-2xl text-center shadow-sm w-40"><p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Madre</p><p className="text-sm font-black text-slate-800 mt-1">{currentAnimal.genetics.mother}</p></div>
              </div>
              <div className="w-px h-10 bg-slate-300"></div>
              <div className="bg-gradient-to-br from-[#e65100] to-[#ff7043] text-white p-5 rounded-2xl text-center shadow-lg w-52 border border-orange-300/50"><p className="text-[10px] uppercase font-black text-white/80 tracking-widest">Animal Actual</p><h3 className="text-3xl font-black mt-1 drop-shadow-md">{currentAnimal.id}</h3></div>
              <div className="w-px h-10 bg-slate-300"></div>
              <div className="flex flex-wrap justify-center gap-6">
                 {currentAnimal.descendants.map((d:any, i:any) => (
                   <div key={i} className="border border-emerald-300/50 bg-emerald-50/50 backdrop-blur-md p-4 rounded-2xl text-center shadow-sm w-40"><p className="text-[10px] text-emerald-700 uppercase font-black tracking-wider">Hijo ({d.date})</p><p className="text-sm font-black text-slate-800 mt-1">{d.id}</p></div>
                 ))}
                 {currentAnimal.activePregnancy && (
                   <div className="border border-orange-300/50 bg-orange-50/50 backdrop-blur-md p-4 rounded-2xl text-center shadow-sm w-40"><p className="text-[10px] text-[#e65100] uppercase font-black tracking-wider">En Gestación</p><p className="text-sm font-black text-slate-800 mt-1">{currentAnimal.activePregnancy.projectedBirth}</p></div>
                 )}
                 {currentAnimal.descendants.length === 0 && !currentAnimal.activePregnancy && <div className="text-sm text-slate-500">Sin descendencia registrada.</div>}
              </div>
            </div>
          </GenericFormModal>
        )}

      </AnimatePresence>
    </div>
  );
}