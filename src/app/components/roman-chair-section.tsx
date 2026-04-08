import { Card } from './ui/card';

export function RomanChairSection() {
  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="mb-4 dark:text-white">Roman Chair</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 dark:text-white">Setup</h3>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 dark:text-gray-300">
            <li>Position yourself on the Roman chair with your hips supported by the pad</li>
            <li>Cross your arms over your chest or place hands behind your head</li>
            <li>Keep your body straight and aligned</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 dark:text-white">Execution</h3>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 dark:text-gray-300">
            <li><strong className="dark:text-white">Starting Position:</strong> Begin with your torso parallel to the floor or slightly lower</li>
            <li><strong className="dark:text-white">Movement:</strong> Raise your torso by contracting your lower back and glutes until your body forms a straight line</li>
            <li><strong className="dark:text-white">Control:</strong> Lower yourself back down with control to the starting position</li>
            <li><strong className="dark:text-white">Breathing:</strong> Exhale as you raise up, inhale as you lower down</li>
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
          <p className="text-sm dark:text-gray-300">
            <strong className="dark:text-white">Tips:</strong>
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 mt-2 dark:text-gray-300">
            <li>Avoid hyperextending your back at the top of the movement</li>
            <li>Keep core engaged throughout the exercise</li>
            <li>Start with bodyweight before adding resistance</li>
            <li>Perform 3-4 sets of 10-15 repetitions</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
