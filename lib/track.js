export function track(book, chapter) {
  if (!book) return;

  const conn = navigator.connection || {};

  fetch("/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      book,
      chapter:    chapter ?? 1,

      // screen & viewport
      resolution: `${screen.width}x${screen.height}`,
      viewport:   `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,

      // locale
      language:   navigator.language,
      platform:   navigator.platform,
      timezone:   Intl.DateTimeFormat().resolvedOptions().timeZone,

      // hardware
      cores:      navigator.hardwareConcurrency  || null,
      memory:     navigator.deviceMemory         || null,
      touch:      navigator.maxTouchPoints       || 0,

      // network
      netType:    conn.effectiveType             || null,
      downlink:   conn.downlink                  || null,

      // page context
      referrer:   document.referrer              || null,
      userAgent:  navigator.userAgent
    })
  });
}