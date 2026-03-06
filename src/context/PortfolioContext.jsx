import { createContext, useContext, useEffect, useMemo, useState } from "react";
import defaultContent from "../content/defaultContent";

const CONTENT_KEY = "portfolio_content_v1";
const ADMIN_KEY = "portfolio_is_admin";
const PASSCODE_KEY = "portfolio_admin_code";
const DEFAULT_PASSCODE = "thilak@123";

const PortfolioContext = createContext(null);

function normalizeAboutBlocks(savedAbout, defaultAbout) {
  if (Array.isArray(savedAbout?.blocks) && savedAbout.blocks.length) {
    return savedAbout.blocks.map((block) => {
      if (block?.type !== "image") return block;
      if (Array.isArray(block.images) && block.images.length) return block;
      if (typeof block.value === "string" && block.value) {
        return {
          ...block,
          images: [{ url: block.value, alt: block.alt || "" }]
        };
      }
      return {
        ...block,
        images: [{ url: "", alt: "" }]
      };
    });
  }
  if (typeof savedAbout?.text === "string" && savedAbout.text.trim()) {
    return [{ type: "text", value: savedAbout.text }];
  }
  return defaultAbout.blocks;
}

function mergeContent(saved, defaults) {
  const defaultProject = defaults.portfolio.projects[0];
  return {
    ...defaults,
    ...saved,
    hero: {
      ...defaults.hero,
      ...(saved?.hero || {}),
      socials: Array.isArray(saved?.hero?.socials) ? saved.hero.socials : defaults.hero.socials,
      stats: Array.isArray(saved?.hero?.stats) ? saved.hero.stats : defaults.hero.stats
    },
    about: {
      ...defaults.about,
      ...(saved?.about || {}),
      blocks: normalizeAboutBlocks(saved?.about, defaults.about)
    },
    portfolio: {
      ...defaults.portfolio,
      ...(saved?.portfolio || {}),
      projects: Array.isArray(saved?.portfolio?.projects)
        ? saved.portfolio.projects.map((project) => {
            const merged = { ...defaultProject, ...project };
            if (Array.isArray(project?.images) && project.images.length) return merged;
            if (typeof merged.imageUrl === "string" && merged.imageUrl) {
              return {
                ...merged,
                images: [{ url: merged.imageUrl, alt: project?.name || "Project image" }]
              };
            }
            return {
              ...merged,
              images: defaultProject.images
            };
          })
        : defaults.portfolio.projects
    },
    contact: {
      ...defaults.contact,
      ...(saved?.contact || {})
    }
  };
}

function readContent() {
  try {
    const saved = localStorage.getItem(CONTENT_KEY);
    if (!saved) return defaultContent;
    return mergeContent(JSON.parse(saved), defaultContent);
  } catch {
    return defaultContent;
  }
}

function readPasscode() {
  return localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
}

export function PortfolioProvider({ children }) {
  const [content, setContent] = useState(readContent);
  const [passcode, setPasscode] = useState(readPasscode);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_KEY) === "true");

  useEffect(() => {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem(PASSCODE_KEY, passcode);
  }, [passcode]);

  useEffect(() => {
    if (isAdmin) {
      sessionStorage.setItem(ADMIN_KEY, "true");
    } else {
      sessionStorage.removeItem(ADMIN_KEY);
    }
  }, [isAdmin]);

  const value = useMemo(
    () => ({
      content,
      setContent,
      passcode,
      setPasscode,
      isAdmin,
      setIsAdmin
    }),
    [content, passcode, isAdmin]
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
