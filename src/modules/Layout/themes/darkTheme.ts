import { createTheme } from "@mui/material/styles";

export const THEME_COLORS = {
  primary: "#f5f5f5",
  orange: "#e09943",
  orangeHover: "#cc873b",
  dark: "#0d0d0d",
  light: "#f5f5f5",
  borderLight: "rgba(255,255,255,0.2)",
  backgroundHover: "rgba(255,255,255,0.05)",
} as const;

export const COMPONENT_STYLES = {
  borderRadius: 8,
  fontWeight: 600,
} as const;

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: THEME_COLORS.primary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: COMPONENT_STYLES.borderRadius,
          fontWeight: COMPONENT_STYLES.fontWeight,
        },
        containedPrimary: {
          backgroundColor: THEME_COLORS.orange,
          color: THEME_COLORS.dark,
          "&:hover": {
            backgroundColor: THEME_COLORS.orangeHover,
          },
        },
        outlined: {
          color: THEME_COLORS.light,
          borderColor: THEME_COLORS.borderLight,
          "&:hover": {
            borderColor: THEME_COLORS.light,
            backgroundColor: THEME_COLORS.backgroundHover,
          },
        },
      },
    },
  },
});
