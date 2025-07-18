import { useCallback, useEffect, useState } from "react";
import {
  getTokenFromCookies,
  getRefreshTokenFromCookies,
  saveTokensToCookies,
  clearAllCookies,
} from "@/lib/cookies";
import { checkTokenValidity, refreshAccessToken } from "@/lib/apiFetch";

interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
  isValid: boolean;
  isLoading: boolean;
}

export const useTokenManagement = () => {
  const [tokenData, setTokenData] = useState<TokenData>({
    accessToken: null,
    refreshToken: null,
    isValid: false,
    isLoading: true,
  });

  // Check token validity
  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await checkTokenValidity(token);
      return response.status === 200;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  }, []);

  // Refresh access token
  const refreshToken = useCallback(
    async (refreshToken: string): Promise<string | null> => {
      try {
        const response = await refreshAccessToken(refreshToken);
        if (response.data && response.data.data) {
          const newAccessToken = response.data.data.access_token;
          const newRefreshToken = response.data.data.refresh_token;

          // Save new tokens
          if (newRefreshToken) {
            saveTokensToCookies(newAccessToken, newRefreshToken);
          } else {
            saveTokensToCookies(newAccessToken, refreshToken); // Keep old refresh token
          }

          return newAccessToken;
        }
        return null;
      } catch (error) {
        console.error("Token refresh failed:", error);
        return null;
      }
    },
    []
  );

  // Initialize tokens from cookies
  const initializeTokens = useCallback(async () => {
    const accessToken = getTokenFromCookies();
    const refreshTokenValue = getRefreshTokenFromCookies();

    if (!accessToken) {
      setTokenData({
        accessToken: null,
        refreshToken: null,
        isValid: false,
        isLoading: false,
      });
      return;
    }

    // Validate current access token
    const isValid = await validateToken(accessToken);

    if (isValid) {
      setTokenData({
        accessToken,
        refreshToken: refreshTokenValue,
        isValid: true,
        isLoading: false,
      });
    } else if (refreshTokenValue) {
      // Try to refresh the token
      const newAccessToken = await refreshToken(refreshTokenValue);

      if (newAccessToken) {
        setTokenData({
          accessToken: newAccessToken,
          refreshToken: refreshTokenValue,
          isValid: true,
          isLoading: false,
        });
      } else {
        // Refresh failed, clear all tokens
        clearAllCookies();
        setTokenData({
          accessToken: null,
          refreshToken: null,
          isValid: false,
          isLoading: false,
        });
      }
    } else {
      // No refresh token, clear tokens
      clearAllCookies();
      setTokenData({
        accessToken: null,
        refreshToken: null,
        isValid: false,
        isLoading: false,
      });
    }
  }, [validateToken, refreshToken]);

  // Get valid token (with automatic refresh if needed)
  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (tokenData.isValid && tokenData.accessToken) {
      return tokenData.accessToken;
    }

    // Try to refresh if we have a refresh token
    if (tokenData.refreshToken) {
      const newAccessToken = await refreshToken(tokenData.refreshToken);
      if (newAccessToken) {
        setTokenData((prev) => ({
          ...prev,
          accessToken: newAccessToken,
          isValid: true,
        }));
        return newAccessToken;
      }
    }

    return null;
  }, [tokenData, refreshToken]);

  // Clear all tokens (logout)
  const clearTokens = useCallback(() => {
    clearAllCookies();
    setTokenData({
      accessToken: null,
      refreshToken: null,
      isValid: false,
      isLoading: false,
    });
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeTokens();
  }, [initializeTokens]);

  return {
    ...tokenData,
    validateToken,
    refreshToken,
    getValidToken,
    clearTokens,
    initializeTokens,
  };
};
