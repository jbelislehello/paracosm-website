import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TargetPlatform, SoftwareStatus } from '@/types/paracosm';
import { Sparkles, Rocket } from 'lucide-react';

interface CreateSoftwareFormProps {
  onSubmit: (data: {
    name: string;
    description?: string;
    target_platform: TargetPlatform;
    deployment_url?: string;
    status: SoftwareStatus;
    is_recursive: boolean;
  }) => void;
  onCancel: () => void;
}

export function CreateSoftwareForm({ onSubmit, onCancel }: CreateSoftwareFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>('lovable');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [isRecursive, setIsRecursive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      target_platform: targetPlatform,
      deployment_url: deploymentUrl || undefined,
      status: 'incubating',
      is_recursive: isRecursive,
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Birth New Software
        </CardTitle>
        <CardDescription>
          Add a new product to your Paracosm creative lineage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Software Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Iotheatre, Tonalli, Wuxia"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this software do? What's its role in the Paracosm?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Target Platform</Label>
            <Select value={targetPlatform} onValueChange={(v) => setTargetPlatform(v as TargetPlatform)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lovable">💜 Lovable</SelectItem>
                <SelectItem value="base44">🔷 Base44</SelectItem>
                <SelectItem value="claude">🤖 Claude</SelectItem>
                <SelectItem value="cursor">⌨️ Cursor</SelectItem>
                <SelectItem value="custom">🛠️ Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Deployment URL (optional)</Label>
            <Input
              id="url"
              type="url"
              value={deploymentUrl}
              onChange={(e) => setDeploymentUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label htmlFor="recursive" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Recursive Product
              </Label>
              <p className="text-sm text-muted-foreground">
                Does this software feed back into Calm Magic?
              </p>
            </div>
            <Switch
              id="recursive"
              checked={isRecursive}
              onCheckedChange={setIsRecursive}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!name}>
              <Rocket className="h-4 w-4 mr-2" />
              Birth Software
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
