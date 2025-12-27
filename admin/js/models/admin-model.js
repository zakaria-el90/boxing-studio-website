export class AdminModel {
  constructor(config) {
    this.config = config;
    this.supabase = this.#createClient();
  }

  #createClient() {
    if (!this.config.isConfigured) {
      return null;
    }
    return window.supabase.createClient(
      this.config.supabaseUrl,
      this.config.supabaseAnonKey
    );
  }

  async getSession() {
    if (!this.supabase) return { session: null };
    const { data } = await this.supabase.auth.getSession();
    return data;
  }

  async signIn(email, password) {
    if (!this.supabase) return { error: new Error("Supabase not configured.") };
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    if (!this.supabase) return { error: null };
    return this.supabase.auth.signOut();
  }

  async fetchMembers() {
    if (!this.supabase) return { data: [], error: null };
    return this.supabase
      .from("members")
      .select("id, full_name, status, plan, payment_status, updated_at")
      .order("updated_at", { ascending: false });
  }

  async addMember(payload) {
    if (!this.supabase) return { error: new Error("Supabase not configured.") };
    return this.supabase.from("members").insert(payload);
  }
}
