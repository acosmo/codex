export function track(book, chapter) {
  if (!book) return;

  const conn = navigator.connection || {};

  /* -------------------------
     DEVICE TYPE DETECTION
  --------------------------*/
  const ua = navigator.userAgent;
  const isMobile  = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
  const isTablet  = /iPad|Tablet|PlayBook/i.test(ua) || (isMobile && Math.min(screen.width, screen.height) >= 600);
  const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  /* -------------------------
     BROWSER DETECTION
  --------------------------*/
  const browserName = (() => {
    if (/Edg\//i.test(ua))     return "Edge";
    if (/OPR\//i.test(ua))     return "Opera";
    if (/Chrome\//i.test(ua))  return "Chrome";
    if (/Firefox\//i.test(ua)) return "Firefox";
    if (/Safari\//i.test(ua))  return "Safari";
    return "Unknown";
  })();

  const browserVersion = (() => {
    const match =
      ua.match(/(?:Edg|OPR|Chrome|Firefox|Safari)\/([0-9.]+)/i);
    return match ? match[1] : null;
  })();

  /* -------------------------
     OS DETECTION
  --------------------------*/
  const osName = (() => {
    if (/Windows NT 10/i.test(ua))  return "Windows 10/11";
    if (/Windows NT 6.3/i.test(ua)) return "Windows 8.1";
    if (/Windows NT 6.1/i.test(ua)) return "Windows 7";
    if (/Windows/i.test(ua))        return "Windows";
    if (/Android ([0-9.]+)/i.test(ua)) return `Android ${ua.match(/Android ([0-9.]+)/i)[1]}`;
    if (/iPhone OS ([0-9_]+)/i.test(ua)) return `iOS ${ua.match(/iPhone OS ([0-9_]+)/i)[1].replace(/_/g,".")}`;
    if (/iPad.*OS ([0-9_]+)/i.test(ua))  return `iPadOS ${ua.match(/iPad.*OS ([0-9_]+)/i)[1].replace(/_/g,".")}`;
    if (/Mac OS X ([0-9_]+)/i.test(ua))  return `macOS ${ua.match(/Mac OS X ([0-9_]+)/i)[1].replace(/_/g,".")}`;
    if (/Linux/i.test(ua))          return "Linux";
    return "Unknown";
  })();

  /* -------------------------
     SCREEN & DISPLAY
  --------------------------*/
  const colorDepth    = screen.colorDepth    || null;
  const orientation   = screen.orientation?.type || (window.innerWidth > window.innerHeight ? "landscape" : "portrait");
  const hdr           = window.matchMedia("(dynamic-range: high)").matches;
  const darkMode      = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------
     BATTERY (async — fire & forget)
  --------------------------*/
  const sendPayload = (extra = {}) => {
    fetch("/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book,
        chapter: chapter ?? 1,

        // --- page ---
        url:      window.location.href,
        referrer: document.referrer || null,

        // --- screen & viewport ---
        resolution:   `${screen.width}x${screen.height}`,
        viewport:     `${window.innerWidth}x${window.innerHeight}`,
        pixelRatio:   window.devicePixelRatio,
        colorDepth,
        orientation,
        hdr,
        darkMode,
        reducedMotion,

        // --- device ---
        deviceType,

        // --- browser ---
        browserName,
        browserVersion,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack:     navigator.doNotTrack === "1",
        pdfViewer:      navigator.pdfViewerEnabled ?? null,

        // --- OS / platform ---
        osName,
        platform: navigator.platform,

        // --- locale ---
        language: navigator.language,
        languages: (navigator.languages || []).join(","),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

        // --- hardware ---
        cores:  navigator.hardwareConcurrency || null,
        memory: navigator.deviceMemory        || null,
        touch:  navigator.maxTouchPoints      || 0,
        gpu:    (() => {
          try {
            const gl = document.createElement("canvas").getContext("webgl");
            const dbg = gl?.getExtension("WEBGL_debug_renderer_info");
            return dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null;
          } catch { return null; }
        })(),

        // --- network ---
        netType:  conn.effectiveType || null,
        downlink: conn.downlink      || null,
        rtt:      conn.rtt           ?? null,
        saveData: conn.saveData      ?? null,

        // --- battery (filled in async below) ---
        batteryLevel:   extra.batteryLevel   ?? null,
        batteryCharging: extra.batteryCharging ?? null,

        userAgent: ua
      })
    });
  };

  if (navigator.getBattery) {
    navigator.getBattery()
      .then(b => sendPayload({
        batteryLevel:    Math.round(b.level * 100),
        batteryCharging: b.charging
      }))
      .catch(() => sendPayload());
  } else {
    sendPayload();
  }
}