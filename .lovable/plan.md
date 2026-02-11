

# Update GL!TCH Methodology CTA Email

## What's Changing

The CTA section at the bottom of the GL!TCH Methodology page will be updated so both buttons use the correct email address `jbelisle@helloarchitekt.com`:

- **"Start Free" button**: Change from linking to `/auth` to a `mailto:jbelisle@helloarchitekt.com` with a subject line like "Start a GL!TCH Session"
- **"Contact Us" button**: Update from `hello@example.com` to `jbelisle@helloarchitekt.com`

## Technical Details

### File: `src/pages/GlitchMethodology.tsx` (lines 270-276)

- Change the "Start Free" `<Link to="/auth">` to an `<a href="mailto:jbelisle@helloarchitekt.com?subject=Start a GL!TCH Session">`
- Change the "Contact Us" `mailto:hello@example.com` to `mailto:jbelisle@helloarchitekt.com?subject=GL!TCH Methodology Inquiry`

This is a small, focused change -- two lines updated in one file.

