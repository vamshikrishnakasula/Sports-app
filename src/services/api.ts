import {
  Match,
  Tournament,
  StandingRow,
  StatLeader,
  Player,
  Team,
  SportsNewsUpdate,
  MatchHighlight,
  UserProfile,
  SearchResults,
  SportType,
  MatchStatus,
} from '../types';

export const api = {
  // Sports
  async getSports(): Promise<{ id: SportType; name: string; icon: string; liveCount: number }[]> {
    const res = await fetch('/api/sports');
    if (!res.ok) throw new Error('Failed to fetch sports');
    return res.json();
  },

  // Live score ticker
  async getLiveScores(): Promise<Match[]> {
    const res = await fetch('/api/live-scores');
    if (!res.ok) throw new Error('Failed to fetch live scores');
    return res.json();
  },

  // Matches
  async getMatches(params?: {
    sport?: SportType;
    status?: MatchStatus;
    tournamentId?: string;
    q?: string;
  }): Promise<Match[]> {
    const query = new URLSearchParams();
    if (params?.sport && params.sport !== 'all') query.append('sport', params.sport);
    if (params?.status) query.append('status', params.status);
    if (params?.tournamentId) query.append('tournamentId', params.tournamentId);
    if (params?.q) query.append('q', params.q);

    const res = await fetch(`/api/matches?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  },

  async getMatchById(id: string): Promise<Match> {
    const res = await fetch(`/api/matches/${id}`);
    if (!res.ok) throw new Error('Failed to fetch match details');
    return res.json();
  },

  async simulateLiveAction(matchId: string): Promise<{ success: boolean; match: Match }> {
    const res = await fetch(`/api/matches/${matchId}/simulate-live`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to simulate live action');
    return res.json();
  },

  // Tournaments
  async getTournaments(sport?: SportType): Promise<Tournament[]> {
    const query = new URLSearchParams();
    if (sport && sport !== 'all') query.append('sport', sport);
    const res = await fetch(`/api/tournaments?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tournaments');
    return res.json();
  },

  async getTournamentDetails(
    id: string
  ): Promise<{ tournament: Tournament; matches: Match[]; standings: StandingRow[] }> {
    const res = await fetch(`/api/tournaments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch tournament details');
    return res.json();
  },

  // Points Table / Standings
  async getStandings(params?: { sport?: SportType; tournamentId?: string }): Promise<StandingRow[]> {
    const query = new URLSearchParams();
    if (params?.sport && params.sport !== 'all') query.append('sport', params.sport);
    if (params?.tournamentId) query.append('tournamentId', params.tournamentId);
    const res = await fetch(`/api/standings?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch standings');
    return res.json();
  },

  // Statistics
  async getStatistics(params?: { sport?: SportType; category?: string }): Promise<StatLeader[]> {
    const query = new URLSearchParams();
    if (params?.sport && params.sport !== 'all') query.append('sport', params.sport);
    if (params?.category) query.append('category', params.category);
    const res = await fetch(`/api/statistics?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  // Teams
  async getTeams(params?: { sport?: SportType; search?: string }): Promise<Team[]> {
    const query = new URLSearchParams();
    if (params?.sport && params.sport !== 'all') query.append('sport', params.sport);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/teams?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    return res.json();
  },

  async getTeamById(id: string): Promise<Team & { recentMatches: Match[] }> {
    const res = await fetch(`/api/teams/${id}`);
    if (!res.ok) throw new Error('Failed to fetch team details');
    return res.json();
  },

  // Players
  async getPlayers(params?: { sport?: SportType; teamId?: string; search?: string }): Promise<Player[]> {
    const query = new URLSearchParams();
    if (params?.sport && params.sport !== 'all') query.append('sport', params.sport);
    if (params?.teamId) query.append('teamId', params.teamId);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/players?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch players');
    return res.json();
  },

  async getPlayerById(id: string): Promise<Player> {
    const res = await fetch(`/api/players/${id}`);
    if (!res.ok) throw new Error('Failed to fetch player details');
    return res.json();
  },

  // Updates / News
  async getUpdates(params?: { sport?: SportType; category?: string; search?: string }): Promise<SportsNewsUpdate[]> {
    const query = new URLSearchParams();
    if (params?.sport && params.sport !== 'all') query.append('sport', params.sport);
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/updates?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch sports updates');
    return res.json();
  },

  // Highlights
  async getHighlights(params?: { sport?: SportType; matchId?: string }): Promise<MatchHighlight[]> {
    const query = new URLSearchParams();
    if (params?.sport && params.sport !== 'all') query.append('sport', params.sport);
    if (params?.matchId) query.append('matchId', params.matchId);
    const res = await fetch(`/api/highlights?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch highlights');
    return res.json();
  },

  // Unified Search
  async searchAll(term: string): Promise<SearchResults> {
    if (!term.trim()) return { players: [], matches: [], teams: [], updates: [] };
    const res = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // User Profile
  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch('/api/user/profile');
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
  },

  async toggleBookmark(type: 'match' | 'highlight', id: string): Promise<UserProfile> {
    const res = await fetch('/api/user/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id }),
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  // Live score simulation
  async simulateLiveTick(matchId: string): Promise<{ success: boolean; match: Match }> {
    return this.simulateLiveAction(matchId);
  },

  // Stats alias
  async getStats(params?: { sport?: SportType; category?: string }): Promise<StatLeader[]> {
    return this.getStatistics(params);
  },

  // Health
  async checkHealth(): Promise<{ status: string; database: string; aiFeatures: string }> {
    const res = await fetch('/api/health');
    return res.json();
  },
};
