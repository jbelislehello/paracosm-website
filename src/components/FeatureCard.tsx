
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon, color }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
      <div className={cn("w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-gradient-to-br", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
