//admin/js/views/admin-view.js
export class AdminView {
    constructor() {
        this.setupSection = document.querySelector('[data-section="setup"]');
        this.loginSection = document.querySelector('[data-section="login"]');
        this.dashboardSection = document.querySelector('[data-page-section="dashboard"]');
        this.membersSection = document.querySelector('[data-page-section="members"]');
        this.mediaSection = document.querySelector('[data-page-section="media"]');
        this.auditSection = document.querySelector('[data-page-section="audit"]');
        this.pageSections = document.querySelectorAll('[data-page-section]');
        this.pageTitle = document.querySelector("[data-page-title]");
        this.sidebar = document.querySelector('[data-layout="sidebar"]');
        this.topbar = document.querySelector(".admin-topbar");
        this.navLinks = document.querySelectorAll("[data-nav]");
        this.logoutButton = document.querySelector('[data-action="logout"]');
        this.refreshButton = document.querySelector('[data-action="refresh"]');
        this.exportButton = document.querySelector('[data-action="export"]');
        this.auditRefreshButton = document.querySelector('[data-action="refresh-audit"]');
        this.loginForm = document.querySelector('[data-form="login"]');
        this.memberForm = document.querySelector('[data-form="member"]');
        this.loginStatus = document.querySelector('[data-status="login"]');
        this.memberStatus = document.querySelector('[data-status="member"]');
        this.memberTable = document.querySelector('[data-table="members"]');
        this.auditTable = document.querySelector('[data-table="audit"]');
        this.mediaForm = document.querySelector('[data-form="media"]');
        this.mediaList = document.querySelector('[data-list="media"]');
        this.searchInput = document.querySelector('[data-filter="search"]');
        this.statusFilter = document.querySelector('[data-filter="status"]');
        this.paymentFilter = document.querySelector('[data-filter="payment"]');
        this.auditSearchInput = document.querySelector('[data-filter="audit-search"]');
        this.resetFiltersButton = document.querySelector('[data-action="reset-filters"]');
        this.resultsNote = document.querySelector('[data-results="members"]');
        this.auditResultsNote = document.querySelector('[data-results="audit"]');
        this.memberIdInput = document.querySelector("#member-id");
        this.actionsHeader = document.querySelector('[data-column="actions"]');
        this.memberModal = document.querySelector('[data-modal="member"]');
        this.memberModalTitle = document.querySelector("[data-member-modal-title]");
        this.memberModalTriggers = document.querySelectorAll('[data-action="open-member-modal"]');
        this.memberModalCloseButtons = document.querySelectorAll('[data-action="close-member-modal"]');
        this.memberEmptyState = document.querySelector('[data-empty="members"]');
        this.auditEmptyState = document.querySelector('[data-empty="audit"]');
        this.memberTableWrapper = document.querySelector('[data-table-wrapper="members"]');
        this.auditTableWrapper = document.querySelector('[data-table-wrapper="audit"]');
        this.mediaStatus = document.querySelector('[data-status="media"]');
        this.mediaEmptyState = document.querySelector('[data-empty="media"]');
        this.stats = {
            total: document.querySelector('[data-stat="total"]'),
            active: document.querySelector('[data-stat="active"]'),
            paid: document.querySelector('[data-stat="paid"]'),
            role: document.querySelector('[data-stat="role"]'),
        };
        this.isAdmin = false;
    }

    bindLogin(handler) {
        if (this.loginForm) {
            this.loginForm.addEventListener("submit", handler);
        }
    }

    bindLogout(handler) {
        if (this.logoutButton) {
            this.logoutButton.addEventListener("click", handler);
        }
    }

    bindRefresh(handler) {
        if (this.refreshButton) {
            this.refreshButton.addEventListener("click", handler);
        }
    }

    bindExport(handler) {
        if (this.exportButton) {
            this.exportButton.addEventListener("click", handler);
        }
    }

    bindAuditRefresh(handler) {
        if (this.auditRefreshButton) {
            this.auditRefreshButton.addEventListener("click", handler);
        }
    }

    bindMemberSave(handler) {
        if (this.memberForm) {
            this.memberForm.addEventListener("submit", handler);
        }
    }

    bindMediaSave(handler) {
        if (this.mediaForm) {
            this.mediaForm.addEventListener("submit", handler);
        }
    }

    bindMediaRemove(handler) {
        if (!this.mediaList) return;
        this.mediaList.addEventListener("click", (event) => {
            const button = event.target.closest('[data-action="remove-video"]');
            if (!button) return;
            handler(button.dataset.videoId);
        });
    }

