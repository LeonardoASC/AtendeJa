
(function () {
    function registerSW() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(console.error);
            });
        }
    }

    function markIfStandalone() {
        const mq = window.matchMedia?.('(display-mode: standalone)');
        const apply = () => {
            const isStandalone = !!(mq?.matches || window.navigator.standalone);
            document.documentElement.classList.toggle('pwa', isStandalone);
        };
        apply();
        mq?.addEventListener?.('change', apply);
    }

    function setupFullscreenHelpers() {
        const isFS = () =>
            !!(document.fullscreenElement || document.webkitFullscreenElement);

        async function enterFS() {
            const el = document.documentElement;
            if (el.requestFullscreen) return el.requestFullscreen();
            if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
        }

        async function exitFS() {
            if (document.exitFullscreen) return document.exitFullscreen();
            if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
        }

        window.isFullscreen = isFS;
        window.enterFullscreen = () => enterFS().catch(console.error);
        window.exitFullscreen = () => exitFS().catch(console.error);
        window.toggleFullscreen = () => (isFS() ? exitFS() : enterFS());

        const onChange = () => {
            document.documentElement.classList.toggle('is-fullscreen', isFS());
        };
        document.addEventListener('fullscreenchange', onChange);
        document.addEventListener('webkitfullscreenchange', onChange);
    }

    function setupInstallCapture() {
        window.__deferredInstallPrompt = null;

        window.promptInstallApp = async () => {
            if (!window.__deferredInstallPrompt) return false;
            const e = window.__deferredInstallPrompt;
            window.__deferredInstallPrompt = null;
            await e.prompt();
            await e.userChoice.catch(() => { });
            return true;
        };

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.__deferredInstallPrompt = e;
            window.dispatchEvent(new CustomEvent('pwa:install-available'));
        });

        window.addEventListener('appinstalled', () => {
            window.__deferredInstallPrompt = null;
            window.dispatchEvent(new CustomEvent('pwa:installed'));
        });
    }

    registerSW();
    markIfStandalone();
    setupFullscreenHelpers();
    setupInstallCapture();
})();
