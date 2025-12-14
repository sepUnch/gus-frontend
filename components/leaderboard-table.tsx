interface LeaderboardTableProps {
  data: any[]
  isLoading: boolean
}

export const LeaderboardTable = ({ data, isLoading }: LeaderboardTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rank</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Score</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Submissions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((entry, index) => (
            <tr key={entry.id} className="border-b border-border hover:bg-muted transition-colors">
              <td className="px-6 py-4">
                <span className="text-lg font-bold text-primary">{index + 1}</span>
              </td>
              <td className="px-6 py-4 text-foreground">{entry.userName}</td>
              <td className="px-6 py-4">
                <span className="font-semibold text-foreground">{entry.score}</span>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{entry.submissionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
