import { AdminModel } from "../models/admin-model.js";
import { AdminView } from "../views/admin-view.js";

const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

export class AdminController {
  constructor() {
    this.config = {
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY,
      isConfigured:
        !SUPABASE_URL.includes("YOUR-PROJECT") &&
        !SUPABASE_ANON_KEY.includes("YOUR-ANON-KEY"),
    };

    this.model = new AdminModel(this.config);
    this.view = new AdminView();
  }

  init() {
    this.view.bindLogin(this.handleLogin.bind(this));
    this.view.bindLogout(this.handleLogout.bind(this));
    this.view.bindRefresh(this.handleRefresh.bind(this));
    this.view.bindMemberSave(this.handleMemberSave.bind(this));

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
    this.view.renderMembers(data || []);
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

    const { error } = await this.model.addMember(payload);
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
}
