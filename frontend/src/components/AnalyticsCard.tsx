
interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function AnalyticsCard({title, value, color, icon}:AnalyticsCardProps) {
  return (
   <div
      className={`bg-gray-800 rounded-lg p-6 shadow-lg mb-10 overflow-hidden relative ${color}`}

    >
      <div className="flex justify-between items-center">
        <div className="z-10">
          <p className="text-rose-500 text-sm mb-1 font-semibold">{title}</p>
          <h3 className="text-rose-500 text-3xl font-bold">{value}</h3>
        </div>
      </div>
      <div className="absolute inset-0 bg-amber-100" />
      <div className="absolute -bottom-2 -right-3 text-rose-500 opacity-50">
        {icon}
      </div>
    </div>
  )
}

export default AnalyticsCard