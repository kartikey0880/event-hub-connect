const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative w-32 h-32 mx-auto">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-primary rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-40px)`,
                animation: `pulse 1.2s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold animate-pulse">{message}</h2>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: rotate(var(--rotation)) translateY(-40px) scale(0.8); }
          50% { opacity: 1; transform: rotate(var(--rotation)) translateY(-40px) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
