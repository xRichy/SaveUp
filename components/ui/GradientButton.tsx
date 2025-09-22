// src/components/ui/GradientButton.tsx
import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ColorValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeStore } from "@/store/theme";

type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
  style?: ViewStyle;
}

const GRADIENT_PRIMARY: GradientColors = ["#8B5CF6", "#EC4899"] as const;
const GRADIENT_SECONDARY: GradientColors = ["#6B7280", "#374151"] as const;
const GRADIENT_OUTLINE_DARK: GradientColors = ["#111827", "#111827"] as const;
const GRADIENT_OUTLINE_LIGHT: GradientColors = ["#FFFFFF", "#FFFFFF"] as const;

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  style,
  ...props
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const getGradientColors = (): GradientColors => {
    switch (variant) {
      case "secondary":
        return GRADIENT_SECONDARY;
      case "outline":
        return isDark ? GRADIENT_OUTLINE_DARK : GRADIENT_OUTLINE_LIGHT;
      default:
        return GRADIENT_PRIMARY;
    }
  };

  const getPadding = (): ViewStyle => {
    switch (size) {
      case "sm":
        return { paddingVertical: 8, paddingHorizontal: 14 };
      case "lg":
        return { paddingVertical: 16, paddingHorizontal: 28 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (size) {
      case "sm":
        return { fontSize: 14, fontWeight: "600" };
      case "lg":
        return { fontSize: 18, fontWeight: "700" };
      default:
        return { fontSize: 16, fontWeight: "600" };
    }
  };

  // Outline variant: non usare gradient (si usa bordo e background adattivo)
  if (variant === "outline") {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={loading}
        style={[
          styles.outlineContainer,
          getPadding(),
          { backgroundColor: isDark ? "#0f1720" : "#ffffff", borderColor: "#8B5CF6" },
          style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={isDark ? "#FFF" : "#8B5CF6"} />
        ) : (
          <>
            {icon}
            <Text style={[getTextStyle(), { color: "#8B5CF6", marginLeft: icon ? 8 : 0 }]}>
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  // Primary / Secondary: gradient background
  return (
    <TouchableOpacity activeOpacity={0.85} disabled={loading} style={style} {...props}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, getPadding()]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon}
            <Text style={[getTextStyle(), styles.whiteText, icon ? { marginLeft: 8 } : null]}>
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  outlineContainer: {
    borderWidth: 2,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  whiteText: {
    color: "#fff",
  },
});
