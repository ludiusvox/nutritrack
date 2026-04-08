import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

export function EpleyCalculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const calculateOneRM = () => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);

    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
      return null;
    }

    // Epley Formula: 1RM = w(1 + r/30)
    const oneRM = w * (1 + r / 30);
    return oneRM.toFixed(1);
  };

  const oneRM = calculateOneRM();

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <h2 className="mb-4 dark:text-white">Epley Formula - 1RM Calculator</h2>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 border border-blue-200 dark:border-blue-700">
        <p className="text-center font-mono dark:text-white">
          1RM = w × (1 + r/30)
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
          w = weight lifted, r = repetitions completed
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="weight" className="dark:text-gray-200">Weight (lbs/kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="Enter weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div>
          <Label htmlFor="reps" className="dark:text-gray-200">Repetitions</Label>
          <Input
            id="reps"
            type="number"
            placeholder="Enter reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      {oneRM && (
        <div className="bg-blue-600 dark:bg-blue-500 text-white p-4 rounded-lg text-center">
          <p className="text-sm mb-1">Estimated 1RM</p>
          <p className="text-3xl">{oneRM} lbs/kg</p>
        </div>
      )}

      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm dark:text-gray-300">
          <strong className="dark:text-white">How to use:</strong> Enter a weight you can lift for 3-5 reps to estimate your one-rep max (1RM).
          For the Double-Ladder workout, use 70-80% of this calculated 1RM.
        </p>
      </div>
    </Card>
  );
}