
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProfileManager } from './pages/ProfileManager';
import { History } from './pages/History';
import { DietGenerator } from './pages/DietGenerator';
import { Profile, MealAnalysis, Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [meals, setMeals] = useState<MealAnalysis[]>([]);

  // Load data on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('fitvision_profiles');
    const savedActiveId = localStorage.getItem('fitvision_active_profile_id');
    const savedMeals = localStorage.getItem('fitvision_meals');

    if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
    if (savedActiveId) {
      setActiveProfileId(savedActiveId);
      setActivePage('home'); // Go to home if a profile is already active
    }
    if (savedMeals) setMeals(JSON.parse(savedMeals));
  }, []);

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('fitvision_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('fitvision_active_profile_id', activeProfileId);
    } else {
      localStorage.removeItem('fitvision_active_profile_id');
    }
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem('fitvision_meals', JSON.stringify(meals));
  }, [meals]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const handleAddProfile = (p: Profile) => {
    setProfiles(prev => [...prev, p]);
    setActiveProfileId(p.id);
    setActivePage('home');
  };

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    setActivePage('home');
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfileId === id) setActiveProfileId(null);
  };

  const handleSaveMeal = (meal: MealAnalysis) => {
    setMeals(prev => [meal, ...prev]);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home activeProfile={activeProfile} onSaveMeal={handleSaveMeal} />;
      case 'profiles':
        return (
          <ProfileManager 
            profiles={profiles} 
            activeProfileId={activeProfileId}
            onSelectProfile={handleSelectProfile}
            onAddProfile={handleAddProfile}
            onDeleteProfile={handleDeleteProfile}
          />
        );
      case 'history':
        return <History meals={meals} activeProfile={activeProfile} />;
      case 'diet-plan':
        return <DietGenerator activeProfile={activeProfile} />;
      default:
        return <Home activeProfile={activeProfile} onSaveMeal={handleSaveMeal} />;
    }
  };

  return (
    <Layout 
      activePage={activePage} 
      setActivePage={setActivePage}
      activeProfileName={activeProfile?.name}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
