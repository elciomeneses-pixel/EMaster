
import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Apple, Zap, Flame, Target, Users } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Profile, MealAnalysis } from '../types';
import { analyzeMealImage } from '../geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface HomeProps {
  activeProfile: Profile | null;
  onSaveMeal: (meal: MealAnalysis) => void;
}

export const Home: React.FC<HomeProps> = ({ activeProfile, onSaveMeal }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProfile) return;

    setAnalyzing(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const analysis = await analyzeMealImage(base64, activeProfile);
        setResult(analysis);
        onSaveMeal(analysis);
      } catch (error) {
        console.error("Erro ao analisar imagem:", error);
        alert("Falha ao analisar a imagem. Por favor, tente novamente.");
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const chartData = result ? [
    { name: 'Proteína', value: result.protein, color: '#10b981' },
    { name: 'Carboidratos', value: result.carbs, color: '#3b82f6' },
    { name: 'Gordura', value: result.fat, color: '#f59e0b' },
  ] : [];

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <GlassCard className="p-8 w-full border-dashed border-2 border-emerald-500/30">
          <Users className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Nenhum Perfil Ativo</h2>
          <p className="text-white/60 mb-6">Crie ou selecione um perfil para começar a monitorar sua nutrição.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Rastreador de Nutrição</h2>
        <p className="text-emerald-400/80 text-sm">Envie uma foto da sua refeição para análise instantânea</p>
      </div>

      {!result && !analyzing && (
        <div className="grid grid-cols-1 gap-4">
          <GlassCard 
            className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/40"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-emerald-500" />
            </div>
            <p className="font-medium text-lg">Capturar Refeição</p>
            <p className="text-white/40 text-sm mt-1">Câmera ou Galeria</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
              capture="environment"
            />
          </GlassCard>
        </div>
      )}

      {analyzing && (
        <GlassCard className="flex flex-col items-center justify-center py-20 animate-pulse">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-emerald-100 font-medium">Escaneando sua refeição...</p>
          <p className="text-emerald-500/60 text-sm mt-1">Nossa IA está calculando os nutrientes</p>
        </GlassCard>
      )}

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <GlassCard className="overflow-hidden p-0 border-emerald-500/30">
             {result.imageUrl && (
               <img src={result.imageUrl} alt="Meal" className="w-full h-48 object-cover" />
             )}
             <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold">{result.name}</h3>
                   <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded">IDENTIFICADO</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{result.description}</p>
             </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4">
             <GlassCard className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-2 rounded-lg">
                   <Flame className="text-orange-500" size={20} />
                </div>
                <div>
                   <p className="text-xs text-white/40 uppercase">Calorias</p>
                   <p className="text-lg font-bold">{result.calories} kcal</p>
                </div>
             </GlassCard>
             <GlassCard className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                   <Zap className="text-blue-500" size={20} />
                </div>
                <div>
                   <p className="text-xs text-white/40 uppercase">Proteína</p>
                   <p className="text-lg font-bold">{result.protein}g</p>
                </div>
             </GlassCard>
          </div>

          <GlassCard className="p-6">
             <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-emerald-100">Divisão de Macros</h4>
                <div className="flex gap-4 text-[10px] uppercase font-bold">
                   <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Prot</span>
                   <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Carb</span>
                   <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Gord</span>
                </div>
             </div>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                      </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-between text-center mt-2 px-8">
                   <div><p className="text-emerald-400 font-bold">{result.protein}g</p><p className="text-[10px] text-white/40">Proteína</p></div>
                   <div><p className="text-blue-400 font-bold">{result.carbs}g</p><p className="text-[10px] text-white/40">Carbos</p></div>
                   <div><p className="text-amber-400 font-bold">{result.fat}g</p><p className="text-[10px] text-white/40">Gordura</p></div>
                </div>
             </div>
          </GlassCard>

          <button 
            onClick={() => { setResult(null); }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
          >
            Registrar Nova Refeição
          </button>
        </div>
      )}
    </div>
  );
};
