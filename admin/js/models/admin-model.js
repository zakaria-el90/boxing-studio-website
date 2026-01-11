//admin/js/models/admin-model.js


export class AdminModel {
    constructor(supabase) {
        this.supabase = supabase;
    }

    async getSession() {
        const { data } = await this.supabase.auth.getSession();
        return data; // { session, user }
    }

    async signIn(email, password) {
        return this.supabase.auth.signInWithPassword({ email, password });
    }

    async signOut() {
        return this.supabase.auth.signOut();
    }

    async fetchMembers() {
        return this.supabase
            .from("members")
            .select("id, full_name, status, plan, payment_status, updated_at")
            .order("updated_at", { ascending: false });
    }

    async fetchProfile() {
        const { data: userData, error: userError } = await this.supabase.auth.getUser();
        if (userError) {
            return { data: null, error: userError };
        }
        const userId = userData?.user?.id;
        if (!userId) {
            return { data: null, error: new Error("User not found.") };
        }
        return this.supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();
    }

    async fetchAuditLogs() {
        return this.supabase
            .from("audit_logs")
            .select("id, actor_role, action, entity, metadata, created_at")
            .order("created_at", { ascending: false })
            .limit(50);
    }

    async fetchVideos() {
        return this.supabase
            .from("media_videos")
            .select("id, title, video_url, video_id, created_at")
            .order("created_at", { ascending: false });
    }

    async logAudit({ action, entity, metadata }) {
        const { data: userData, error: userError } = await this.supabase.auth.getUser();
        if (userError) return { error: userError };
        const userId = userData?.user?.id;
        if (!userId) return { error: new Error("User not found.") };

        const { data: profileData } = await this.fetchProfile();
        const role = profileData?.role || "staff";

        return this.supabase.from("audit_logs").insert({
            actor_id: userId,
            actor_role: role,
            action,
            entity,
            metadata: metadata || {},
        });
    }

    async addMember(payload) {
        return this.supabase.from("members").insert(payload);
    }

    async updateMember(id, payload) {
        return this.supabase.from("members").update(payload).eq("id", id);
    }

    async addVideo(payload) {
        return this.supabase.from("media_videos").insert(payload);
    }

    async deleteVideo(id) {
        return this.supabase.from("media_videos").delete().eq("id", id);
    }
}


