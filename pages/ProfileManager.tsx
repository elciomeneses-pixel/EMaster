
import React, { useState } from 'react';
import { Plus, Trash2, User, ChevronRight, Scale, Move, Ruler } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Profile, Goal, ActivityLevel } from '../types';

interface ProfileManagerProps {
  profiles: Profile[];
  activeProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: Profile) => void;
  onDeleteProfile: (id: string) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ 
  profiles, 
  activeProfileId, 
  onSelectProfile, 
  onAddProfile,
  onDeleteProfile 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    age: 25,
    weight: 70,
    height: 175,
    gender: 'male',
    goal: Goal.Maintenance,
    activityLevel: ActivityLevel.Moderate
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newProfile: Profile = {
      ...(formData as Profile),
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    onAddProfile(newProfile);
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perfis</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-500 p-2 rounded-lg text-white hover:bg-emerald-600"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAdd && (
        <GlassCard className="p-6 border-emerald-500/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Nome</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 focus:border-emerald-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Idade</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 outline-none"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Peso (kg)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 outline-none"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Altura (cm)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 outline-none"
                  value={formData.height}
                  onChange={e => setFormData({...formData, height: Number(e.target.value)})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Gênero</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 outline-none appearance-none"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as any})}
              >
                <option value="male" className="bg-emerald-950">Masculino</option>
                <option value="female" className="bg-emerald-950">Feminino</option>
                <option value="other" className="bg-emerald-950">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Objetivo Fitness</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 outline-none appearance-none"
                value={formData.goal}
                onChange={e => setFormData({...formData, goal: e.target.value as Goal})}
              >
                {Object.values(Goal).map(goal => (
                  <option key={goal} value={goal} className="bg-emerald-950">{goal}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Nível de Atividade</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 outline-none appearance-none"
                value={formData.activityLevel}
                onChange={e => setFormData({...formData, activityLevel: e.target.value as ActivityLevel})}
              >
                {Object.values(ActivityLevel).map(level => (
                  <option key={level} value={level} className="bg-emerald-950">{level}</option>
                ))}
              </select>
            </div>
            <button className="w-full bg-emerald-500 py-3 rounded-xl font-bold mt-4 shadow-lg">Salvar Perfil</button>
          </form>
        </GlassCard>
      )}

      <div className="space-y-3">
        {profiles.length === 0 && !showAdd && (
          <p className="text-center text-white/40 py-10">Nenhum perfil encontrado. Adicione o seu primeiro!</p>
        )}
        {profiles.map(p => (
          <GlassCard 
            key={p.id}
            onClick={() => onSelectProfile(p.id)}
            className={`flex items-center justify-between group ${activeProfileId === p.id ? 'border-emerald-500 shadow-emerald-500/20 shadow-lg' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${activeProfileId === p.id ? 'bg-emerald-500' : 'bg-white/10'}`}>
                <User className={activeProfileId === p.id ? 'text-white' : 'text-white/40'} />
              </div>
              <div>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-xs text-white/40">{p.goal} • {p.weight}kg</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={(e) => { e.stopPropagation(); onDeleteProfile(p.id); }}
                className="p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <ChevronRight size={20} className={activeProfileId === p.id ? 'text-emerald-500' : 'text-white/20'} />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
