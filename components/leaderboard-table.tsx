import { Medal } from "lucide-react";

// Matches backend DTO
export interface LeaderboardItem {
  rank: number;
  user_id: number;
  name: string;
  avatar: string;
  total_score: number;
}

interface LeaderboardTableProps {
  data: LeaderboardItem[];
}

export const LeaderboardTable = ({ data }: LeaderboardTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 w-20 text-center">Rank</th>
            <th className="px-6 py-4">Member</th>
            <th className="px-6 py-4 text-right">Total Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              {/* RANK */}
              <td className="px-6 py-4 text-center">
                <span className="font-mono font-bold text-slate-500">#{item.rank}</span>
              </td>

              {/* MEMBER INFO (AVATAR + NAME) */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                    {item.avatar ? (
                      <img
                        // Logic: If URL starts with http, use it. Otherwise prepend backend URL.
                        src={item.avatar.startsWith("http") ? item.avatar : `http://localhost:8080/${item.avatar}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                        {item.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </p>
                  </div>
                </div>
              </td>

              {/* SCORE */}
              <td className="px-6 py-4 text-right">
                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold text-sm">
                  {item.total_score} XP
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};