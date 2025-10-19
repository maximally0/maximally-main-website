import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Dev helper: capture all uncaught errors and unhandled promise rejections
// so we can see the original error message behind Vite's runtime overlay.
if (import.meta.env.DEV) {
	// Install a small console filter to suppress noisy extension/iframe messages
	const _origError = console.error.bind(console);
	const _origWarn = console.warn.bind(console);
	console.error = (...args: any[]) => {
		try {
			const text = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
			if (text.includes('Unchecked runtime.lastError') || text.includes('message port closed before a response was received')) {
				return; // drop noisy extension/iframe messages
			}
		} catch (e) {}
		return _origError(...args);
	};
	console.warn = (...args: any[]) => {
		try {
			const text = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
			if (text.includes('Suppressed unhandled rejection with null reason')) {
				return; // hide our internal suppressed-warning if desired
			}
		} catch (e) {}
		return _origWarn(...args);
	};
	window.addEventListener('error', (ev) => {
		try {
			// Some browser-extension/iframe messages are noisy and not actionable from the app.
			// Silently ignore the common 'message port closed' error emitted by some extensions.
			const msg = (ev && (ev as any).message) || (ev && (ev as any).error && (ev as any).error.message);
			if (typeof msg === 'string' && msg.includes('The message port closed before a response was received')) {
				try { ev.preventDefault(); } catch (e) {}
				return;
			}
			// Log other errors for visibility
			// eslint-disable-next-line no-console
			console.error('[Global Error Handler] Uncaught error:', ev.error || ev.message || ev);
		} catch (e) {}
	});

	window.addEventListener('unhandledrejection', (ev) => {
			try {
				// If the rejection reason is null (commonly from extension/iframe messaging),
				// just prevent default and silently ignore it to avoid showing runtime overlays.
				if (ev && (ev as any).reason == null) {
					try { ev.preventDefault(); } catch (e) {}
					return;
				}

				// Log other rejections for visibility
				// eslint-disable-next-line no-console
				console.error('[Global Error Handler] Unhandled promise rejection:', ev.reason || ev);
			} catch (e) {}
	});
}

createRoot(document.getElementById("root")!).render(<App />);
