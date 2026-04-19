function getEnv(name: string) {
  const value = process.env[name];
  return value && value.length > 0 ? value : null;
}

export function getStarterDataMode() {
  return getEnv("STARTER_DATA_MODE") ?? "auto";
}

export function getStarterDataBackend() {
  return getEnv("STARTER_DATA_BACKEND") ?? "auto";
}

export function isStaticExportMode() {
  return getEnv("STARTER_OUTPUT_MODE") === "export";
}

export function shouldUseSampleContent() {
  return isStaticExportMode() || getStarterDataMode() === "sample";
}

export function getStarterBasePath() {
  return getEnv("STARTER_BASE_PATH") ?? "";
}

export function withStarterBasePath(path: string) {
  if (!path.startsWith("/")) {
    return path;
  }

  const basePath = getStarterBasePath();

  if (!basePath) {
    return path;
  }

  return path === "/" ? basePath : `${basePath}${path}`;
}

export function getStarterSiteUrl() {
  const configured = getEnv("STARTER_SITE_URL");

  if (configured) {
    return configured;
  }

  const basePath = getStarterBasePath();
  return basePath ? `https://example.com${basePath}` : "https://example.com";
}
