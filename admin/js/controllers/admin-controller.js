//admin/js/controllers/admin-controller.js

import { AdminModel } from "../models/admin-model.js";
import { AdminView } from "../views/admin-view.js";
import { supabase } from "../supabaseClient.js";

export class AdminController {
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
        const { session } = await this.model.getSession();
        const isAuthenticated = Boolean(session);

        this.view.setSectionVisibility({
            isConfigured: true,
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
            isConfigured: true,
            isAuthenticated: false,
        });
        this.view.clearLoginStatus();
    }

    async handleMemberSave(event) {
        event.preventDefault();

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