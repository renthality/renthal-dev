export function useAchievements() {
  return { unlock: (_: string) => {}, toast: null as null };
}

export function AchievementToast(_: { toast: unknown }) {
  return null;
}