    bindMemberFilters(handler) {
        if (this.searchInput) {
            this.searchInput.addEventListener("input", handler);
        }
        if (this.statusFilter) {
            this.statusFilter.addEventListener("change", handler);
        }
        if (this.paymentFilter) {
            this.paymentFilter.addEventListener("change", handler);
        }
    }

    bindAuditSearch(handler) {
        if (this.auditSearchInput) {
            this.auditSearchInput.addEventListener("input", handler);
        }
    }

    bindMemberFiltersReset(handler) {
        if (this.resetFiltersButton) {
            this.resetFiltersButton.addEventListener("click", handler);
        }
    }

    bindMemberEdit(handler) {
        if (!this.memberTable) return;
        this.memberTable.addEventListener("click", (event) => {
            const button = event.target.closest('[data-action="edit-member"]');
            if (!button) return;
            handler(button.dataset.memberId);
        });
    }

    bindNavigation(handler) {
        if (!this.navLinks) return;
        this.navLinks.forEach((link) => {
            link.addEventListener("click", () => handler(link.dataset.nav));
        });
    }

    bindMemberModalOpen(handler) {
        if (!this.memberModalTriggers) return;
        this.memberModalTriggers.forEach((button) => {
            button.addEventListener("click", handler);
        });
    }

    bindMemberModalClose(handler) {
        if (!this.memberModalCloseButtons) return;
        this.memberModalCloseButtons.forEach((button) => {
            button.addEventListener("click", handler);
        });
    }

    setSectionVisibility({ isConfigured, isAuthenticated, role }) {
        this.isAdmin = role === "admin";
        this.setupSection.classList.toggle("admin-hidden", isConfigured);
        this.loginSection.classList.toggle(
            "admin-hidden",
            !isConfigured || isAuthenticated
        );
        this.pageSections.forEach((section) => {
            section.classList.toggle("admin-hidden", !isAuthenticated);
        });
        this.logoutButton.classList.toggle("admin-hidden", !isAuthenticated);
        if (this.sidebar) {
            this.sidebar.classList.toggle("admin-hidden", !isAuthenticated);
        }
        if (this.topbar) {
            this.topbar.classList.toggle("admin-hidden", !isAuthenticated);
        }
        if (this.exportButton) {
            this.exportButton.classList.toggle("admin-hidden", !this.isAdmin);
        }
        if (this.actionsHeader) {
            this.actionsHeader.classList.toggle("admin-hidden", !this.isAdmin);
        }
        if (this.memberModalTriggers) {
            this.memberModalTriggers.forEach((button) => {
                button.classList.toggle("admin-hidden", !this.isAdmin);
            });
        }
        if (this.auditSection) {
            this.auditSection.classList.toggle("admin-hidden", !this.isAdmin);
        }
        if (this.mediaSection) {
            this.mediaSection.classList.toggle("admin-hidden", !this.isAdmin);
        }
        if (this.navLinks) {
            this.navLinks.forEach((link) => {
                if (link.dataset.nav === "audit" || link.dataset.nav === "media") {
                    link.classList.toggle("admin-hidden", !this.isAdmin);
                }
            });
        }
    }

    setLoginStatus(message, isError = false) {
        this.#setStatusMessage(this.loginStatus, message, isError);
    }

    setMemberStatus(message, isError = false) {
        this.#setStatusMessage(this.memberStatus, message, isError);
    }

    setMediaStatus(message, isError = false) {
        this.#setStatusMessage(this.mediaStatus, message, isError);
    }

    clearLoginStatus() {
        if (this.loginStatus) {
            this.loginStatus.textContent = "";
        }
    }

    clearMemberStatus() {
        if (this.memberStatus) {
            this.memberStatus.textContent = "";
            this.memberStatus.style.color = "";
        }
    }

