# Accessibility Guidelines (WCAG 2.2 AA)

**The Capsule** targets full WCAG 2.2 AA compliance to ensure every senior, alumnus, and admin can access and contribute memories seamlessly.

---

## 1. Core Accessibility Standards

1. **Color Contrast:**
   - Text vs. Background: Minimum **4.5:1** contrast ratio for standard body text.
   - Large Text / Display Headings: Minimum **3:1** contrast ratio.
   - Interactive Elements & Focus States: High-contrast focus indicator (`Focus Blue` `#245CBA`). Color MUST NOT be the sole indicator of state.

2. **Keyboard Navigation:**
   - Every interactive element (buttons, links, inputs, dialogs) MUST be fully operable using keyboard standard navigation (`Tab`, `Shift+Tab`, `Space`, `Enter`, `Esc`).
   - Modal sheets and dialogs MUST trap focus while open and restore focus upon closing.

3. **Media Accessibility:**
   - All images MUST include meaningful alt text or marked decorative (`alt=""`).
   - Video controls MUST support keyboard focus, clear play/pause states, and caption track support.

4. **Motion Controls:**
   - Respect user system preference for reduced motion (`prefers-reduced-motion: reduce`).
