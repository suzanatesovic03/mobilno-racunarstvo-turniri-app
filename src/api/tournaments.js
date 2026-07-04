const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const headers = (token) => ({
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token}`,
});

export const tournamentsApi = {
  getAll: async (token) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tournaments?select=*`,
      {
        headers: headers(token),
      },
    );
    return response.json();
  },

  getById: async (token, id) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tournaments?id=eq.${id}&select=*`,
      {
        headers: headers(token),
      },
    );
    const data = await response.json();
    return data[0];
  },

  create: async (token, tournament) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tournaments`, {
      method: "POST",
      headers: { ...headers(token), Prefer: "return=representation" },
      body: JSON.stringify(tournament),
    });
    const text = await response.text();
    if (!text) return null;
    const data = JSON.parse(text);
    return Array.isArray(data) ? data[0] : data;
  },

  update: async (token, id, updates) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tournaments?id=eq.${id}`,
      {
        method: "PATCH",
        headers: { ...headers(token), Prefer: "return=representation" },
        body: JSON.stringify(updates),
      },
    );
    const data = await response.json();
    return data[0];
  },

  delete: async (token, id) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tournaments?id=eq.${id}`,
      {
        method: "DELETE",
        headers: headers(token),
      },
    );
    return response.ok;
  },
};
