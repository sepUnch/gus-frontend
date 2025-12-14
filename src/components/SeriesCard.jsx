"use client"

export const SeriesCard = ({ series, onSubmit, onVerify }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h4 className="text-lg font-bold text-foreground mb-2">{series.name}</h4>
      <p className="text-muted-foreground text-sm mb-4">{series.description}</p>

      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Submit Work
        </button>
        <button
          onClick={onVerify}
          className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
        >
          Verify Attendance
        </button>
      </div>
    </div>
  )
}
