const Loading = ({ fullScreen = false, message = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[200px]'}`}>
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#D4548A transparent #D4548A #D4548A' }}
        />
      </div>
      {message && (
        <p className="mt-4 text-gray-500 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default Loading;
