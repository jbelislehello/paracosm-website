import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sun, Moon, Heart } from 'lucide-react';
import { PERSONAL_C_SUITE_ROLES, PersonalCSuiteRole } from '@/data/personalCSuiteRoles';

interface CheckInCardProps {
  role: PersonalCSuiteRole;
  timeOfDay: 'morning' | 'evening';
}

const CheckInCard: React.FC<CheckInCardProps> = ({ role, timeOfDay }) => {
  const [checked, setChecked] = useState(false);
  const question = timeOfDay === 'morning' ? role.morningQuestion : role.eveningQuestion;
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <Checkbox 
        id={`${role.id}-${timeOfDay}`}
        checked={checked}
        onCheckedChange={(val) => setChecked(val as boolean)}
        className="mt-1"
      />
      <div className="flex-1">
        <label 
          htmlFor={`${role.id}-${timeOfDay}`}
          className="text-sm font-medium cursor-pointer"
        >
          {role.title}: {question}
        </label>
      </div>
    </div>
  );
};

const RoleDetailCard: React.FC<{ role: PersonalCSuiteRole }> = ({ role }) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-rose-500/5 to-purple-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{role.emoji}</span>
          <div>
            <CardTitle className="text-lg">{role.fullTitle}</CardTitle>
            <CardDescription className="text-xs italic">{role.theme}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{role.role}</p>
        
        <Separator className="bg-primary/10" />
        
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            Questions for your inner {role.title}
          </h4>
          <ul className="space-y-2">
            {role.questions.map((question, idx) => (
              <li key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">
                {question}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const DailyCheckIn: React.FC<{ timeOfDay: 'morning' | 'evening' }> = ({ timeOfDay }) => {
  const Icon = timeOfDay === 'morning' ? Sun : Moon;
  const title = timeOfDay === 'morning' ? 'Morning Check-in' : 'Evening Check-out';
  const subtitle = '3 minutes';
  
  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Icon className={`h-6 w-6 ${timeOfDay === 'morning' ? 'text-amber-500' : 'text-indigo-500'}`} />
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {PERSONAL_C_SUITE_ROLES.map(role => (
          <CheckInCard key={role.id} role={role} timeOfDay={timeOfDay} />
        ))}
      </CardContent>
    </Card>
  );
};

export const PersonalCSuiteDashboard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('ceo');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
          Your Inner C-Suite
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Three inner guides to help you lead yourself with embodiment, flow, and transformation.
        </p>
      </div>

      <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          {PERSONAL_C_SUITE_ROLES.map(role => (
            <TabsTrigger 
              key={role.id} 
              value={role.id}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500/20 data-[state=active]:to-purple-500/20"
            >
              <span className="mr-2">{role.emoji}</span>
              <span className="hidden sm:inline">{role.fullTitle}</span>
              <span className="sm:hidden">{role.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[400px] mt-4">
          {PERSONAL_C_SUITE_ROLES.map(role => (
            <TabsContent key={role.id} value={role.id} className="mt-0">
              <RoleDetailCard role={role} />
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>

      <Separator />

      <div>
        <h3 className="text-base font-semibold mb-4 text-center">Daily Rituals</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <DailyCheckIn timeOfDay="morning" />
          <DailyCheckIn timeOfDay="evening" />
        </div>
      </div>

      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
        <CardContent className="pt-4">
          <p className="text-xs text-center text-muted-foreground italic">
            "Lead yourself the way you wish leaders had led you — with presence, care, and curiosity."
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalCSuiteDashboard;
