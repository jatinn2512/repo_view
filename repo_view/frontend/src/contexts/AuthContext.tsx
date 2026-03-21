import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { LoginRequest, LoginResponse } from "../types/auth";

const STORAGE_KEY = "repo-view-auth-session";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

interface AuthContextValue {
  session: LoginResponse | null;
  user: LoginResponse["user"] | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function requestLogin(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { detail?: string }
      | null;

    throw new Error(
      errorPayload?.detail ??
        "Unable to sign in. Please verify the demo credentials."
    );
  }

  return (await response.json()) as LoginResponse;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LoginResponse | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedSession = window.localStorage.getItem(STORAGE_KEY);

    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession) as LoginResponse);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsInitializing(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const nextSession = await requestLogin(credentials);
    setSession(nextSession);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  };

  const logout = () => {
    setSession(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAuthenticated: Boolean(session?.access_token),
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

