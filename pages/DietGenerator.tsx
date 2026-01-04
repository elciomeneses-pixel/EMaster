
import React, { useState, useEffect } from 'react';
import { Wand2, Loader2, Salad, Info, Utensils, Clock } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Profile, DietPlan } from '../types';
import { generateDietPlan } from '../geminiService';

interface DietGeneratorProps {
  activeProfile: Profile | null;
}

export const DietGenerator: React.FC<DietGeneratorProps> = ({ activeProfile }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<DietPlan | null>(null);

  useEffect(() => {
    // Tenta carregar o plano em cache do localStorage
    if (activeProfile) {
      const cached = localStorage.getItem(`diet_plan_${activeProfile.id}`);
      if (cached) {
        setPlan(JSON.parse(cached));
      } else {
        setPlan(null);
      }
    }
  }, [activeProfile]);

  const handleGenerate = async () => {
    if (!activeProfile) return;
    setLoading(true);
    try {
      const newPlan = await generateDietPlan(activeProfile);
      setPlan(newPlan);
      localStorage.setItem(`diet_plan_${activeProfile.id}`, JSON.stringify(newPlan));
    } catch (error) {
      console.error(error);
      alert("Falha ao gerar plano alimentar.");
    } finally {
      setLoading(false);
    }
  };

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-50">
        <Salad className="w-16 h-16 mb-4" />
        <p>Por favor, selecione um perfil primeiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dieta Personalizada</h2>
          <p className="text-emerald-400 text-sm">Gerado por IA para seus objetivos</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-lg hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
        </button>
      </div>

      {!plan && !loading && (
        <GlassCard className="py-20 flex flex-col items-center text-center px-8 border-dashed border-2 border-white/5">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Salad className="text-emerald-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Nenhum plano ativo encontrado</h3>
          <p className="text-white/40 text-sm mb-8">Deixe nossa IA analisar seu perfil e criar um cronograma de refeições personalizado para seu objetivo de {activeProfile.goal}.</p>
          <button 
            onClick={handleGenerate}
            className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-xl font-bold emerald-glow transition-all"
          >
            Criar Meu Plano
          </button>
        </GlassCard>
      )}

      {loading && (
        <div className="space-y-4">
          <GlassCard className="py-20 flex flex-col items-center text-center animate-pulse">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="font-bold text-lg">Curando suas refeições...</p>
            <p className="text-white/40 text-xs px-12 mt-2">Nossa IA está equilibrando calorias e macros com base no seu nível de atividade: {activeProfile.activityLevel}.</p>
          </GlassCard>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 glass rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {plan && !loading && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <GlassCard className="bg-emerald-500/10 border-emerald-500/20">
              <h3 className="text-lg font-bold mb-1">{plan.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed italic">"{plan.summary}"</p>
           </GlassCard>

           <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Cronograma Diário</h4>
              {plan.meals.map((meal, idx) => (
                <GlassCard key={idx} className="flex gap-4 items-start border-l-4 border-emerald-500">
                   <div className="bg-emerald-500/20 p-2 rounded-lg flex flex-col items-center min-w-[50px]">
                      <Clock size={14} className="text-emerald-500 mb-1" />
                      <span className="text-[10px] font-bold text-emerald-100">{meal.time}</span>
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-black uppercase text-white/30 tracking-tighter">{meal.label}</span>
                         <span className="text-[10px] bg-white/10 px-1.5 rounded text-white/60">~{meal.estimatedCalories} kcal</span>
                      </div>
                      <p className="text-sm font-semibold mb-1 text-emerald-50">{meal.suggestion.split(':')[0]}</p>
                      <p className="text-xs text-white/50 leading-tight">{meal.suggestion.includes(':') ? meal.suggestion.split(':')[1] : meal.suggestion}</p>
                   </div>
                </GlassCard>
              ))}
           </div>

           <div className="flex items-start gap-3 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
              <Info className="text-blue-400 flex-shrink-0" size={18} />
              <p className="text-[11px] text-blue-200/70">Este plano é gerado por IA com base em dados nutricionais padrões. Para orientação médica ou condições de saúde específicas, consulte um nutricionista licenciado.</p>
           </div>
           
           <button 
             onClick={handleGenerate}
             className="w-full text-xs text-white/30 hover:text-white/60 py-4"
           >
             Atualizar Plano
           </button>
        </div>
      )}
    </div>
  );
};
