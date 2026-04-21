import { createHashRouter } from 'react-router';
import { WorkoutPage } from './components/workout-page';
import { RootLayout } from './components/root-layout';

const muscleGroups = [
  'Gluteus',
  'Hamstring',
  'Quad',
  'Calf',
  'Hip',
  'Groin',
  'Chest',
  'Shoulder',
  'Trapezoids',
  'Latissimus',
  'Bicep',
  'Tricep',
  'Core',
];

export const router = createHashRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <WorkoutPage muscleGroup="Gluteus" />,
      },
      ...muscleGroups.map((group) => ({
        path: group.toLowerCase(),
        element: <WorkoutPage muscleGroup={group} />,
      })),
    ],
  },
]);