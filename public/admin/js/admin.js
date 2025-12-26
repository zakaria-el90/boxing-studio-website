const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

const setupSection = document.querySelector('[data-section="setup"]');
const loginSection = document.querySelector('[data-section="login"]');
const dashboardSection = document.querySelector('[data-section="dashboard"]');
const membersSection = document.querySelector('[data-section="members"]');
const addMemberSection = document.querySelector('[data-section="add-member"]');
const logoutButton = document.querySelector('[data-action="logout"]');
const refreshButton = document.querySelector('[data-action="refresh"]');
const loginForm = document.querySelector('[data-form="login"]');
const memberForm = document.querySelector('[data-form="member"]');
const loginStatus = document.querySelector('[data-status="login"]');
const memberStatus = document.querySelector('[data-status="member"]');
const memberTable = document.querySelector('[data-table="members"]');

const stats = {
    total: document.querySelector('[data-stat="total"]'),
    active: document.querySelector('[data-stat="active"]'),
    paid: document.querySelector('[data-stat="paid"]'),
};

const isConfigured =
    !SUPABASE_URL.includes("YOUR-PROJECT") &&
    !SUPABASE_ANON_KEY.includes("YOUR-ANON-KEY");

const supabase = isConfigured
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const setSectionVisibility = (isAuthenticated) => {
    setupSection.classList.toggle("admin-hidden", isConfigured);
    loginSection.classList.toggle("admin-hidden", !isConfigured || isAuthenticated);
    dashboardSection.classList.toggle("admin-hidden", !isAuthenticated);
    membersSection.classList.toggle("admin-hidden", !isAuthenticated);
    addMemberSection.classList.toggle("admin-hidden", !isAuthenticated);
    logoutButton.classList.toggle("admin-hidden", !isAuthenticated);
};

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const updateStats = (members) => {
    const total = members.length;
    const active = members.filter((member) => member.status === "Active").length;
    const paid = members.filter((member) => member.payment_status === "Up to Date").length;

    stats.total.textContent = total;
    stats.active.textContent = active;
    stats.paid.textContent = paid;
};

const renderMembers = (members) => {
    if (!members.length) {
        memberTable.innerHTML = '<tr><td colspan="5">No members found.</td></tr>';
        updateStats([]);
        return;
    }

    memberTable.innerHTML = members
        .map((member) => {
            return `
        <tr>
          <td>${member.full_name}</td>
          <td>${member.status}</td>
          <td>${member.plan}</td>
          <td>${member.payment_status}</td>
          <td>${formatDate(member.updated_at)}</td>
        </tr>
      `;
        })
        .join("");

    updateStats(members);
};

const loadMembers = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
        .from("members")
        .select("id, full_name, status, plan, payment_status, updated_at")
        .order("updated_at", { ascending: false });

    if (error) {
        memberTable.innerHTML =
            '<tr><td colspan="5">Unable to load members. Check access rules.</td></tr>';
        return;
    }

    renderMembers(data || []);
};

const setStatusMessage = (element, message, isError = false) => {
    element.textContent = message;
    element.style.color = isError ? "#dc2626" : "#065f46";
};

const handleLogin = async (event) => {
    event.preventDefault();
    if (!supabase) return;

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    setStatusMessage(loginStatus, "Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        setStatusMessage(loginStatus, error.message, true);
        return;
    }

    setStatusMessage(loginStatus, "Signed in successfully.");
    await refreshSession();
};

const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSectionVisibility(false);
    loginStatus.textContent = "";
};

const handleMemberSave = async (event) => {
    event.preventDefault();
    if (!supabase) return;

    const formData = new FormData(event.target);
    const payload = {
        full_name: formData.get("full_name"),
        status: formData.get("status"),
        plan: formData.get("plan"),
        payment_status: formData.get("payment_status"),
        updated_at: new Date().toISOString(),
    };

    setStatusMessage(memberStatus, "Saving member...");

    const { error } = await supabase.from("members").insert(payload);

    if (error) {
        setStatusMessage(memberStatus, error.message, true);
        return;
    }

    setStatusMessage(memberStatus, "Member saved.");
    event.target.reset();
    await loadMembers();
};

const refreshSession = async () => {
    if (!supabase) {
        setSectionVisibility(false);
        return;
    }

    const { data } = await supabase.auth.getSession();
    const isAuthenticated = Boolean(data.session);
    setSectionVisibility(isAuthenticated);

    if (isAuthenticated) {
        await loadMembers();
    }
};

if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
}

if (memberForm) {
    memberForm.addEventListener("submit", handleMemberSave);
}

if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
}

if (refreshButton) {
    refreshButton.addEventListener("click", loadMembers);
}

refreshSession();
