"use client"

export const TrackCard = ({ track, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all"
    >
      <h3 className="text-xl font-bold text-foreground mb-2">{track.name}</h3>
      <p className="text-muted-foreground mb-4">{track.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{track.seriesCount} series</span>
        <span className="text-sm font-semibold text-primary">View →</span>
      </div>
    </div>
  )
}
