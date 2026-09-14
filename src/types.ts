export type SportType = 'all' | 'football' | 'cricket' | 'basketball' | 'tennis' | 'formula1';

export type MatchStatus = 'live' | 'upcoming' | 'completed';

export interface ScoreDetail {
  homeScore: string | number;
  awayScore: string | number;
  periodOrOvers?: string; // e.g. "68'", "18.4 ov", "Q4 3:42", "Set 3 (5-3)"
  currentServerOrStriker?: string;
  summaryNote?: string; // e.g. "Real Madrid needs 18 off 8 balls" or "Half Time"
  details?: {
    homeInnings?: string;
    awayInnings?: string;
    homeBreakdown?: (string | number)[]; // sets or quarters
    awayBreakdown?: (string | number)[];
  };
}

export interface MatchTimelineEvent {
  time: string;
  type: 'goal' | 'card' | 'wicket' | 'boundary' | 'basket' | 'break' | 'sub' | 'comment';
  player?: string;
  teamId?: string;
  description: string;
}

export interface Match {
  id: string;
  sport: SportType;
  tournamentId: string;
  tournamentName: string;
  tournamentLogo?: string;
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
  };
  status: MatchStatus;
  startTime: string; // ISO string or human format
  venue: string;
  score: ScoreDetail;
  events?: MatchTimelineEvent[];
  highlightsUrl?: string;
  hasHighlights?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  sport: SportType;
  logo: string;
  season: string;
  countryOrRegion: string;
  teamsCount: number;
  currentLeader?: string;
  status: 'In Progress' | 'Upcoming' | 'Completed';
  startDate: string;
  endDate: string;
}

export interface StandingRow {
  position: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  sport: SportType;
  tournamentId: string;
  played: number;
  won: number;
  drawn?: number;
  lost: number;
  points: number;
  goalDiffOrNRR: string;
  form: ('W' | 'L' | 'D')[];
}

export interface StatLeader {
  rank: number;
  playerId: string;
  playerName: string;
  playerPhoto: string;
  teamName: string;
  teamLogo: string;
  sport: SportType;
  category: string; // "Top Goal Scorers", "Top Run Scorers", "Most Wickets", "Points Per Game", "Aces"
  value: number | string;
  matchesPlayed: number;
}

export interface Player {
  id: string;
  name: string;
  sport: SportType;
  teamId: string;
  teamName: string;
  teamLogo: string;
  jerseyNumber: number;
  position: string;
  nationality: string;
  age: number;
  photo: string;
  stats: Record<string, string | number>;
  bio: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  sport: SportType;
  logo: string;
  country: string;
  founded: number;
  stadium: string;
  coach: string;
  trophies: number;
  squad: Player[];
}

export interface SportsNewsUpdate {
  id: string;
  sport: SportType;
  title: string;
  summary: string;
  content: string;
  category: 'Breaking' | 'Injury' | 'Transfer' | 'Preview' | 'Analysis';
  timestamp: string;
  imageUrl: string;
  readTime: string;
  relatedMatchId?: string;
}

export interface MatchHighlight {
  id: string;
  matchId: string;
  sport: SportType;
  title: string;
  tournament: string;
  duration: string;
  thumbnail: string;
  views: string;
  date: string;
  videoEmbedUrl?: string;
  keyMoments: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  favoriteSports: SportType[];
  followedTeamIds: string[];
  bookmarkedMatchIds: string[];
  bookmarkedHighlightIds: string[];
  notificationsEnabled: boolean;
  scoreAlerts: boolean;
}

export interface SearchResults {
  players: Player[];
  matches: Match[];
  teams: Team[];
  updates: SportsNewsUpdate[];
}
