/**
 * Theme Manager für Admin Dark Mode
 * Verwaltet das Umschalten zwischen hellem und dunklem Design im Admin-Bereich
 */

class AdminThemeManager {
    constructor() {
        this.themeKey = 'boxing-studio-admin-theme';
        this.currentTheme = this.getStoredTheme();
        this.init();
    }

    /**
     * Gespeichertes Theme aus localStorage abrufen
     */
    getStoredTheme() {
        return localStorage.getItem(this.themeKey) || 'light';
    }

    /**
     * Theme in localStorage speichern
     */
    setStoredTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
    }

    /**
     * Theme initialisieren
     */
    init() {
        // Theme beim Laden anwenden
        this.applyTheme(this.currentTheme);

        // Toggle-Button erstellen
        this.createToggleButton();

        // Event-Listener für System-Theme-Änderungen (optional)
        this.watchSystemTheme();
    }

    /**
     * Theme auf das Dokument anwenden
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateToggleIcon();
    }

    /**
     * Zwischen Themes wechseln
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.setStoredTheme(newTheme);
    }

    /**
     * Toggle-Button erstellen und einfügen
     */
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Theme umschalten');
        button.setAttribute('title', 'Zwischen Hell- und Dunkelmodus wechseln');
        button.setAttribute('type', 'button');

        const icon = document.createElement('span');
        icon.className = 'theme-toggle-icon';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-hidden', 'true');

        button.appendChild(icon);
        document.body.appendChild(button);

        this.toggleButton = button;
        this.toggleIcon = icon;

        // Event-Listener hinzufügen
        button.addEventListener('click', () => this.toggleTheme());

        // Icon initial setzen
        this.updateToggleIcon();
    }

    /**
     * Icon im Toggle-Button aktualisieren
     */
    updateToggleIcon() {
        if (!this.toggleIcon) return;

        if (this.currentTheme === 'dark') {
            this.toggleIcon.textContent = '☀️'; // Sonne für Wechsel zu Light Mode
            this.toggleButton.setAttribute('aria-label', 'Zum hellen Modus wechseln');
        } else {
            this.toggleIcon.textContent = '🌙'; // Mond für Wechsel zu Dark Mode
            this.toggleButton.setAttribute('aria-label', 'Zum dunklen Modus wechseln');
        }
    }

    /**
     * System-Theme-Änderungen beobachten (optional)
     */
    watchSystemTheme() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Nur reagieren, wenn kein manuelles Theme gesetzt wurde
        darkModeQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem(this.themeKey)) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * Aktuelles Theme abrufen
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Theme Manager beim Laden initialisieren
if (typeof window !== 'undefined') {
    window.adminThemeManager = new AdminThemeManager();
}