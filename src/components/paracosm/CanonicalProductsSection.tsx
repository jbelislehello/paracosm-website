import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PARACOSM_PRODUCTS } from '@/types/paracosm';
import { Check, Sparkles, Globe, Smartphone, Monitor } from 'lucide-react';

interface CanonicalProductsSectionProps {
  activatedProducts: string[];
  onActivate: (productKey: string) => void;
}

const PRODUCT_ICONS: Record<string, React.ReactNode> = {
  IOTHEATRE: <Monitor className="h-8 w-8" />,
  TONALLI: <Sparkles className="h-8 w-8" />,
  WUXIA: <Globe className="h-8 w-8" />,
};

const PRODUCT_COLORS: Record<string, string> = {
  IOTHEATRE: 'from-violet-500 to-purple-600',
  TONALLI: 'from-amber-500 to-orange-600',
  WUXIA: 'from-emerald-500 to-teal-600',
};

export const CanonicalProductsSection = ({
  activatedProducts,
  onActivate,
}: CanonicalProductsSectionProps) => {
  const products = Object.entries(PARACOSM_PRODUCTS);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Canonical Products
        </h2>
        <p className="text-sm text-muted-foreground">
          The three pillars of the Paracosm Business: Iotheatre, Tonalli, and Wuxia
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {products.map(([key, product]) => {
          const isActivated = activatedProducts.includes(product.name.toLowerCase());
          const colorClass = PRODUCT_COLORS[key] || 'from-gray-500 to-gray-600';
          
          return (
            <Card 
              key={key} 
              className={`relative overflow-hidden border-border transition-all ${
                isActivated ? 'ring-2 ring-primary/50' : 'hover:shadow-lg'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-5`} />
              <CardHeader className="relative pb-2">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass} text-white`}>
                    {PRODUCT_ICONS[key]}
                  </div>
                  {isActivated && (
                    <Badge variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Badge variant="outline" className="text-xs">
                    {product.targetPlatforms[0]}
                  </Badge>
                  {product.isRecursive && (
                    <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                      Recursive
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => onActivate(key)}
                  disabled={isActivated}
                  variant={isActivated ? 'secondary' : 'default'}
                  className="w-full"
                  size="sm"
                >
                  {isActivated ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      In Your Lineage
                    </>
                  ) : (
                    'Activate in Lineage'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
