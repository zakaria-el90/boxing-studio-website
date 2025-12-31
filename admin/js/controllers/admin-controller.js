//admin/js/controllers/admin-controller.js

import { AdminModel } from "../models/admin-model.js";
import { AdminView } from "../views/admin-view.js";
import { supabase } from "../supabaseClient.js";

export class AdminController {
    constructor() {
        this.model = new AdminModel(supabase);
        this.view = new AdminView();
        this.members = [];
        this.auditLogs = [];
    }

    init() {
        this.view.bindLogin(this.handleLogin.bind(this));
        this.view.bindLogout(this.handleLogout.bind(this));
        this.view.bindRefresh(this.handleRefresh.bind(this));
        this.view.bindExport(this.handleExport.bind(this));
        this.view.bindAuditRefresh(this.handleAuditRefresh.bind(this));
        this.view.bindMemberSave(this.handleMemberSave.bind(this));
        this.view.bindMemberEdit(this.handleMemberEdit.bind(this));
        this.view.bindMemberFilters(this.handleMemberFilterChange.bind(this));
        this.view.bindMemberFiltersReset(this.handleMemberFilterReset.bind(this));
        this.view.bindAuditSearch(this.handleAuditSearchChange.bind(this));
        this.view.bindNavigation(this.handleNavigation.bind(this));
        this.view.bindMemberModalOpen(this.handleMemberModalOpen.bind(this));
        this.view.bindMemberModalClose(this.handleMemberModalClose.bind(this));

        this.refreshSession();
    }

    async refreshSession() {
        const { session } = await this.model.getSession();
        const isAuthenticated = Boolean(session);
        let role = "";

        if (isAuthenticated) {
            role = await this.loadProfile();
        }

        this.view.setSectionVisibility({
            isConfigured: true,
            isAuthenticated,
            role,
        });

        if (role !== "admin") {
            this.view.setActiveSection("dashboard");
        }

        if (isAuthenticated) {
            await this.loadMembers();
            if (role === "admin") {
                await this.loadAuditLogs();
            }
            this.view.setActiveSection("dashboard");
        }
    }

    async loadMembers() {
        const { data, error } = await this.model.fetchMembers();
        if (error) {
            this.view.renderMembersError();
            return;
        }
        this.members = data || [];
        this.applyMemberFilters();
    }

    async loadProfile() {
        const { data, error } = await this.model.fetchProfile();
        if (error) {
            this.view.setRole("");
            return "";
        }
        const role = data?.role || "";
        this.view.setRole(role);
        return role;
    }

    async loadAuditLogs() {
        const { data, error } = await this.model.fetchAuditLogs();
        if (error) {
            this.view.renderAuditError();
            return;
        }
        this.auditLogs = data || [];
        this.applyAuditFilters();
    }

    async handleLogin(event) {
        event.preventDefault();

        const { email, password } = this.view.getLoginFormData(event);
        this.view.setLoginStatus("Anmeldung läuft...");

        const { error } = await this.model.signIn(email, password);
        if (error) {
            this.view.setLoginStatus(error.message, true);
            return;
        }

        this.view.setLoginStatus("Erfolgreich angemeldet.");
        await this.refreshSession();
    }

    async handleLogout() {
        await this.model.signOut();
        this.view.closeMemberModal();
        this.view.setSectionVisibility({
            isConfigured: true,
            isAuthenticated: false,
        });
        this.view.clearLoginStatus();
    }

    async handleMemberSave(event) {
        event.preventDefault();

        const payload = this.view.getMemberFormData(event);
        this.view.setMemberStatus("Mitglied wird gespeichert...");

        const { id, ...memberPayload } = payload;
        const { error } = id
            ? await this.model.updateMember(id, memberPayload)
            : await this.model.addMember(memberPayload);

        if (error) {
            this.view.setMemberStatus(error.message, true);
            return;
        }

        await this.model.logAudit({
            action: id ? "member_updated" : "member_created",
            entity: "members",
            metadata: {
                member_name: memberPayload.full_name,
                member_id: id || null,
            },
        });

        this.view.setMemberStatus("Mitglied gespeichert.");
        this.view.resetMemberForm(event);
        this.view.closeMemberModal();
        await this.loadMembers();
        await this.loadAuditLogs();
    }

    async handleRefresh() {
        await this.loadMembers();
    }

    async handleAuditRefresh() {
        await this.loadAuditLogs();
    }

    handleExport() {
        this.view.exportMembersToXlsx(this.members || []);
    }

