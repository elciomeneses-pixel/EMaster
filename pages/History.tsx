
import React from 'react';
import { Clock, Flame, Calendar, Info } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MealAnalysis, Profile } from '../types';

interface HistoryProps {
  meals: MealAnalysis[];
  activeProfile: Profile | null;
}

export const History: React.FC<HistoryProps> = ({ meals, activeProfile }) => {
  if (!activeProfile) return <div className="p-4 text-center">Por favor, selecione um perfil.</div>;

  const profileMeals = meals
    .filter(m => m.profileId === activeProfile.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  const totalToday = profileMeals
    .filter(m => new Date(m.timestamp).toDateString() === new Date().toDateString())
    .reduce((acc, m) => acc + m.calories, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Registro de Atividades</h2>
        <p className="text-sm text-emerald-400">Refeições anteriores e nutrientes</p>
      </div>

      <GlassCard className="bg-emerald-500/10 border-emerald-500/30 flex items-center justify-between p-6">
        <div>
          <p className="text-xs uppercase font-bold text-emerald-400 mb-1">Total de Hoje</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{totalToday}</span>
            <span className="text-sm text-white/40">kcal</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center emerald-glow">
          <Flame className="text-white" />
        </div>
      </GlassCard>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
          <Calendar size={14} />
          <span>Refeições Recentes</span>
        </div>

        {profileMeals.length === 0 ? (
          <div className="text-center py-20 text-white/30 italic">Nenhuma refeição registrada ainda.</div>
        ) : (
          profileMeals.map((meal) => (
            <GlassCard key={meal.id} className="flex gap-4 p-3 hover:bg-white/10">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-emerald-900/50 flex-shrink-0">
                {meal.imageUrl ? (
                  <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Info className="text-white/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm truncate">{meal.name}</h4>
                  <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 rounded">+{meal.calories}k</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-white/40 mt-1 uppercase font-bold tracking-tighter">
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>G: {meal.fat}g</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-white/30 mt-1">
                  <Clock size={10} />
                  <span>{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
