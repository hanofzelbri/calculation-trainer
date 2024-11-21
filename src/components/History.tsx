import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useGameStore } from '../store/gameStore';

export const History = () => {
  const history = useGameStore(state => state.history);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Verlauf</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((entry, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                entry.isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{entry.task}</span>
                <span className="text-gray-600">
                  {Math.round(entry.time / 100) / 10} Sekunden
                </span>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-gray-500 text-center">
              Noch keine Aufgaben gelöst
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
