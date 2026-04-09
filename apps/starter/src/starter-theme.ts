export type StarterTheme = {
  colors: {
    ink: string;
    muted: string;
    soft: string;
    cream: string;
    paper: string;
    dark: string;
    accent: string;
    green: string;
  };
  fonts: {
    sans: string;
    serif: string;
  };
  effects: {
    pageBackground: string;
    surfaceBorder: string;
    shadowSoft: string;
    shadowCard: string;
  };
  radii: {
    panel: string;
    card: string;
  };
};

export const starterTheme: StarterTheme = {
  colors: {
    ink: "#1b1813",
    muted: "#655b4b",
    soft: "#8a7d6a",
    cream: "#fffdf7",
    paper: "rgba(255, 251, 244, 0.88)",
    dark: "#13261f",
    accent: "#d35b2d",
    green: "#0d6f51"
  },
  fonts: {
    sans:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    serif:
      '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif'
  },
  effects: {
    pageBackground:
      "radial-gradient(circle at top, rgba(224, 94, 46, 0.18), transparent 28%), radial-gradient(circle at 85% 20%, rgba(13, 111, 81, 0.12), transparent 22%), linear-gradient(180deg, #fff9ee 0%, #f3ecde 100%)",
    surfaceBorder: "rgba(43, 36, 25, 0.12)",
    shadowSoft: "0 24px 64px rgba(44, 33, 16, 0.12)",
    shadowCard: "0 18px 42px rgba(22, 20, 12, 0.08)"
  },
  radii: {
    panel: "32px",
    card: "24px"
  }
};

export function getStarterThemeStyle(theme: StarterTheme = starterTheme) {
  return {
    "--color-starter-ink": theme.colors.ink,
    "--color-starter-muted": theme.colors.muted,
    "--color-starter-soft": theme.colors.soft,
    "--color-starter-cream": theme.colors.cream,
    "--color-starter-paper": theme.colors.paper,
    "--color-starter-dark": theme.colors.dark,
    "--color-starter-accent": theme.colors.accent,
    "--color-starter-green": theme.colors.green,
    "--font-sans": theme.fonts.sans,
    "--font-serif": theme.fonts.serif,
    "--page-background": theme.effects.pageBackground,
    "--surface-border": theme.effects.surfaceBorder,
    "--shadow-soft": theme.effects.shadowSoft,
    "--shadow-card": theme.effects.shadowCard,
    "--radius-panel": theme.radii.panel,
    "--radius-card": theme.radii.card
  } as const;
}
