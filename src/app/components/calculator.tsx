import { useState } from "react";
import { Calculator as CalcIcon, Plus, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CalculatorProps {
  onAdd: (data: {
    name: string;
    fat: number;
    carbs: number;
    protein: number;
    calories: number;
    nicotine?: number;
    caffeine?: number;
  }) => void;
  currentPhoto?: string | null;
}

export function Calculator({ onAdd, currentPhoto }: CalculatorProps) {
  const [name, setName] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [nicotine, setNicotine] = useState("");
  const [caffeine, setCaffeine] = useState("");

  const calculateCalories = () => {
    const fatVal = parseFloat(fat) || 0;
    const carbsVal = parseFloat(carbs) || 0;
    const proteinVal = parseFloat(protein) || 0;
    // Calories = (fat × 9) + (carbs × 4) + (protein × 4)
    return Math.round(fatVal * 9 + carbsVal * 4 + proteinVal * 4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Please enter a food name");
      return;
    }

    const fatVal = parseFloat(fat) || 0;
    const carbsVal = parseFloat(carbs) || 0;
    const proteinVal = parseFloat(protein) || 0;
    const nicotineVal = parseFloat(nicotine) || 0;
    const caffeineVal = parseFloat(caffeine) || 0;

    onAdd({
      name: name.trim(),
      fat: fatVal,
      carbs: carbsVal,
      protein: proteinVal,
      calories: calculateCalories(),
      nicotine: nicotineVal,
      caffeine: caffeineVal,
    });

    // Reset form
    setName("");
    setFat("");
    setCarbs("");
    setProtein("");
    setNicotine("");
    setCaffeine("");
  };

  const calories = calculateCalories();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalcIcon className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Nutrition Calculator</h3>
        </div>

        {currentPhoto && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={currentPhoto}
              alt="Current"
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Food Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chicken Breast"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                min="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                min="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="nicotine">Nicotine (mg)</Label>
              <Input
                id="nicotine"
                type="number"
                step="0.1"
                min="0"
                value={nicotine}
                onChange={(e) => setNicotine(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caffeine">Caffeine (mg)</Label>
              <Input
                id="caffeine"
                type="number"
                step="1"
                min="0"
                value={caffeine}
                onChange={(e) => setCaffeine(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Calculated Calories</span>
              <span className="text-2xl font-bold">{calories}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Entry
          </Button>
        </form>

        <div className="pt-6 border-t space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-1">
            <Info className="h-4 w-4" />
            Daily Safety Guidelines
          </h4>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Caffeine:</strong> For most healthy adults, up to 400mg per day is considered safe (about 4 cups of coffee). Pregnant individuals should limit to 200mg/day.</p>
            <p><strong>Nicotine:</strong> There is no established "safe" level for nicotine. It's highly addictive and can cause cardiovascular issues. Non-smokers should avoid exposure entirely.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
