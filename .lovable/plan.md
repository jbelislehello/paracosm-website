## Add toast on RecentDreams fetch failure

Update `src/components/calm-magic/dream/RecentDreams.tsx`:

1. Import `toast` from `sonner`.
2. In the `catch` block of `fetchDreams`, call `toast.error("Couldn't load recent dreams", { description: "Check your connection and try again.", action: { label: "Retry", onClick: () => fetchDreams() } })`.
3. Keep the existing inline error card with the "Try again" button as a persistent fallback (toasts auto-dismiss).
4. Track an `isRetry` flag (or just rely on calling `fetchDreams` again) so the toast appears on every failed attempt, including manual retries.

No other changes.