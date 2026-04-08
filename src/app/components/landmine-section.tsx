import { Card } from './ui/card';

export function LandmineSection() {
  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="mb-4 dark:text-white">Landmine Lift</h2>
      
      <div className="space-y-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/TAaGQ_BZvYs"
            title="Landmine Lift Demonstration"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
          ></iframe>
        </div>

        <div>
          <h3 className="mb-2 dark:text-white">Setup</h3>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 dark:text-gray-300">
            <li>Secure one end of a barbell in a landmine attachment or corner</li>
            <li>Load the opposite end with weight plates</li>
            <li>Stand facing the barbell with feet shoulder-width apart</li>
            <li>Position yourself at the loaded end of the bar</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 dark:text-white">Execution</h3>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 dark:text-gray-300">
            <li><strong className="dark:text-white">Starting Position:</strong> Bend at the hips and knees to grasp the end of the barbell</li>
            <li><strong className="dark:text-white">Core Engagement:</strong> Brace your core and maintain a neutral spine</li>
            <li><strong className="dark:text-white">Lift:</strong> Drive through your legs and hips to lift the bar, rotating through your core</li>
            <li><strong className="dark:text-white">Rotation:</strong> Pivot and rotate the bar across your body in a sweeping motion</li>
            <li><strong className="dark:text-white">Control:</strong> Return to starting position with controlled movement</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 dark:text-white">Common Variations</h3>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 dark:text-gray-300">
            <li><strong className="dark:text-white">Landmine Twist:</strong> Rotational movement for obliques</li>
            <li><strong className="dark:text-white">Landmine Press:</strong> Overhead pressing variation</li>
            <li><strong className="dark:text-white">Landmine Row:</strong> Single-arm rowing movement</li>
            <li><strong className="dark:text-white">Rainbow:</strong> Arc movement from side to side</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
          <p className="text-sm dark:text-gray-300">
            <strong className="dark:text-white">Programming:</strong>
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2 mt-2 dark:text-gray-300">
            <li>Perform 3-4 sets of 8-12 reps per side</li>
            <li>Focus on controlled rotation and core stability</li>
            <li>Start with lighter weight to master the movement pattern</li>
            <li>Can be used as primary lift or accessory work</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
