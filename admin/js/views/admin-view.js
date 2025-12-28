//admin/js/views/admin-view.js
export class AdminView {
    constructor() {
        this.setupSection = document.querySelector('[data-section="setup"]');
        this.loginSection = document.querySelector('[data-section="login"]');
        this.dashboardSection = document.querySelector('[data-section="dashboard"]');
        this.membersSection = document.querySelector('[data-section="members"]');
        this.addMemberSection = document.querySelector('[data-section="add-member"]');
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
        this.memberIdInput = document.querySelector("#member-id");
        this.actionsHeader = document.querySelector('[data-column="actions"]');
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

    bindMemberEdit(handler) {
        if (!this.memberTable) return;
        this.memberTable.addEventListener("click", (event) => {
            const button = event.target.closest('[data-action="edit-member"]');
            if (!button) return;
            handler(button.dataset.memberId);
        });
    }

    setSectionVisibility({ isConfigured, isAuthenticated, role }) {
        this.isAdmin = role === "admin";
        this.setupSection.classList.toggle("admin-hidden", isConfigured);
        this.loginSection.classList.toggle(
            "admin-hidden",
            !isConfigured || isAuthenticated
        );
        this.dashboardSection.classList.toggle("admin-hidden", !isAuthenticated);
        this.membersSection.classList.toggle("admin-hidden", !isAuthenticated);
        this.addMemberSection.classList.toggle(
            "admin-hidden",
            !isAuthenticated || !this.isAdmin
        );
        this.logoutButton.classList.toggle("admin-hidden", !isAuthenticated);
        if (this.exportButton) {
            this.exportButton.classList.toggle("admin-hidden", !this.isAdmin);
        }
        if (this.actionsHeader) {
            this.actionsHeader.classList.toggle("admin-hidden", !this.isAdmin);
        }
        if (this.auditTable) {
            this.auditTable
                .closest('[data-section="audit"]')
                .classList.toggle("admin-hidden", !isAuthenticated || !this.isAdmin);
        }
    }

    setLoginStatus(message, isError = false) {
        this.#setStatusMessage(this.loginStatus, message, isError);
    }

    setMemberStatus(message, isError = false) {
        this.#setStatusMessage(this.memberStatus, message, isError);
    }

    clearLoginStatus() {
        if (this.loginStatus) {
            this.loginStatus.textContent = "";
        }
    }

    renderMembers(members) {
        if (!members.length) {
            const colSpan = this.isAdmin ? 6 : 5;
            this.memberTable.innerHTML = `<tr><td colspan="${colSpan}">No members found.</td></tr>`;
            this.updateStats([]);
            return;
        }

        this.memberTable.innerHTML = members
            .map((member) => {
                const actionCell = this.isAdmin
                    ? `<td>
            <button class="nav-button admin-action" type="button" data-action="edit-member" data-member-id="${member.id}">
              Edit
            </button>
          </td>`
                    : "";
                return `
        <tr>
          <td>${member.full_name}</td>
          <td>${member.status}</td>
          <td>${member.plan}</td>
          <td>${member.payment_status}</td>
          <td>${this.#formatDate(member.updated_at)}</td>
          ${actionCell}
        </tr>
      `;
            })
            .join("");

        this.updateStats(members);
    }

    renderMembersError() {
        const colSpan = this.isAdmin ? 6 : 5;
        this.memberTable.innerHTML =
            `<tr><td colspan="${colSpan}">Unable to load members. Check access rules.</td></tr>`;
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

    renderAuditLogs(logs) {
        if (!this.auditTable) return;
        if (!logs.length) {
            this.auditTable.innerHTML = '<tr><td colspan="5">No audit activity yet.</td></tr>';
            return;
        }

        this.auditTable.innerHTML = logs
            .map((entry) => {
                return `
        <tr>
          <td>${this.#formatDateTime(entry.created_at)}</td>
          <td>${entry.actor_role}</td>
          <td>${entry.action}</td>
          <td>${entry.entity}</td>
          <td>${this.#formatMetadata(entry.metadata)}</td>
        </tr>
      `;
            })
            .join("");
    }

    renderAuditError() {
        if (!this.auditTable) return;
        this.auditTable.innerHTML =
            '<tr><td colspan="5">Unable to load audit logs. Check access rules.</td></tr>';
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

    exportMembersToCsv(members) {
        if (!members.length) return;
        const headers = ["Full Name", "Status", "Plan", "Payment Status", "Updated At"];
        const rows = members.map((member) => [
            member.full_name,
            member.status,
            member.plan,
            member.payment_status,
            this.#formatDateTime(member.updated_at),
        ]);
        const csvContent = [headers, ...rows]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value ?? "")
                            .replace(/"/g, '""')
                            .trim()}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "members-export.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
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
