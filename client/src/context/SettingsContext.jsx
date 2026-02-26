import { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const defaultSettings = {
  primaryColor: '#9B4D96',
  secondaryColor: '#E85A8B',
  buttonColor: '#D4548A',
  backgroundColor: '#FDF5F8',
  accentColor: '#F5A623',
  siteName: 'Tendance&Creations',
  slogan: 'Des bouquets personnalisés pour des cadeaux uniques'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);

  const applyColors = (colors) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primaryColor);
    root.style.setProperty('--color-secondary', colors.secondaryColor);
    root.style.setProperty('--color-button', colors.buttonColor);
    root.style.setProperty('--color-background', colors.backgroundColor);
    root.style.setProperty('--color-accent', colors.accentColor);
  };

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.data) {
        setSettings(response.data);
        applyColors(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      applyColors(defaultSettings);
    }
  };

  useEffect(() => {
    applyColors(defaultSettings);
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    const response = await settingsAPI.update(newSettings);
    setSettings(response.data);
    applyColors(response.data);
    return response.data;
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateSettings,
      refreshSettings: fetchSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
