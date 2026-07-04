const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const headers = (token) => ({
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token}`,
});

export const applicationsApi = {
  apply: async (token, tournamentId, userId) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
      method: "POST",
      headers: { ...headers(token), Prefer: "return=representation" },
      body: JSON.stringify({
        tournament_id: tournamentId,
        user_id: userId,
        status: "pending",
      }),
    });
    const data = await response.json();
    return data[0];
  },

  getByTournament: async (token, tournamentId) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/applications?tournament_id=eq.${tournamentId}&select=*,profiles(username)`,
      { headers: headers(token) },
    );
    return response.json();
  },

  getMyApplications: async (token, userId) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/applications?user_id=eq.${userId}&select=*,tournaments(name,date,location,game)`,
      { headers: headers(token) },
    );
    return response.json();
  },

  updateStatus: async (token, applicationId, status) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/applications?id=eq.${applicationId}`,
      {
        method: "PATCH",
        headers: { ...headers(token), Prefer: "return=representation" },
        body: JSON.stringify({ status }),
      },
    );
    const data = await response.json();
    return data[0];
  },

  getAcceptedCount: async (token, tournamentId) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/applications?tournament_id=eq.${tournamentId}&status=eq.accepted`,
      { headers: headers(token) },
    );
    const data = await response.json();
    return data.length;
  },

  checkExisting: async (token, tournamentId, userId) => {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/applications?tournament_id=eq.${tournamentId}&user_id=eq.${userId}`,
      { headers: headers(token) },
    );
    const data = await response.json();
    return data.length > 0;
  },
};
