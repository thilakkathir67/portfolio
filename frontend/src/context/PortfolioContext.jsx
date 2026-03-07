import { createContext, useContext, useEffect, useMemo, useState } from "react";
import defaultContent from "../../../shared/defaultContent.js";
import {
  changeAdminPasscode,
  fetchContent,
  loginAdmin,
  logoutAdmin,
  saveContent,
  validateAdminSession
} from "../lib/api";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [content, setContentState] = useState(defaultContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const [serverContent] = await Promise.all([
          fetchContent(),
          validateAdminSession().then(() => {
            if (active) setIsAdmin(true);
          }).catch(() => {
            if (active) setIsAdmin(false);
          })
        ]);
        if (active) setContentState(serverContent);
      } catch {
        if (active) setContentState(defaultContent);
      } finally {
        if (active) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  async function setContent(nextContent) {
    await saveContent(nextContent);
    setContentState(nextContent);
  }

  async function unlockAdmin(passcode) {
    await loginAdmin(passcode);
    setIsAdmin(true);
  }

  async function lockAdmin() {
    await logoutAdmin();
    setIsAdmin(false);
  }

  async function updatePasscode(currentPasscode, newPasscode) {
    await changeAdminPasscode(currentPasscode, newPasscode);
  }

  const value = useMemo(
    () => ({
      content,
      setContent,
      isAdmin,
      setIsAdmin,
      unlockAdmin,
      lockAdmin,
      updatePasscode,
      loading
    }),
    [content, isAdmin, loading]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }
  return context;
}
