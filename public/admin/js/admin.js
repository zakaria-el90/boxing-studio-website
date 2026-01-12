//admin/js/admin.js
import { AdminController } from "./controllers/admin-controller.js";

const controller = new AdminController();
try {
    console.log("Initializing Admin Controller...");
    controller.init();
    console.log("Admin Controller initialized.");
} catch (error) {
    console.error("Admin initialization failed:", error);
    alert("Fehler beim Starten des Admin-Bereichs: " + error.message + "\nBitte Konsole (F12) prüfen.");
}
