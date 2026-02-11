

# Fix Forms + Minor Cleanup

## 1. Retreat Invitation Form -- send email via mailto

**File:** `src/pages/ParacosmRetreatLanding.tsx`

Currently the `handleSubmit` only shows a toast. Update it to open a mailto link to `jbelisle@helloarchitekt.com` with the name and email pre-filled in the body, then show the success state.

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim() || !email.trim()) {
    toast.error("Please fill in both fields.");
    return;
  }

  const subject = encodeURIComponent("Paracosm Retreat - Invitation Request");
  const body = encodeURIComponent(
    `New invitation request for the Paracosm Retreat:\n\nName: ${name}\nEmail: ${email}`
  );
  window.location.href = `mailto:jbelisle@helloarchitekt.com?subject=${subject}&body=${body}`;

  setSubmitted(true);
  toast.success("You've been added to the invitation list!");
};
```

## 2. Drift Subscribe Form -- send email via mailto

**File:** `src/pages/DriftLanding.tsx`

Same pattern -- update `handleSubscribe` to open a mailto link.

```tsx
const handleSubscribe = (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) return;

  const subject = encodeURIComponent("Drift Newsletter - New Subscriber");
  const body = encodeURIComponent(`New Drift newsletter subscriber:\n\nEmail: ${email}`);
  window.location.href = `mailto:jbelisle@helloarchitekt.com?subject=${subject}&body=${body}`;

  toast({ title: "Welcome to the drift!", description: "You'll receive your first update soon." });
  setEmail("");
};
```

## 3. Footer -- rename "Drift Podcast" to "Drift"

**File:** `src/components/Footer.tsx` (line 84)

Change the text from "Drift Podcast" to "Drift".

## Files modified
- `src/pages/ParacosmRetreatLanding.tsx`
- `src/pages/DriftLanding.tsx`
- `src/components/Footer.tsx`

