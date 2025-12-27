export class AdminView {
    constructor() {
        this.setupSection = document.querySelector('[data-section="setup"]');
        this.loginSection = document.querySelector('[data-section="login"]');
        this.dashboardSection = document.querySelector('[data-section="dashboard"]');
        this.membersSection = document.querySelector('[data-section="members"]');
        this.addMemberSection = document.querySelector('[data-section="add-member"]');
        this.logoutButton = document.querySelector('[data-action="logout"]');
        this.refreshButton = document.querySelector('[data-action="refresh"]');
        this.loginForm = document.querySelector('[data-form="login"]');
        this.memberForm = document.querySelector('[data-form="member"]');
        this.loginStatus = document.querySelector('[data-status="login"]');
        this.memberStatus = document.querySelector('[data-status="member"]');
        this.memberTable = document.querySelector('[data-table="members"]');
        this.memberIdInput = document.querySelector("#member-id");
        this.stats = {
            total: document.querySelector('[data-stat="total"]'),
            active: document.querySelector('[data-stat="active"]'),
            paid: document.querySelector('[data-stat="paid"]'),
        };
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

    setSectionVisibility({ isConfigured, isAuthenticated }) {
        this.setupSection.classList.toggle("admin-hidden", isConfigured);
        this.loginSection.classList.toggle(
            "admin-hidden",
            !isConfigured || isAuthenticated
        );
        this.dashboardSection.classList.toggle("admin-hidden", !isAuthenticated);
        this.membersSection.classList.toggle("admin-hidden", !isAuthenticated);
        this.addMemberSection.classList.toggle("admin-hidden", !isAuthenticated);
        this.logoutButton.classList.toggle("admin-hidden", !isAuthenticated);
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
            this.memberTable.innerHTML = '<tr><td colspan="6">No members found.</td></tr>';
            this.updateStats([]);
            return;
        }

        this.memberTable.innerHTML = members
            .map((member) => {
                return `
        <tr>
          <td>${member.full_name}</td>
          <td>${member.status}</td>
          <td>${member.plan}</td>
          <td>${member.payment_status}</td>
          <td>${this.#formatDate(member.updated_at)}</td>
          <td>
            <button class="nav-button admin-action" type="button" data-action="edit-member" data-member-id="${member.id}">
              Edit
            </button>
          </td>
        </tr>
      `;
            })
            .join("");

        this.updateStats(members);
    }

    renderMembersError() {
        this.memberTable.innerHTML =
            '<tr><td colspan="6">Unable to load members. Check access rules.</td></tr>';
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

    #setStatusMessage(element, message, isError) {
        if (!element) return;
        element.textContent = message;
        element.style.color = isError ? "#dc2626" : "#065f46";
    }
}