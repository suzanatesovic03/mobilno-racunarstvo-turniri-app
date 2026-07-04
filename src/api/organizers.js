const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const headers = (token) => ({
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token}`,
});

export const organizersApi = {
  add: async (token, tournamentId, userId) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tournament_organizers`,
      {
        method: "POST",
        headers: { ...headers(token), Prefer: "return=representation" },
        body: JSON.stringify({
          tournament_id: tournamentId,
          user_id: userId,
        }),
      },
    );
    const data = await response.json();
    return data[0];
  },

  getByTournament: async (token, tournamentId) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tournament_organizers?tournament_id=eq.${tournamentId}&select=*,profiles(username)`,
      { headers: headers(token) },
    );
    return response.json();
  },

  getMyCoOrganized: async (token, userId) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tournament_organizers?user_id=eq.${userId}&select=*,tournaments(*)`,
      { headers: headers(token) },
    );
    return response.json();
  },

  remove: async (token, tournamentId, userId) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tournament_organizers?tournament_id=eq.${tournamentId}&user_id=eq.${userId}`,
      {
        method: "DELETE",
        headers: headers(token),
      },
    );
    return response.ok;
  },

  searchUsers: async (token, username) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?username=ilike.%25${username}%25&select=*`,
      { headers: headers(token) },
    );
    return response.json();
  },
};
