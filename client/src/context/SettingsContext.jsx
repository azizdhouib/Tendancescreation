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

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    primaryColor: '#9B4D96',
    secondaryColor: '#E85A8B',
    buttonColor: '#D4548A',
    backgroundColor: '#FDF5F8',
    accentColor: '#F5A623',
    siteName: 'Tendance&Creations',
    slogan: 'Des bouquets personnalisés pour des cadeaux uniques'
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async (retries = 3) => {
    try {
      const response = await settingsAPI.get();
      setSettings(response.data);
      applyColors(response.data);
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => fetchSettings(retries - 1), 2000);
        return;
      }
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyColors = (colors) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primaryColor);
    root.style.setProperty('--color-secondary', colors.secondaryColor);
    root.style.setProperty('--color-button', colors.buttonColor);
    root.style.setProperty('--color-background', colors.backgroundColor);
    root.style.setProperty('--color-accent', colors.accentColor);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const response = await settingsAPI.update(newSettings);
      setSettings(response.data);
      applyColors(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
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