    setActiveSection(sectionKey) {
        if (!sectionKey) return;
        this.pageSections.forEach((section) => {
            section.classList.toggle(
                "is-active",
                section.dataset.pageSection === sectionKey
            );
        });
        if (this.navLinks) {
            this.navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.dataset.nav === sectionKey);
            });
        }
        if (this.pageTitle) {
            const titleMap = {
                dashboard: "Dashboard",
                members: "Mitglieder",
                media: "Media Galerie",
                audit: "Audit Log",
            };
            this.pageTitle.textContent = titleMap[sectionKey] || "Dashboard";
        }
    }

    openMemberModal({ mode, name } = {}) {
        if (!this.memberModal) return;
        if (this.memberModalTitle) {
            this.memberModalTitle.textContent =
                mode === "edit" ? `Mitglied bearbeiten` : "Mitglied hinzufügen";
        }
        if (mode === "edit" && name && this.memberStatus) {
            this.memberStatus.textContent = `Bearbeite ${name}. Felder aktualisieren und speichern.`;
        }
        this.memberModal.classList.remove("admin-hidden");
    }

    closeMemberModal() {
        if (!this.memberModal) return;
        this.memberModal.classList.add("admin-hidden");
    }

    clearMemberForm() {
        if (!this.memberForm) return;
        this.memberForm.reset();
        if (this.memberIdInput) {
            this.memberIdInput.value = "";
        }
    }

    clearMediaForm() {
        if (!this.mediaForm) return;
        this.mediaForm.reset();
    }

    clearMediaStatus() {
        if (this.mediaStatus) {
            this.mediaStatus.textContent = "";
            this.mediaStatus.style.color = "";
        }
    }

    getMediaFormData(event) {
        const formData = new FormData(event.target);
        return {
            url: formData.get("url"),
            title: formData.get("title"),
        };
    }

    getMemberFilters() {
        return {
            query: this.searchInput ? this.searchInput.value.trim() : "",
            status: this.statusFilter ? this.statusFilter.value : "all",
            payment: this.paymentFilter ? this.paymentFilter.value : "all",
        };
    }

    resetMemberFilters() {
        if (this.searchInput) {
            this.searchInput.value = "";
        }
        if (this.statusFilter) {
            this.statusFilter.value = "all";
        }
        if (this.paymentFilter) {
            this.paymentFilter.value = "all";
        }
    }

    filterMembers(members) {
        const { query, status, payment } = this.getMemberFilters();
        const normalizedQuery = query.toLowerCase();
        const normalize = (value) => (value || "").toString().toLowerCase();

        return members.filter((member) => {
            const matchesQuery =
                !normalizedQuery ||
                [member.full_name, member.status, member.plan, member.payment_status].some(
                    (value) => normalize(value).includes(normalizedQuery)
                );
            const matchesStatus =
                status === "all" || normalize(member.status) === normalize(status);
            const matchesPayment =
                payment === "all" || normalize(member.payment_status) === normalize(payment);
            return matchesQuery && matchesStatus && matchesPayment;
        });
    }

    getAuditQuery() {
        return this.auditSearchInput ? this.auditSearchInput.value.trim() : "";
    }

    filterAuditLogs(logs) {
        const query = this.getAuditQuery().toLowerCase();
        const normalize = (value) => (value || "").toString().toLowerCase();
        if (!query) return logs;

        return logs.filter((entry) => {
            const searchable = [
                entry.created_at,
                entry.actor_role,
                entry.action,
                entry.entity,
                this.#formatMetadata(entry.metadata),
            ]
                .map((value) => normalize(value))
                .join(" ");
            return searchable.includes(query);
        });
    }

    updateResultsCount(filteredCount, totalCount) {
        if (!this.resultsNote) return;
        if (totalCount === 0) {
            this.resultsNote.textContent = "Keine Mitglieder vorhanden.";
            return;
        }
        if (filteredCount === totalCount) {
            this.resultsNote.textContent = `Zeige ${totalCount} Mitglieder.`;
            return;
        }
        this.resultsNote.textContent = `Zeige ${filteredCount} von ${totalCount} Mitgliedern.`;
    }

    updateAuditResultsCount(filteredCount, totalCount) {
        if (!this.auditResultsNote) return;
        if (totalCount === 0) {
            this.auditResultsNote.textContent = "Keine Prüfaktivitäten vorhanden.";
            return;
        }
        if (filteredCount === totalCount) {
            this.auditResultsNote.textContent = `Zeige ${totalCount} Einträge.`;
            return;
        }
        this.auditResultsNote.textContent = `Zeige ${filteredCount} von ${totalCount} Einträgen.`;
    }

    escapeHtml(str) {
        if (!str && str !== 0) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    renderMembers(members, totalCount = members.length) {
        if (!members.length && totalCount === 0) {
            const colSpan = this.isAdmin ? 6 : 5;
            this.memberTable.innerHTML = `<tr><td colspan="${colSpan}">Keine Mitglieder gefunden.</td></tr>`;
            if (this.memberEmptyState) {
                this.memberEmptyState.classList.remove("admin-hidden");
            }
            if (this.memberTableWrapper) {
                this.memberTableWrapper.classList.add("admin-hidden");
            }
            return;
        }

        if (this.memberEmptyState) {
            this.memberEmptyState.classList.add("admin-hidden");
        }
        if (this.memberTableWrapper) {
            this.memberTableWrapper.classList.remove("admin-hidden");
        }

        if (!members.length) {
            const colSpan = this.isAdmin ? 6 : 5;
            this.memberTable.innerHTML = `<tr><td colspan="${colSpan}">Keine Mitglieder gefunden.</td></tr>`;
            return;
        }

        this.memberTable.innerHTML = members
            .map((member) => {
                const actionCell = this.isAdmin
                    ? `<td>
            <button class="nav-button admin-action" type="button" data-action="edit-member" data-member-id="${this.escapeHtml(member.id)}">
              Bearbeiten
            </button>
          </td>`
                    : "";
                return `
        <tr>
          <td>${this.escapeHtml(member.full_name)}</td>
          <td>${this.escapeHtml(member.status)}</td>
          <td>${this.escapeHtml(member.plan)}</td>
          <td>${this.escapeHtml(member.payment_status)}</td>
          <td>${this.#formatDate(member.updated_at)}</td>
          ${actionCell}
        </tr>
      `;
            })
            .join("");

    }

    renderMembersError() {
        const colSpan = this.isAdmin ? 6 : 5;
        this.memberTable.innerHTML =
            `<tr><td colspan="${colSpan}">Mitglieder konnten nicht geladen werden. Zugriffsregeln prüfen.</td></tr>`;
        if (this.memberEmptyState) {
            this.memberEmptyState.classList.add("admin-hidden");
        }
        if (this.memberTableWrapper) {
            this.memberTableWrapper.classList.remove("admin-hidden");
        }
    }

    renderMediaList(videos) {
        if (!this.mediaList) return;

        if (!videos.length) {
            if (this.mediaEmptyState) {
                this.mediaEmptyState.classList.remove("admin-hidden");
            }
            this.mediaList.innerHTML = "";
            return;
        }

        if (this.mediaEmptyState) {
            this.mediaEmptyState.classList.add("admin-hidden");
        }

        this.mediaList.innerHTML = videos
            .map((video) => {
                const title = video.title || "Fightclub Highlight";
                return `
        <div class="admin-media-item">
          <div class="admin-media-meta">
            <h4>${this.escapeHtml(title)}</h4>
            <p>${this.escapeHtml(video.video_url || video.video_id || "")}</p>
          </div>
          <button class="nav-button admin-action" type="button" data-action="remove-video" data-video-id="${this.escapeHtml(video.id)}">
            Entfernen
          </button>
        </div>
      `;
            })
            .join("");
    }

    renderMediaError() {
        if (this.mediaList) {
            this.mediaList.innerHTML =
                "<p>Videos konnten nicht geladen werden. Zugriffsregeln prüfen.</p>";
        }
        if (this.mediaEmptyState) {
            this.mediaEmptyState.classList.add("admin-hidden");
        }
    }

    updateStats(members) {
        const total = members.length;
        const active = members.filter((member) => member.status === "Active").length;
        const paid = members.filter(
            (member) => member.payment_status === "Up to Date"
        ).length;

        this.stats.total.textContent = total;
        this.stats.active.textContent = active;
        this.stats.paid.textContent = paid;
    }

    setRole(role) {
        if (this.stats.role) {
            this.stats.role.textContent = role ? role.toUpperCase() : "—";
        }
    }

    renderAuditLogs(logs, totalCount = logs.length) {
        if (!this.auditTable) return;
        if (!logs.length && totalCount === 0) {
            this.auditTable.innerHTML = '<tr><td colspan="5">Noch keine Prüfaktivitäten.</td></tr>';
            if (this.auditEmptyState) {
                this.auditEmptyState.classList.remove("admin-hidden");
            }
            if (this.auditTableWrapper) {
                this.auditTableWrapper.classList.add("admin-hidden");
            }
            return;
        }

        if (this.auditEmptyState) {
            this.auditEmptyState.classList.add("admin-hidden");
        }
        if (this.auditTableWrapper) {
            this.auditTableWrapper.classList.remove("admin-hidden");
        }

        if (!logs.length) {
            this.auditTable.innerHTML = '<tr><td colspan="5">Keine Einträge gefunden.</td></tr>';
            return;
        }

        this.auditTable.innerHTML = logs
            .map((entry) => {
                return `
        <tr>
          <td>${this.#formatDateTime(entry.created_at)}</td>
          <td>${this.escapeHtml(entry.actor_role)}</td>
          <td>${this.escapeHtml(entry.action)}</td>
          <td>${this.escapeHtml(entry.entity)}</td>
          <td>${this.escapeHtml(this.#formatMetadata(entry.metadata))}</td>
        </tr>
      `;
            })
            .join("");
    }

    renderAuditError() {
        if (!this.auditTable) return;
        this.auditTable.innerHTML =
            '<tr><td colspan="5">Prüfprotokolle konnten nicht geladen werden. Zugriffsregeln prüfen.</td></tr>';
        if (this.auditEmptyState) {
            this.auditEmptyState.classList.add("admin-hidden");
        }
        if (this.auditTableWrapper) {
            this.auditTableWrapper.classList.remove("admin-hidden");
        }
    }

    getLoginFormData(event) {
        const formData = new FormData(event.target);
        return {
            email: formData.get("email"),
            password: formData.get("password"),
        };
    }

    getMemberFormData(event) {
        const formData = new FormData(event.target);
        return {
            id: formData.get("id"),
            full_name: formData.get("full_name"),
            status: formData.get("status"),
            plan: formData.get("plan"),
            payment_status: formData.get("payment_status"),
            updated_at: new Date().toISOString(),
        };
    }

    exportMembersToXlsx(members) {
        if (!members.length) return;
        if (!window.ExcelJS) {
            this.setMemberStatus("Excel-Export nicht verfügbar. Bitte aktualisieren und erneut versuchen.", true);
            return;
        }

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Little Champs Boxing Club";
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet("Mitglieder", {
            views: [{ state: "frozen", ySplit: 1 }],
        });

        worksheet.columns = [
            { header: "Vollständiger Name", key: "full_name", width: 28 },
            { header: "Status", key: "status", width: 14 },
            { header: "Tarif", key: "plan", width: 22 },
            { header: "Zahlungsstatus", key: "payment_status", width: 18 },
            { header: "Zuletzt aktualisiert", key: "updated_at", width: 20 },
        ];

        const tableRows = members.map((member) => [
            member.full_name,
            member.status,
            member.plan,
            member.payment_status,
            member.updated_at ? new Date(member.updated_at) : null,
        ]);

        worksheet.getColumn("full_name").alignment = { horizontal: "left", wrapText: false };
        worksheet.getColumn("status").alignment = { horizontal: "center", wrapText: false };
        worksheet.getColumn("plan").alignment = { horizontal: "left", wrapText: false };
        worksheet.getColumn("payment_status").alignment = { horizontal: "center", wrapText: false };
        worksheet.getColumn("updated_at").alignment = { horizontal: "left", wrapText: false };

        worksheet.getColumn("updated_at").numFmt = "yyyy-mm-dd hh:mm";

        const tableStartRow = 1;
        const tableEndColumn = worksheet.columnCount;

        worksheet.addTable({
            name: "MembersTable",
            ref: `A${tableStartRow}`,
            headerRow: true,
            totalsRow: false,
            style: {
                theme: "TableStyleLight9",
                showRowStripes: false,
            },
            columns: worksheet.columns.map((column) => ({ name: column.header })),
            rows: tableRows,
        });

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEFF6FF" },
        };

        const tableEndRow = worksheet.rowCount;

        for (let rowIndex = tableStartRow; rowIndex <= tableEndRow; rowIndex += 1) {
            const row = worksheet.getRow(rowIndex);
            for (let colIndex = 1; colIndex <= tableEndColumn; colIndex += 1) {
                const cell = row.getCell(colIndex);
                cell.border = {
                    top: { style: "thin", color: { argb: "FFD1D5DB" } },
                    left: { style: "thin", color: { argb: "FFD1D5DB" } },
                    bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
                    right: { style: "thin", color: { argb: "FFD1D5DB" } },
                };
            }
        }

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "mitglieder-export.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        });
    }

    resetMemberForm(event) {
        event.target.reset();
        if (this.memberIdInput) {
            this.memberIdInput.value = "";
        }
    }

    fillMemberForm(member) {
        if (!member || !this.memberForm) return;
        if (this.memberIdInput) {
            this.memberIdInput.value = member.id;
        }
        this.memberForm.querySelector("#member-name").value = member.full_name || "";
        this.memberForm.querySelector("#member-status").value = member.status || "";
        this.memberForm.querySelector("#member-plan").value = member.plan || "";
        this.memberForm.querySelector("#member-payment").value =
            member.payment_status || "";
    }

    getSelectedMemberId() {
        return this.memberIdInput ? this.memberIdInput.value : "";
    }

    #formatDate(value) {
        if (!value) return "—";
        const date = new Date(value);
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    #formatDateTime(value) {
        if (!value) return "—";
        const date = new Date(value);
        return date.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    #formatMetadata(metadata) {
        if (!metadata || Object.keys(metadata).length === 0) return "—";
        return Object.entries(metadata)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
    }

    #setStatusMessage(element, message, isError) {
        if (!element) return;
        element.textContent = message;
        element.style.color = isError ? "#dc2626" : "#065f46";
    }
}
