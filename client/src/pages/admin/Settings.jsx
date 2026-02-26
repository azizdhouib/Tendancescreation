import { useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import { useSettings } from '../../context/SettingsContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    buttonColor: settings.buttonColor,
    backgroundColor: settings.backgroundColor,
    accentColor: settings.accentColor,
    siteName: settings.siteName,
    slogan: settings.slogan
  });

  const defaultColors = {
    primaryColor: '#E8B4B8',
    secondaryColor: '#EDD6D1',
    buttonColor: '#D4A574',
    backgroundColor: '#FDF8F5',
    accentColor: '#C9A87C'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSettings(formData);
      toast.success('Paramètres enregistrés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const resetColors = () => {
    setFormData({
      ...formData,
      ...defaultColors
    });
  };

  const colorFields = [
    { key: 'primaryColor', label: 'Couleur principale', description: 'Utilisée pour les éléments décoratifs' },
    { key: 'secondaryColor', label: 'Couleur secondaire', description: 'Utilisée pour les arrière-plans légers' },
    { key: 'buttonColor', label: 'Couleur des boutons', description: 'Couleur principale des boutons et liens' },
    { key: 'backgroundColor', label: 'Couleur de fond', description: 'Arrière-plan général du site' },
    { key: 'accentColor', label: 'Couleur d\'accent', description: 'Pour les badges et mises en avant' }
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Paramètres du site
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg text-gray-800 mb-6">
            Informations générales
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                className="input-field max-w-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Color Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-gray-800">
              Couleurs du site
            </h2>
            <button
              type="button"
              onClick={resetColors}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <FiRefreshCw className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {colorFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData[field.key]}
                    onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData[field.key]}
                      onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                      className="input-field text-sm font-mono"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">{field.description}</p>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium text-gray-800 mb-4">Aperçu</h3>
            <div 
              className="rounded-2xl p-6"
              style={{ backgroundColor: formData.backgroundColor }}
            >
              <div className="flex flex-wrap gap-4 items-center">
                <div 
                  className="px-6 py-3 rounded-full text-white font-medium"
                  style={{ backgroundColor: formData.buttonColor }}
                >
                  Bouton principal
                </div>
                <div 
                  className="px-4 py-2 rounded-full text-sm"
                  style={{ backgroundColor: `${formData.primaryColor}30`, color: formData.buttonColor }}
                >
                  Badge primaire
                </div>
                <div 
                  className="px-4 py-2 rounded-full text-sm text-white"
                  style={{ backgroundColor: formData.accentColor }}
                >
                  Accent
                </div>
              </div>
              <div 
                className="mt-4 p-4 rounded-xl"
                style={{ backgroundColor: formData.secondaryColor }}
              >
                <p className="text-gray-700">Zone secondaire avec texte</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-medium transition-all hover:shadow-lg disabled:opacity-70"
            style={{ backgroundColor: settings.buttonColor }}
          >
            <FiSave className="w-5 h-5" />
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