    handleMemberEdit(memberId) {
        const member = this.members?.find((entry) => entry.id === memberId);
        if (!member) return;
        this.view.openMemberModal({ mode: "edit", name: member.full_name });
        this.view.fillMemberForm(member);
        this.view.setMemberStatus(`Bearbeite ${member.full_name}. Felder aktualisieren und speichern.`);
    }

    handleMemberFilterChange() {
        this.applyMemberFilters();
    }

    handleMemberFilterReset() {
        this.view.resetMemberFilters();
        this.applyMemberFilters();
    }

    handleAuditSearchChange() {
        this.applyAuditFilters();
    }

    handleNavigation(section) {
        this.view.setActiveSection(section);
    }

    handleMemberModalOpen() {
        this.view.openMemberModal({ mode: "create" });
        this.view.clearMemberForm();
        this.view.clearMemberStatus();
    }

    handleMemberModalClose() {
        this.view.closeMemberModal();
        this.view.clearMemberStatus();
    }

    applyMemberFilters() {
        const filteredMembers = this.view.filterMembers(this.members || []);
        this.view.renderMembers(filteredMembers, this.members.length);
        this.view.updateStats(this.members || []);
        this.view.updateResultsCount(filteredMembers.length, this.members.length);
    }

    applyAuditFilters() {
        const filteredLogs = this.view.filterAuditLogs(this.auditLogs || []);
        this.view.renderAuditLogs(filteredLogs, this.auditLogs.length);
        this.view.updateAuditResultsCount(filteredLogs.length, this.auditLogs.length);
    }
}


/*export class AdminController {
    constructor() {
        this.model = new AdminModel(supabase);
        this.view = new AdminView();
        this.members = [];
    }

    init() {
        this.view.bindLogin(this.handleLogin.bind(this));
        this.view.bindLogout(this.handleLogout.bind(this));
        this.view.bindRefresh(this.handleRefresh.bind(this));
        this.view.bindMemberSave(this.handleMemberSave.bind(this));
        this.view.bindMemberEdit(this.handleMemberEdit.bind(this));

        this.refreshSession();
    }

    async refreshSession() {
        if (!this.config.isConfigured) {
            this.view.setSectionVisibility({
                isConfigured: this.config.isConfigured,
                isAuthenticated: false,
            });
            return;
        }

        const { session } = await this.model.getSession();
        const isAuthenticated = Boolean(session);

        this.view.setSectionVisibility({
            isConfigured: this.config.isConfigured,
            isAuthenticated,
        });

        if (isAuthenticated) {
            await this.loadMembers();
        }
    }

    async loadMembers() {
        const { data, error } = await this.model.fetchMembers();
        if (error) {
            this.view.renderMembersError();
            return;
        }
        this.members = data || [];
        this.view.renderMembers(this.members);
    }

    async handleLogin(event) {
        event.preventDefault();

        if (!this.config.isConfigured) {
            this.view.setLoginStatus("Supabase is not configured.", true);
            return;
        }

        const { email, password } = this.view.getLoginFormData(event);
        this.view.setLoginStatus("Signing in...");

        const { error } = await this.model.signIn(email, password);
        if (error) {
            this.view.setLoginStatus(error.message, true);
            return;
        }

        this.view.setLoginStatus("Signed in successfully.");
        await this.refreshSession();
    }

    async handleLogout() {
        await this.model.signOut();
        this.view.setSectionVisibility({
            isConfigured: this.config.isConfigured,
            isAuthenticated: false,
        });
        this.view.clearLoginStatus();
    }

    async handleMemberSave(event) {
        event.preventDefault();

        if (!this.config.isConfigured) {
            this.view.setMemberStatus("Supabase is not configured.", true);
            return;
        }

        const payload = this.view.getMemberFormData(event);
        this.view.setMemberStatus("Saving member...");

        const { id, ...memberPayload } = payload;
        const { error } = id
            ? await this.model.updateMember(id, memberPayload)
            : await this.model.addMember(memberPayload);
        if (error) {
            this.view.setMemberStatus(error.message, true);
            return;
        }

        this.view.setMemberStatus("Member saved.");
        this.view.resetMemberForm(event);
        await this.loadMembers();
    }

    async handleRefresh() {
        await this.loadMembers();
    }

    handleMemberEdit(memberId) {
        const member = this.members?.find((entry) => entry.id === memberId);
        if (!member) return;
        this.view.fillMemberForm(member);
        this.view.setMemberStatus(`Editing ${member.full_name}. Update fields and save.`);
    }
}*/
