import { Outlet, Link, useLocation } from 'react-router';
import { Dumbbell } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

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

export function RootLayout() {
  const location = useLocation();
  
  const getActivePath = () => {
    if (location.pathname === '/') return 'gluteus';
    return location.pathname.slice(1);
  };

  const activePath = getActivePath();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Dumbbell className="size-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl dark:text-white">Weightlifting Tracker</h1>
            </div>
            <ThemeToggle />
          </div>
          
          <nav className="flex flex-wrap gap-2">
            {muscleGroups.map((group) => {
              const path = group.toLowerCase();
              const isActive = activePath === path;
              
              return (
                <Link
                  key={group}
                  to={path === 'gluteus' ? '/' : `/${path}`}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {group}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}