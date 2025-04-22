
import React from "react";
import { Code, Database, Layers, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => {
  const getIcon = () => {
    switch (icon) {
      case 'code':
        return <Code size={24} />;
      case 'database':
        return <Database size={24} />;
      case 'layers':
        return <Layers size={24} />;
      case 'users':
        return <Users size={24} />;
      default:
        return <Code size={24} />;
    }
  };

  const getBgColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-agent-blue/10 text-agent-blue';
      case 'purple':
        return 'bg-agent-purple/10 text-agent-purple';
      case 'pink':
        return 'bg-agent-pink/10 text-agent-pink';
      case 'green':
        return 'bg-agent-green/10 text-agent-green';
      default:
        return 'bg-agent-blue/10 text-agent-blue';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
      <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg mb-4", getBgColor())}>
        {getIcon()}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
