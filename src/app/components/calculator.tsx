import { useState } from "react";
import { Calculator as CalcIcon, Plus } from "lucide-react";
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
  }) => void;
  currentPhoto?: string | null;
}

export function Calculator({ onAdd, currentPhoto }: CalculatorProps) {
  const [name, setName] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");

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

    onAdd({
      name: name.trim(),
      fat: fatVal,
      carbs: carbsVal,
      protein: proteinVal,
      calories: calculateCalories(),
    });

    // Reset form
    setName("");
    setFat("");
    setCarbs("");
    setProtein("");
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
      </div>
    </Card>
  );
}
