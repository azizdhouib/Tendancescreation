import { useSettings } from '../context/SettingsContext';

const Loading = () => {
  const { settings } = useSettings();

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: `${settings.primaryColor} transparent ${settings.primaryColor} ${settings.primaryColor}` }}
        />
      </div>
    </div>
  );
};

export default Loading;
