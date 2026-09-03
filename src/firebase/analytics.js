import app from './config'

// Analytics is nice-to-have telemetry, not something any page needs in
// order to render. Loading it is deferred until the browser is idle so it
// never competes with the app's own code for bandwidth/parse time on
// first load. Call initAnalytics() once from the app root.
export function initAnalytics() {
  const load = async () => {
    const { isSupported, getAnalytics } = await import('firebase/analytics')
    if (await isSupported()) getAnalytics(app)
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(load)
  } else {
    setTimeout(load, 2000)
  }
}
