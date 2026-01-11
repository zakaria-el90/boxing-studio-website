//admin/js/supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js"

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);st SUPABASE_KEY = "sb_publishable_pTlhDqZxq5CblFjjBRqpcQ_ua6clP7c";