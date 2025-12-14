interface AchievementCardProps {
  achievement: any
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary/60 mx-auto mb-4 flex items-center justify-center text-2xl">
        {achievement.icon || "🏆"}
      </div>
      <h4 className="font-bold text-foreground mb-2">{achievement.name}</h4>
      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
      <p className="text-xs text-muted-foreground">
        Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
      </p>
    </div>
  )
}
