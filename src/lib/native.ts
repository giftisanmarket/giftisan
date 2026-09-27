"use client";

import { Capacitor } from "@capacitor/core";

/**
 * Checks if the current runtime is running inside an iOS or Android Capacitor wrapper.
 */
export function isNativePlatform(): boolean {
  if (typeof window === "undefined") return false;
  return Capacitor.isNativePlatform();
}

/**
 * Gets the current platform ('ios' | 'android' | 'web')
 */
export function getNativePlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  return Capacitor.getPlatform() as "ios" | "android" | "web";
}

/**
 * Native Haptic Feedback for buttons, cart updates, and favorite toggles
 */
export async function triggerHaptic(
  type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light"
): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    const { Haptics, ImpactStyle, NotificationType } = await import("@capacitor/haptics");

    if (type === "success") {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (type === "warning") {
      await Haptics.notification({ type: NotificationType.Warning });
    } else if (type === "error") {
      await Haptics.notification({ type: NotificationType.Error });
    } else {
      const styleMap = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      };
      await Haptics.impact({ style: styleMap[type] || ImpactStyle.Light });
    }
  } catch {
    // Graceful fallback if unsupported
  }
}

/**
 * Initialize native UI enhancements (Status bar, Splash screen, Hardware Back button)
 */
export async function initNativeApp(onNavigateBack?: () => void): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    // 1. Configure Native Status Bar
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#064E3B" }); // Brand forest green
    }

    // 2. Hide Splash Screen after app loads
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();

    // 3. Android Hardware Back Button Handling
    const { App } = await import("@capacitor/app");
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack && onNavigateBack) {
        onNavigateBack();
      } else if (canGoBack && typeof window !== "undefined") {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  } catch (error) {
    console.warn("Failed to initialize native app plugins:", error);
  }
}

/**
 * Request permission and register for native Push Notifications
 */
export async function registerPushNotifications(
  onTokenReceived?: (token: string) => void
): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      console.warn("Push notification permission was not granted");
      return;
    }

    await PushNotifications.register();

    // Listeners
    PushNotifications.addListener("registration", (token) => {
      if (onTokenReceived) onTokenReceived(token.value);
    });

    PushNotifications.addListener("registrationError", (err) => {
      console.error("Push registration error: ", err.error);
    });

    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("Push received in foreground: ", notification);
    });

    PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      console.log("Push notification tapped: ", action);
    });
  } catch (error) {
    console.warn("Push notifications initialization failed:", error);
  }
}
