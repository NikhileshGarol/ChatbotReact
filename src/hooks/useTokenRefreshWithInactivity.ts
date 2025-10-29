import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useSession } from "../contexts/SessionContext";
import { refreshToken } from "../services/auth.service";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes
const REFRESH_BEFORE_EXPIRY = 60 * 1000; // Refresh 1 minute before expiry

type DecodedToken = { exp: number };

export function useTokenRefreshWithInactivity() {
  const { setSessionExpired } = useSession();
  const inactivityTimeout = useRef<number | null>(null);
  const refreshTimeout = useRef<number | null>(null);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      inactivityTimeout.current && clearTimeout(inactivityTimeout.current);
      refreshTimeout.current && clearTimeout(refreshTimeout.current);
    };
  }, []);

  useEffect(() => {
    function resetInactivityTimer() {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(() => {
        setSessionExpired(true); // Inactivity triggered session expiry popup
      }, INACTIVITY_LIMIT);
    }

    // Event listeners to detect activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    resetInactivityTimer(); // Start initial timer

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      inactivityTimeout.current && clearTimeout(inactivityTimeout.current);
    };
  }, [setSessionExpired]);

  useEffect(() => {
    const raw = localStorage.getItem("AUTH_STORAGE_V1");
    if (!raw) return;

    const auth = JSON.parse(raw);
    const token = auth?.token;

    if (!token) return;

    let decoded: DecodedToken;
    try {
      decoded = jwtDecode(token);
    } catch {
      setSessionExpired(true);
      return;
    }

    const expiryTimestampMs = decoded.exp * 1000;
    const nowMs = Date.now();
    const refreshInMs = expiryTimestampMs - nowMs - REFRESH_BEFORE_EXPIRY;

    if (refreshInMs <= 0) {
      // Token expires soon or already expired
      setSessionExpired(true);
      return;
    }

    // Schedule refresh token call 1 minute before expiry
    refreshTimeout.current = setTimeout(async () => {
      try {
        const refreshed = await refreshToken(auth.refreshToken);
        localStorage.setItem(
          "AUTH_STORAGE_V1",
          JSON.stringify({
            ...auth,
            token: refreshed.access_token,
            refreshToken: refreshed.refresh_token,
          })
        );
      } catch {
        setSessionExpired(true);
      }
    }, refreshInMs);

    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, [setSessionExpired]);
}
