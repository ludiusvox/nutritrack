import { Card } from './ui/card';

export function ProcedureDisplay() {
  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="mb-4 dark:text-white">The Double-Ladder "W" Procedure</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 dark:text-white">1. The Rep Scheme</h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
            <p className="text-center font-mono text-lg mb-2 dark:text-white">
              5 – 4 – 3 – 2 – 1 – 2 – 3 – 4 – 5 – 4 – 3 – 2 – 1 – 2 – 3 – 4 – 5
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Total: 57 repetitions</p>
          </div>
          <ul className="list-disc list-inside mt-3 text-sm space-y-1 ml-2 dark:text-gray-300">
            <li><strong className="dark:text-white">First "V":</strong> Start at 5 reps, descend to 1, climb back to 5</li>
            <li><strong className="dark:text-white">Second "V":</strong> Immediately repeat the descent and ascent</li>
            <li><strong className="dark:text-white">Two sets</strong> of this sequence per workout session</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 dark:text-white">2. Load Selection</h3>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 dark:text-gray-300">
            <li><strong className="dark:text-white">Strength/Loaded Lifts:</strong> Use 70-80% of your 1RM. The highest rep count (5) should feel like you have 2-3 reps left (RPE 7-8)</li>
            <li><strong className="dark:text-white">Bodyweight/Calisthenics:</strong> Choose where peak ladder is ~50-60% of your max set</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 dark:text-white">3. Rest Intervals</h3>
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg text-sm">
            <p className="mb-2 dark:text-gray-200"><strong className="dark:text-white">Rest is minimal but sufficient:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2 dark:text-gray-300">
              <li><strong className="dark:text-white">"I Go, You Go":</strong> With a partner, rest while they complete their reps</li>
              <li><strong className="dark:text-white">Solo Training:</strong> Rest 30-60 seconds between each number</li>
              <li><strong className="dark:text-white">"W" Transition:</strong> No long break between first and second "V"—keep the 30-60s cadence</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="mb-2 dark:text-white">Why This Works</h3>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm">
            <ul className="list-disc list-inside space-y-1 ml-2 dark:text-gray-300">
              <li><strong className="dark:text-white">Density:</strong> Accumulate 57 reps at 70-80% 1RM without reaching failure</li>
              <li><strong className="dark:text-white">Active Recovery:</strong> Lower rep rungs (1, 2, 3) allow ATP-CP system to recharge</li>
              <li><strong className="dark:text-white">Power Maintenance:</strong> Short rest keeps form crisp and power output high</li>
            </ul>
            <p className="mt-2 italic dark:text-gray-400">
              Note: If you cannot complete the second "V" with 30-60s rest, the weight is too heavy
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}