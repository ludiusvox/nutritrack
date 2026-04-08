import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Calculator as CalcIcon, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Separator } from "./ui/separator";

interface MacroResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function BmrCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "very" | "extra">("moderate");
  const [results, setResults] = useState<MacroResults | null>(null);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  };

  const calculateMacros = () => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!ageNum || !heightNum || !weightNum) {
      return;
    }

    // Mifflin St. Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultipliers[activityLevel];

    // Adjust calories based on goal
    let targetCalories: number;
    switch (goal) {
      case "lose":
        targetCalories = tdee - 500; // 500 calorie deficit for 1 lb/week loss
        break;
      case "gain":
        targetCalories = tdee + 300; // 300 calorie surplus for lean gain
        break;
      case "maintain":
      default:
        targetCalories = tdee;
        break;
    }

    // Calculate macros
    // Protein: 2g per kg body weight (moderate), adjust based on goal
    let proteinGrams: number;
    if (goal === "lose") {
      proteinGrams = weightNum * 2.2; // Higher protein for weight loss
    } else if (goal === "gain") {
      proteinGrams = weightNum * 2.0; // Higher protein for muscle gain
    } else {
      proteinGrams = weightNum * 1.8; // Moderate protein
    }

    // Fat: 25-30% of calories
    const fatCalories = targetCalories * 0.28;
    const fatGrams = fatCalories / 9;

    // Carbs: Remaining calories
    const proteinCalories = proteinGrams * 4;
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = carbCalories / 4;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
    });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMacros();
  };

  const getGoalIcon = () => {
    switch (goal) {
      case "lose":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "gain":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "maintain":
        return <Minus className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalcIcon className="h-5 w-5" />
            BMR & Macro Calculator
          </CardTitle>
          <CardDescription>
            Calculate your daily calorie needs and macro targets using the Mifflin St. Jeor equation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={(value: "male" | "female") => setGender(value)}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Goal & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Select value={goal} onValueChange={(value: "lose" | "maintain" | "gain") => setGoal(value)}>
                  <SelectTrigger id="goal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select
                  value={activityLevel}
                  onValueChange={(value: "sedentary" | "light" | "moderate" | "very" | "extra") =>
                    setActivityLevel(value)
                  }
                >
                  <SelectTrigger id="activity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="very">Very Active (6-7 days/week)</SelectItem>
                    <SelectItem value="extra">Extra Active (intense daily exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <CalcIcon className="mr-2 h-4 w-4" />
              Calculate Macros
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getGoalIcon()}
              Your Daily Targets
            </CardTitle>
            <CardDescription>
              Based on the Mifflin St. Jeor equation and your activity level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calorie Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Basal Metabolic Rate</p>
                  <p className="text-3xl font-bold">{results.bmr}</p>
                  <p className="text-xs text-muted-foreground mt-1">calories/day</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Daily Energy</p>
                  <p className="text-3xl font-bold">{results.tdee}</p>
                  <p className="text-xs text-muted-foreground mt-1">calories/day</p>
                </CardContent>
              </Card>

              <Card className="bg-primary/10 border-primary">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Target Calories</p>
                  <p className="text-3xl font-bold text-primary">{results.targetCalories}</p>
                  <p className="text-xs text-muted-foreground mt-1">calories/day</p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Macro Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Daily Macro Targets</h3>
              <div className="space-y-4">
                <MacroBar
                  label="Protein"
                  grams={results.protein}
                  calories={results.protein * 4}
                  totalCalories={results.targetCalories}
                  color="bg-green-500"
                />
                <MacroBar
                  label="Carbs"
                  grams={results.carbs}
                  calories={results.carbs * 4}
                  totalCalories={results.targetCalories}
                  color="bg-blue-500"
                />
                <MacroBar
                  label="Fat"
                  grams={results.fat}
                  calories={results.fat * 9}
                  totalCalories={results.targetCalories}
                  color="bg-red-500"
                />
              </div>
            </div>

            {/* Goal-specific advice */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">
                  {goal === "lose" && "Weight Loss Tips"}
                  {goal === "gain" && "Weight Gain Tips"}
                  {goal === "maintain" && "Maintenance Tips"}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  {goal === "lose" && (
                    <>
                      <li>500 calorie deficit for ~1 lb/week weight loss</li>
                      <li>High protein helps preserve muscle mass</li>
                      <li>Track consistently and adjust if needed</li>
                    </>
                  )}
                  {goal === "gain" && (
                    <>
                      <li>300 calorie surplus for lean muscle gain</li>
                      <li>Focus on strength training</li>
                      <li>Ensure adequate protein intake</li>
                    </>
                  )}
                  {goal === "maintain" && (
                    <>
                      <li>Match your daily calorie expenditure</li>
                      <li>Maintain balanced macro ratios</li>
                      <li>Adjust based on activity changes</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Formula Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>About the Mifflin St. Jeor Equation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This calculator uses the <strong>Mifflin St. Jeor equation</strong>, considered the gold standard for
            calorie calculation by nutritionists and dieticians.
          </p>
          <div className="bg-muted p-4 rounded-lg space-y-2 font-mono text-xs">
            <p>
              <strong>Men:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
            </p>
            <p>
              <strong>Women:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
            </p>
          </div>
          <p>
            Your BMR is then multiplied by your activity level to get your Total Daily Energy Expenditure (TDEE).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MacroBar({
  label,
  grams,
  calories,
  totalCalories,
  color,
}: {
  label: string;
  grams: number;
  calories: number;
  totalCalories: number;
  color: string;
}) {
  const percentage = (calories / totalCalories) * 100;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {grams}g ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
