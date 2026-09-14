import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { MongoClient, Db } from 'mongodb';
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
  SportType,
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------
// SEED DATA FOR ALL SPORTS
// -------------------------------------------------------------

const seedTournaments: Tournament[] = [
  {
    id: 'tour_ucl',
    name: 'UEFA Champions League',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    season: '2025/26',
    countryOrRegion: 'Europe',
    teamsCount: 36,
    currentLeader: 'Real Madrid',
    status: 'In Progress',
    startDate: '2025-09-16',
    endDate: '2026-05-30',
  },
  {
    id: 'tour_epl',
    name: 'English Premier League',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80',
    season: '2025/26',
    countryOrRegion: 'England',
    teamsCount: 20,
    currentLeader: 'Arsenal',
    status: 'In Progress',
    startDate: '2025-08-15',
    endDate: '2026-05-24',
  },
  {
    id: 'tour_ipl',
    name: 'Indian Premier League (IPL)',
    sport: 'cricket',
    logo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80',
    season: '2026',
    countryOrRegion: 'India',
    teamsCount: 10,
    currentLeader: 'Chennai Super Kings',
    status: 'In Progress',
    startDate: '2026-03-22',
    endDate: '2026-05-28',
  },
  {
    id: 'tour_wtc',
    name: 'ICC World Test Championship',
    sport: 'cricket',
    logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
    season: '2025-2027',
    countryOrRegion: 'Global',
    teamsCount: 9,
    currentLeader: 'India',
    status: 'In Progress',
    startDate: '2025-06-01',
    endDate: '2027-06-15',
  },
  {
    id: 'tour_nba',
    name: 'NBA Championship',
    sport: 'basketball',
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80',
    season: '2025-26',
    countryOrRegion: 'USA / Canada',
    teamsCount: 30,
    currentLeader: 'Boston Celtics',
    status: 'In Progress',
    startDate: '2025-10-21',
    endDate: '2026-06-20',
  },
  {
    id: 'tour_wimbledon',
    name: 'The Championships, Wimbledon',
    sport: 'tennis',
    logo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=100&auto=format&fit=crop&q=80',
    season: '2026',
    countryOrRegion: 'United Kingdom',
    teamsCount: 128,
    currentLeader: 'Carlos Alcaraz',
    status: 'In Progress',
    startDate: '2026-06-29',
    endDate: '2026-07-12',
  },
  {
    id: 'tour_f1',
    name: 'Formula 1 World Championship',
    sport: 'formula1',
    logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&auto=format&fit=crop&q=80',
    season: '2026',
    countryOrRegion: 'Global',
    teamsCount: 10,
    currentLeader: 'Max Verstappen',
    status: 'In Progress',
    startDate: '2026-03-01',
    endDate: '2026-11-29',
  },
];

const seedMatches: Match[] = [
  // --- CRICKET LIVE ---
  {
    id: 'match_cricket_1',
    sport: 'cricket',
    tournamentId: 'tour_ipl',
    tournamentName: 'Indian Premier League (IPL)',
    homeTeam: {
      id: 'team_csk',
      name: 'Chennai Super Kings',
      shortName: 'CSK',
      logo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_mi',
      name: 'Mumbai Indians',
      shortName: 'MI',
      logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
    },
    status: 'live',
    startTime: 'Today, 19:30 IST',
    venue: 'M. A. Chidambaram Stadium, Chennai',
    score: {
      homeScore: '182/4',
      awayScore: '176/7',
      periodOrOvers: '19.2 ov',
      currentServerOrStriker: 'Ruturaj Gaikwad 68* (42b), Ravindra Jadeja 24* (11b)',
      summaryNote: 'CSK need 5 runs in 4 balls to win',
      details: {
        homeInnings: '182/4 (19.2 ov, Target: 181)',
        awayInnings: '176/7 (20.0 ov)',
      },
    },
    events: [
      { time: '19.2', type: 'boundary', player: 'Ravindra Jadeja', description: 'FOUR! Smashed through extra cover with pure authority.' },
      { time: '19.1', type: 'comment', player: 'Jasprit Bumrah', description: 'Dot ball! Yorked right on the toes of Jadeja.' },
      { time: '18.4', type: 'wicket', player: 'Shivam Dube', description: 'WICKET! Dube c Rohit b Bumrah 34 (16) - caught at mid-wicket.' },
      { time: '18.2', type: 'boundary', player: 'Shivam Dube', description: 'SIX! Massive pull over deep square leg into the stands.' },
    ],
    hasHighlights: true,
  },
  // --- CRICKET TEST LIVE ---
  {
    id: 'match_cricket_2',
    sport: 'cricket',
    tournamentId: 'tour_wtc',
    tournamentName: 'ICC World Test Championship',
    homeTeam: {
      id: 'team_ind',
      name: 'India',
      shortName: 'IND',
      logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_aus',
      name: 'Australia',
      shortName: 'AUS',
      logo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=100&auto=format&fit=crop&q=80',
    },
    status: 'live',
    startTime: 'Day 3, Session 2',
    venue: 'Melbourne Cricket Ground, Melbourne',
    score: {
      homeScore: '298/4',
      awayScore: '315',
      periodOrOvers: '84.4 ov',
      currentServerOrStriker: 'Virat Kohli 114* (188b), Rishabh Pant 42* (38b)',
      summaryNote: 'India trail by 17 runs with 6 wickets in hand',
      details: {
        homeInnings: '298/4 (84.4 ov)',
        awayInnings: '315 all out (94.2 ov)',
      },
    },
    events: [
      { time: '84.4', type: 'boundary', player: 'Virat Kohli', description: 'FOUR! Exquisite cover drive racing to the boundary.' },
      { time: '81.1', type: 'comment', player: 'Pat Cummins', description: 'New ball taken by Australian captain Pat Cummins.' },
      { time: '74.3', type: 'boundary', player: 'Virat Kohli', description: 'CENTURY! 100 up for Virat Kohli with a trademark flick to mid-wicket.' },
    ],
    hasHighlights: true,
  },

  // --- FOOTBALL LIVE ---
  {
    id: 'match_football_1',
    sport: 'football',
    tournamentId: 'tour_ucl',
    tournamentName: 'UEFA Champions League',
    homeTeam: {
      id: 'team_rma',
      name: 'Real Madrid',
      shortName: 'RMA',
      logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_mci',
      name: 'Manchester City',
      shortName: 'MCI',
      logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80',
    },
    status: 'live',
    startTime: '20:00 CET',
    venue: 'Santiago Bernabéu, Madrid',
    score: {
      homeScore: 2,
      awayScore: 1,
      periodOrOvers: "73'",
      summaryNote: 'Agg: 4 - 3 | High intensity second half in Madrid',
    },
    events: [
      { time: "71'", type: 'goal', player: 'Vinícius Jr.', description: 'GOAL! Sensational solo counter-attack strike inside the near post.' },
      { time: "56'", type: 'goal', player: 'Erling Haaland', description: 'GOAL! Header from Kevin De Bruyne corner kick.' },
      { time: "34'", type: 'goal', player: 'Jude Bellingham', description: 'GOAL! Calm chip over the onrushing goalkeeper.' },
      { time: "18'", type: 'card', player: 'Rodri', description: 'Yellow Card for tactical foul in midfield.' },
    ],
    hasHighlights: true,
  },
  // --- FOOTBALL LIVE 2 ---
  {
    id: 'match_football_2',
    sport: 'football',
    tournamentId: 'tour_epl',
    tournamentName: 'English Premier League',
    homeTeam: {
      id: 'team_ars',
      name: 'Arsenal',
      shortName: 'ARS',
      logo: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_liv',
      name: 'Liverpool',
      shortName: 'LIV',
      logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=80',
    },
    status: 'live',
    startTime: '16:30 BST',
    venue: 'Emirates Stadium, London',
    score: {
      homeScore: 1,
      awayScore: 1,
      periodOrOvers: "58'",
      summaryNote: 'Premier League top-of-the-table clash',
    },
    events: [
      { time: "54'", type: 'goal', player: 'Mohamed Salah', description: 'GOAL! Curling finish into the top left corner.' },
      { time: "22'", type: 'goal', player: 'Bukayo Saka', description: 'GOAL! Cuts inside onto his left foot and beats the keeper.' },
    ],
    hasHighlights: true,
  },

  // --- BASKETBALL LIVE ---
  {
    id: 'match_basketball_1',
    sport: 'basketball',
    tournamentId: 'tour_nba',
    tournamentName: 'NBA Championship',
    homeTeam: {
      id: 'team_bos',
      name: 'Boston Celtics',
      shortName: 'BOS',
      logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_lal',
      name: 'Los Angeles Lakers',
      shortName: 'LAL',
      logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80',
    },
    status: 'live',
    startTime: '19:30 EST',
    venue: 'TD Garden, Boston',
    score: {
      homeScore: 104,
      awayScore: 101,
      periodOrOvers: 'Q4 02:18',
      summaryNote: 'Clutch time at TD Garden! 1 possession game.',
      details: {
        homeBreakdown: [28, 27, 26, 23],
        awayBreakdown: [24, 30, 25, 22],
      },
    },
    events: [
      { time: '02:18', type: 'basket', player: 'Jayson Tatum', description: 'Stepback 3-pointer makes it 104-101 Celtics!' },
      { time: '02:44', type: 'basket', player: 'LeBron James', description: 'LeBron drives the lane for a powerful reverse layup.' },
      { time: '03:15', type: 'basket', player: 'Jaylen Brown', description: 'Midrange jumper from the elbow.' },
    ],
    hasHighlights: true,
  },

  // --- TENNIS LIVE ---
  {
    id: 'match_tennis_1',
    sport: 'tennis',
    tournamentId: 'tour_wimbledon',
    tournamentName: 'The Championships, Wimbledon',
    homeTeam: {
      id: 'player_alcaraz',
      name: 'Carlos Alcaraz (ESP)',
      shortName: 'ALC',
      logo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'player_sinner',
      name: 'Jannik Sinner (ITA)',
      shortName: 'SIN',
      logo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=100&auto=format&fit=crop&q=80',
    },
    status: 'live',
    startTime: '14:00 BST',
    venue: 'Centre Court, Wimbledon',
    score: {
      homeScore: '2',
      awayScore: '1',
      periodOrOvers: 'Set 4 (4-3)',
      currentServerOrStriker: 'Alcaraz serving (40-30)',
      summaryNote: 'Sets: [6-4, 3-6, 7-6, 4-3] | Semi-Final thrilling battle',
      details: {
        homeBreakdown: [6, 3, 7, 4],
        awayBreakdown: [4, 6, 6, 3],
      },
    },
    events: [
      { time: 'Set 4 G7', type: 'break', player: 'Carlos Alcaraz', description: 'Alcaraz unleashes 102mph forehand winner down the line.' },
      { time: 'Set 4 G6', type: 'comment', player: 'Jannik Sinner', description: 'Sinner holds serve at love with an ace out wide.' },
    ],
    hasHighlights: true,
  },

  // --- UPCOMING MATCHES ---
  {
    id: 'match_cricket_up_1',
    sport: 'cricket',
    tournamentId: 'tour_ipl',
    tournamentName: 'Indian Premier League (IPL)',
    homeTeam: {
      id: 'team_rcb',
      name: 'Royal Challengers Bengaluru',
      shortName: 'RCB',
      logo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_kkr',
      name: 'Kolkata Knight Riders',
      shortName: 'KKR',
      logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
    },
    status: 'upcoming',
    startTime: 'Tomorrow, 19:30 IST',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    score: {
      homeScore: '-',
      awayScore: '-',
      summaryNote: 'Match 42 • Pitch report: High scoring venue expected',
    },
  },
  {
    id: 'match_football_up_1',
    sport: 'football',
    tournamentId: 'tour_ucl',
    tournamentName: 'UEFA Champions League',
    homeTeam: {
      id: 'team_fcb',
      name: 'FC Barcelona',
      shortName: 'BAR',
      logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_bay',
      name: 'Bayern Munich',
      shortName: 'BAY',
      logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80',
    },
    status: 'upcoming',
    startTime: 'Wed, 21:00 CET',
    venue: 'Spotify Camp Nou, Barcelona',
    score: {
      homeScore: '-',
      awayScore: '-',
      summaryNote: 'Quarter-Final 2nd Leg • Blockbuster clash',
    },
  },
  {
    id: 'match_basketball_up_1',
    sport: 'basketball',
    tournamentId: 'tour_nba',
    tournamentName: 'NBA Championship',
    homeTeam: {
      id: 'team_gsw',
      name: 'Golden State Warriors',
      shortName: 'GSW',
      logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_den',
      name: 'Denver Nuggets',
      shortName: 'DEN',
      logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80',
    },
    status: 'upcoming',
    startTime: 'Tomorrow, 22:00 EST',
    venue: 'Chase Center, San Francisco',
    score: {
      homeScore: '-',
      awayScore: '-',
      summaryNote: 'Curry vs Jokić • Western Conference showdown',
    },
  },
  {
    id: 'match_f1_up_1',
    sport: 'formula1',
    tournamentId: 'tour_f1',
    tournamentName: 'Formula 1 World Championship',
    homeTeam: {
      id: 'team_f1_monaco',
      name: 'Monaco Grand Prix',
      shortName: 'MON',
      logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_f1_grid',
      name: '20 Drivers Grid',
      shortName: 'F1',
      logo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&auto=format&fit=crop&q=80',
    },
    status: 'upcoming',
    startTime: 'Sunday, 15:00 CEST',
    venue: 'Circuit de Monaco, Monte Carlo',
    score: {
      homeScore: 'Pole',
      awayScore: '78 Laps',
      summaryNote: 'Qualifying completed: Verstappen P1, Leclerc P2, Norris P3',
    },
  },

  // --- COMPLETED MATCHES ---
  {
    id: 'match_football_comp_1',
    sport: 'football',
    tournamentId: 'tour_epl',
    tournamentName: 'English Premier League',
    homeTeam: {
      id: 'team_mci',
      name: 'Manchester City',
      shortName: 'MCI',
      logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_che',
      name: 'Chelsea',
      shortName: 'CHE',
      logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    },
    status: 'completed',
    startTime: 'Yesterday',
    venue: 'Etihad Stadium, Manchester',
    score: {
      homeScore: 3,
      awayScore: 1,
      periodOrOvers: 'Full Time',
      summaryNote: 'Man City secured 3 crucial points at home',
    },
    events: [
      { time: "88'", type: 'goal', player: 'Phil Foden', description: 'Goal! Foden seals the victory from edge of box.' },
      { time: "62'", type: 'goal', player: 'Erling Haaland', description: 'Goal! Powerful header past the keeper.' },
      { time: "41'", type: 'goal', player: 'Cole Palmer', description: 'Goal! Chelsea pulls one back with precision penalty.' },
      { time: "12'", type: 'goal', player: 'Kevin De Bruyne', description: 'Goal! Magnificent free kick into top corner.' },
    ],
    hasHighlights: true,
  },
  {
    id: 'match_cricket_comp_1',
    sport: 'cricket',
    tournamentId: 'tour_ipl',
    tournamentName: 'Indian Premier League (IPL)',
    homeTeam: {
      id: 'team_rcb',
      name: 'Royal Challengers Bengaluru',
      shortName: 'RCB',
      logo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80',
    },
    awayTeam: {
      id: 'team_dc',
      name: 'Delhi Capitals',
      shortName: 'DC',
      logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
    },
    status: 'completed',
    startTime: '2 days ago',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    score: {
      homeScore: '198/5',
      awayScore: '184/8',
      periodOrOvers: '20 ov',
      summaryNote: 'RCB won by 14 runs • Player of the Match: Virat Kohli (83 off 48)',
    },
    hasHighlights: true,
  },
];

const seedStandings: StandingRow[] = [
  // EPL Table
  { position: 1, teamId: 'team_ars', teamName: 'Arsenal', teamLogo: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=100&auto=format&fit=crop&q=80', sport: 'football', tournamentId: 'tour_epl', played: 28, won: 20, drawn: 5, lost: 3, points: 65, goalDiffOrNRR: '+41', form: ['W', 'W', 'D', 'W', 'W'] },
  { position: 2, teamId: 'team_mci', teamName: 'Manchester City', teamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80', sport: 'football', tournamentId: 'tour_epl', played: 28, won: 19, drawn: 6, lost: 3, points: 63, goalDiffOrNRR: '+39', form: ['W', 'W', 'W', 'D', 'W'] },
  { position: 3, teamId: 'team_liv', teamName: 'Liverpool', teamLogo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=80', sport: 'football', tournamentId: 'tour_epl', played: 28, won: 18, drawn: 7, lost: 3, points: 61, goalDiffOrNRR: '+35', form: ['D', 'W', 'W', 'L', 'W'] },
  { position: 4, teamId: 'team_ast', teamName: 'Aston Villa', teamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', sport: 'football', tournamentId: 'tour_epl', played: 28, won: 16, drawn: 5, lost: 7, points: 53, goalDiffOrNRR: '+18', form: ['W', 'L', 'W', 'W', 'D'] },
  { position: 5, teamId: 'team_che', teamName: 'Chelsea', teamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', sport: 'football', tournamentId: 'tour_epl', played: 28, won: 14, drawn: 6, lost: 8, points: 48, goalDiffOrNRR: '+12', form: ['L', 'W', 'D', 'W', 'L'] },
  { position: 6, teamId: 'team_tot', teamName: 'Tottenham', teamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80', sport: 'football', tournamentId: 'tour_epl', played: 28, won: 14, drawn: 5, lost: 9, points: 47, goalDiffOrNRR: '+11', form: ['W', 'L', 'L', 'W', 'W'] },

  // IPL Table
  { position: 1, teamId: 'team_csk', teamName: 'Chennai Super Kings', teamLogo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80', sport: 'cricket', tournamentId: 'tour_ipl', played: 10, won: 7, lost: 3, points: 14, goalDiffOrNRR: '+0.745', form: ['W', 'W', 'L', 'W', 'W'] },
  { position: 2, teamId: 'team_kkr', teamName: 'Kolkata Knight Riders', teamLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80', sport: 'cricket', tournamentId: 'tour_ipl', played: 10, won: 7, lost: 3, points: 14, goalDiffOrNRR: '+0.680', form: ['W', 'L', 'W', 'W', 'W'] },
  { position: 3, teamId: 'team_rcb', teamName: 'Royal Challengers Bengaluru', teamLogo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80', sport: 'cricket', tournamentId: 'tour_ipl', played: 10, won: 6, lost: 4, points: 12, goalDiffOrNRR: '+0.320', form: ['W', 'W', 'W', 'L', 'W'] },
  { position: 4, teamId: 'team_mi', teamName: 'Mumbai Indians', teamLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80', sport: 'cricket', tournamentId: 'tour_ipl', played: 10, won: 5, lost: 5, points: 10, goalDiffOrNRR: '+0.115', form: ['L', 'W', 'L', 'W', 'L'] },
  { position: 5, teamId: 'team_srh', teamName: 'Sunrisers Hyderabad', teamLogo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80', sport: 'cricket', tournamentId: 'tour_ipl', played: 10, won: 5, lost: 5, points: 10, goalDiffOrNRR: '+0.080', form: ['L', 'L', 'W', 'W', 'L'] },

  // NBA Standings
  { position: 1, teamId: 'team_bos', teamName: 'Boston Celtics', teamLogo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80', sport: 'basketball', tournamentId: 'tour_nba', played: 64, won: 50, lost: 14, points: 114, goalDiffOrNRR: '+9.8 PPG', form: ['W', 'W', 'W', 'W', 'L'] },
  { position: 2, teamId: 'team_okc', teamName: 'Oklahoma City Thunder', teamLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80', sport: 'basketball', tournamentId: 'tour_nba', played: 64, won: 47, lost: 17, points: 111, goalDiffOrNRR: '+7.4 PPG', form: ['W', 'W', 'L', 'W', 'W'] },
  { position: 3, teamId: 'team_den', teamName: 'Denver Nuggets', teamLogo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80', sport: 'basketball', tournamentId: 'tour_nba', played: 64, won: 45, lost: 19, points: 109, goalDiffOrNRR: '+5.6 PPG', form: ['W', 'L', 'W', 'W', 'D'] },
  { position: 4, teamId: 'team_lal', teamName: 'Los Angeles Lakers', teamLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80', sport: 'basketball', tournamentId: 'tour_nba', played: 64, won: 40, lost: 24, points: 104, goalDiffOrNRR: '+3.1 PPG', form: ['L', 'W', 'W', 'L', 'W'] },

  // F1 Drivers Championship
  { position: 1, teamId: 'driver_max', teamName: 'Max Verstappen (Red Bull)', teamLogo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&auto=format&fit=crop&q=80', sport: 'formula1', tournamentId: 'tour_f1', played: 6, won: 4, lost: 2, points: 136, goalDiffOrNRR: 'P1 (4 Wins)', form: ['W', 'W', 'L', 'W', 'W'] },
  { position: 2, teamId: 'driver_charles', teamName: 'Charles Leclerc (Ferrari)', teamLogo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&auto=format&fit=crop&q=80', sport: 'formula1', tournamentId: 'tour_f1', played: 6, won: 1, lost: 5, points: 112, goalDiffOrNRR: 'P2 (1 Win)', form: ['W', 'D', 'W', 'L', 'W'] },
  { position: 3, teamId: 'driver_lando', teamName: 'Lando Norris (McLaren)', teamLogo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&auto=format&fit=crop&q=80', sport: 'formula1', tournamentId: 'tour_f1', played: 6, won: 1, lost: 5, points: 101, goalDiffOrNRR: 'P3 (1 Win)', form: ['L', 'W', 'W', 'W', 'L'] },
];

const seedStatLeaders: StatLeader[] = [
  // Football Top Scorers
  { rank: 1, playerId: 'player_haaland', playerName: 'Erling Haaland', playerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', teamName: 'Manchester City', teamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80', sport: 'football', category: 'Top Goal Scorers', value: '25 Goals', matchesPlayed: 24 },
  { rank: 2, playerId: 'player_salah', playerName: 'Mohamed Salah', playerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', teamName: 'Liverpool', teamLogo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=80', sport: 'football', category: 'Top Goal Scorers', value: '21 Goals', matchesPlayed: 26 },
  { rank: 3, playerId: 'player_mbappe', playerName: 'Kylian Mbappé', playerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', teamName: 'Real Madrid', teamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', sport: 'football', category: 'Top Goal Scorers', value: '19 Goals', matchesPlayed: 22 },
  { rank: 4, playerId: 'player_saka', playerName: 'Bukayo Saka', playerPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80', teamName: 'Arsenal', teamLogo: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=100&auto=format&fit=crop&q=80', sport: 'football', category: 'Top Goal Scorers', value: '16 Goals', matchesPlayed: 25 },

  // Cricket Top Runs
  { rank: 1, playerId: 'player_kohli', playerName: 'Virat Kohli', playerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80', teamName: 'India / RCB', teamLogo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80', sport: 'cricket', category: 'Top Run Scorers', value: '642 Runs', matchesPlayed: 11 },
  { rank: 2, playerId: 'player_gaikwad', playerName: 'Ruturaj Gaikwad', playerPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80', teamName: 'Chennai Super Kings', teamLogo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80', sport: 'cricket', category: 'Top Run Scorers', value: '583 Runs', matchesPlayed: 10 },
  { rank: 3, playerId: 'player_rohit', playerName: 'Rohit Sharma', playerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', teamName: 'India / MI', teamLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80', sport: 'cricket', category: 'Top Run Scorers', value: '512 Runs', matchesPlayed: 10 },

  // Cricket Top Wickets
  { rank: 1, playerId: 'player_bumrah', playerName: 'Jasprit Bumrah', playerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', teamName: 'Mumbai Indians / India', teamLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80', sport: 'cricket', category: 'Most Wickets', value: '23 Wickets', matchesPlayed: 10 },
  { rank: 2, playerId: 'player_cummins', playerName: 'Pat Cummins', playerPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80', teamName: 'Australia / SRH', teamLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80', sport: 'cricket', category: 'Most Wickets', value: '19 Wickets', matchesPlayed: 9 },

  // Basketball PPG
  { rank: 1, playerId: 'player_luka', playerName: 'Luka Dončić', playerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', teamName: 'Dallas Mavericks', teamLogo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80', sport: 'basketball', category: 'Points Per Game (PPG)', value: '33.9 PPG', matchesPlayed: 62 },
  { rank: 2, playerId: 'player_giannis', playerName: 'Giannis Antetokounmpo', playerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', teamName: 'Milwaukee Bucks', teamLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80', sport: 'basketball', category: 'Points Per Game (PPG)', value: '30.4 PPG', matchesPlayed: 60 },
  { rank: 3, playerId: 'player_tatum', playerName: 'Jayson Tatum', playerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', teamName: 'Boston Celtics', teamLogo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80', sport: 'basketball', category: 'Points Per Game (PPG)', value: '27.8 PPG', matchesPlayed: 64 },

  // Tennis Aces
  { rank: 1, playerId: 'player_hurkacz', playerName: 'Hubert Hurkacz', playerPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80', teamName: 'Poland', teamLogo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=100&auto=format&fit=crop&q=80', sport: 'tennis', category: 'Aces Served', value: '782 Aces', matchesPlayed: 44 },
  { rank: 2, playerId: 'player_sinner', playerName: 'Jannik Sinner', playerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80', teamName: 'Italy', teamLogo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=100&auto=format&fit=crop&q=80', sport: 'tennis', category: 'Aces Served', value: '540 Aces', matchesPlayed: 48 },
];

const seedPlayers: Player[] = [
  {
    id: 'player_kohli',
    name: 'Virat Kohli',
    sport: 'cricket',
    teamId: 'team_rcb',
    teamName: 'Royal Challengers Bengaluru / India',
    teamLogo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80',
    jerseyNumber: 18,
    position: 'Top-order Batsman',
    nationality: 'India',
    age: 37,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    stats: {
      'IPL Runs': 8004,
      'Test Runs': 8848,
      'ODI Runs': 13848,
      'Centuries': 80,
      'Strike Rate': 137.9,
    },
    bio: 'One of the greatest all-format batsmen in cricket history. Former Indian captain and the all-time leading run-scorer in IPL history.',
  },
  {
    id: 'player_bumrah',
    name: 'Jasprit Bumrah',
    sport: 'cricket',
    teamId: 'team_mi',
    teamName: 'Mumbai Indians / India',
    teamLogo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
    jerseyNumber: 93,
    position: 'Fast Bowler',
    nationality: 'India',
    age: 32,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    stats: {
      'IPL Wickets': 168,
      'Test Wickets': 162,
      'Economy Rate': 7.3,
      'Best Bowling': '6/19',
    },
    bio: 'Premier fast bowler known for his lethal yorkers, unorthodox action, and mastery in death overs across all international formats.',
  },
  {
    id: 'player_haaland',
    name: 'Erling Haaland',
    sport: 'football',
    teamId: 'team_mci',
    teamName: 'Manchester City',
    teamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80',
    jerseyNumber: 9,
    position: 'Striker / Centre-Forward',
    nationality: 'Norway',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    stats: {
      'Premier League Goals': 82,
      'Champions League Goals': 44,
      'Hat-tricks': 8,
      'Shot Conversion': '29%',
    },
    bio: 'Prolific generational goalscorer endowed with rare pace, power, physical presence, and instinctual finishing inside the penalty area.',
  },
  {
    id: 'player_mbappe',
    name: 'Kylian Mbappé',
    sport: 'football',
    teamId: 'team_rma',
    teamName: 'Real Madrid',
    teamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    jerseyNumber: 9,
    position: 'Forward',
    nationality: 'France',
    age: 27,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    stats: {
      'Total Career Goals': 310,
      'World Cup Goals': 12,
      'Assists': 130,
      'Top Speed': '38.0 km/h',
    },
    bio: 'French superstar, 2018 World Cup winner and World Cup Final hat-trick hero, renowned for electrifying acceleration, dribbling, and clinical finishes.',
  },
  {
    id: 'player_bellingham',
    name: 'Jude Bellingham',
    sport: 'football',
    teamId: 'team_rma',
    teamName: 'Real Madrid',
    teamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    jerseyNumber: 5,
    position: 'Attacking Midfielder',
    nationality: 'England',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    stats: {
      'Goals for Real Madrid': 28,
      'Assists': 16,
      'Tackles Won': 112,
      'Pass Accuracy': '89.4%',
    },
    bio: 'Dynamic complete midfielder who combines relentless physical box-to-box presence with creative elegance and clutch late match-winners.',
  },
  {
    id: 'player_tatum',
    name: 'Jayson Tatum',
    sport: 'basketball',
    teamId: 'team_bos',
    teamName: 'Boston Celtics',
    teamLogo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80',
    jerseyNumber: 0,
    position: 'Forward',
    nationality: 'USA',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    stats: {
      'PPG': 27.8,
      'RPG': 8.6,
      'APG': 4.9,
      '3-Point %': '37.6%',
      'NBA Championship': '1 (2024)',
    },
    bio: 'NBA Champion and 5-time All-Star swingman possessing elite three-level scoring, lock-down defensive versatility, and leadership.',
  },
  {
    id: 'player_alcaraz',
    name: 'Carlos Alcaraz',
    sport: 'tennis',
    teamId: 'team_tennis_spain',
    teamName: 'ATP Tour (Spain)',
    teamLogo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=100&auto=format&fit=crop&q=80',
    jerseyNumber: 1,
    position: 'Singles Player',
    nationality: 'Spain',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    stats: {
      'Grand Slam Titles': 4,
      'Career Titles': 16,
      'Win Rate': '81.4%',
      'Current Ranking': '#2',
    },
    bio: 'Phenom who became the youngest World No. 1 in ATP history. Possesses explosive movement, devastating drop shots, and all-court wizardry.',
  },
  {
    id: 'driver_max',
    name: 'Max Verstappen',
    sport: 'formula1',
    teamId: 'team_redbull',
    teamName: 'Red Bull Racing',
    teamLogo: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&auto=format&fit=crop&q=80',
    jerseyNumber: 1,
    position: 'Driver',
    nationality: 'Netherlands',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    stats: {
      'World Championships': 4,
      'Race Wins': 64,
      'Podiums': 112,
      'Pole Positions': 42,
    },
    bio: 'Four-time Formula 1 World Champion famed for aggressive wheel-to-wheel racing, uncompromising precision, and record-shattering dominance.',
  },
];

const seedTeams: Team[] = [
  {
    id: 'team_rma',
    name: 'Real Madrid Club de Fútbol',
    shortName: 'Real Madrid',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    country: 'Spain',
    founded: 1902,
    stadium: 'Santiago Bernabéu (85,000 capacity)',
    coach: 'Carlo Ancelotti',
    trophies: 102,
    squad: seedPlayers.filter((p) => p.teamId === 'team_rma'),
  },
  {
    id: 'team_mci',
    name: 'Manchester City Football Club',
    shortName: 'Man City',
    sport: 'football',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80',
    country: 'England',
    founded: 1880,
    stadium: 'Etihad Stadium (53,400 capacity)',
    coach: 'Pep Guardiola',
    trophies: 34,
    squad: seedPlayers.filter((p) => p.teamId === 'team_mci'),
  },
  {
    id: 'team_csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    sport: 'cricket',
    logo: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=100&auto=format&fit=crop&q=80',
    country: 'India',
    founded: 2008,
    stadium: 'M. A. Chidambaram Stadium (38,000 capacity)',
    coach: 'Stephen Fleming',
    trophies: 5,
    squad: seedPlayers.filter((p) => p.teamId === 'team_csk'),
  },
  {
    id: 'team_mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    sport: 'cricket',
    logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
    country: 'India',
    founded: 2008,
    stadium: 'Wankhede Stadium (33,108 capacity)',
    coach: 'Mahela Jayawardene',
    trophies: 5,
    squad: seedPlayers.filter((p) => p.teamId === 'team_mi'),
  },
  {
    id: 'team_bos',
    name: 'Boston Celtics',
    shortName: 'Celtics',
    sport: 'basketball',
    logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80',
    country: 'USA',
    founded: 1946,
    stadium: 'TD Garden (19,156 capacity)',
    coach: 'Joe Mazzulla',
    trophies: 18,
    squad: seedPlayers.filter((p) => p.teamId === 'team_bos'),
  },
];

const seedNewsUpdates: SportsNewsUpdate[] = [
  {
    id: 'news_1',
    sport: 'football',
    title: 'Champions League Drama: Real Madrid and Man City Clash in Epic 5-Goal Thriller',
    summary: 'Vinícius Jr and Jude Bellingham produce second-half magic at the Bernabéu as Real Madrid take control in the quarter-final tie.',
    content: 'An electric evening in Madrid saw both European powerhouses deliver football of the highest calibre. Erling Haaland equalized shortly after the break before Vinícius Jr ignited the home crowd with a breathtaking solo effort.',
    category: 'Breaking',
    timestamp: '25 mins ago',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    readTime: '3 min read',
    relatedMatchId: 'match_football_1',
  },
  {
    id: 'news_2',
    sport: 'cricket',
    title: 'Bumrah Strikes Late but CSK Inch Towards Dramatic Chepauk Victory Over MI',
    summary: 'Ruturaj Gaikwad masterclass and Ravindra Jadeja finishing prowess put Chennai within touching distance in classic El Clásico of IPL.',
    content: 'The M. A. Chidambaram Stadium was bathed in a sea of yellow as CSK mounted a clinical run-chase against arch-rivals Mumbai Indians. Despite Jasprit Bumrah conceding just 18 runs across his 4 overs, CSK maintained their calm in the penultimate over.',
    category: 'Analysis',
    timestamp: '45 mins ago',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=600&auto=format&fit=crop&q=80',
    readTime: '4 min read',
    relatedMatchId: 'match_cricket_1',
  },
  {
    id: 'news_3',
    sport: 'basketball',
    title: 'Jayson Tatum Clutch Stepback Puts Celtics Ahead of Lakers in Fourth Quarter',
    summary: 'TD Garden erupts as Boston defends their Eastern Conference supremacy in a wire-to-wire classic rivalry duel.',
    content: 'With under three minutes on the clock, Jayson Tatum sank his fourth three-pointer of the night over Anthony Davis, giving Boston a critical cushion in a back-and-forth thriller against LeBron James and the Los Angeles Lakers.',
    category: 'Breaking',
    timestamp: '1 hour ago',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    readTime: '2 min read',
    relatedMatchId: 'match_basketball_1',
  },
  {
    id: 'news_4',
    sport: 'tennis',
    title: 'Alcaraz vs Sinner Wimbledon Semi-Final Enters Riveting Fourth Set',
    summary: 'Centre Court witnesses high-speed baseline exchanges as defending champion Alcaraz battles the Italian world number one.',
    content: 'Spectators on Centre Court stood to applaud a 28-shot rally that featured two lobs, a tweener attempt, and a curling forehand pass from Carlos Alcaraz to gain the upper hand in the fourth set.',
    category: 'Breaking',
    timestamp: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80',
    readTime: '3 min read',
    relatedMatchId: 'match_tennis_1',
  },
  {
    id: 'news_5',
    sport: 'formula1',
    title: 'Monaco GP Preview: Red Bull and Ferrari Set for Tightest Street Fight of Season',
    summary: 'Track temperature and qualifying strategy will decide Sunday around the legendary Monte Carlo harbour.',
    content: 'Max Verstappen clinched pole position by just 0.024 seconds ahead of Charles Leclerc. With overtaking notoriously difficult on the narrow streets of Monaco, Sunday pit stop execution will be the decisive factor.',
    category: 'Preview',
    timestamp: '4 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
    readTime: '5 min read',
    relatedMatchId: 'match_f1_up_1',
  },
];

const seedHighlights: MatchHighlight[] = [
  {
    id: 'hl_1',
    matchId: 'match_football_1',
    sport: 'football',
    title: 'Real Madrid vs Man City (2-1) | Vinícius Jr Stunner & Haaland Header | UCL Highlights',
    tournament: 'UEFA Champions League',
    duration: '08:42',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    views: '1.4M views',
    date: 'Today',
    keyMoments: [
      "34' - Jude Bellingham chips goalkeeper for opening goal",
      "56' - Erling Haaland thumps header from De Bruyne cross",
      "71' - Vinícius Jr 50-yard sprint and curled finish into bottom corner",
      "89' - Ederson finger-tip save denies Valverde rocket",
    ],
  },
  {
    id: 'hl_2',
    matchId: 'match_cricket_1',
    sport: 'cricket',
    title: 'CSK vs MI Thriller | Gaikwad 68 & Bumrah 2-Wicket Spell | Match Highlights',
    tournament: 'Indian Premier League (IPL)',
    duration: '11:15',
    thumbnail: 'https://images.unsplash.com/photo-1531415074868-836332ff4296?w=600&auto=format&fit=crop&q=80',
    views: '2.8M views',
    date: 'Today',
    keyMoments: [
      '1st Innings: Rohit Sharma blazing 45 off 24 balls',
      '14th Over: Bumrah strikes twice in one over with unplayable yorkers',
      '18th Over: Shivam Dube launches 104m six over mid-wicket',
      'Final Over: Jadeja boundary to seal tension-filled run chase',
    ],
  },
  {
    id: 'hl_3',
    matchId: 'match_basketball_1',
    sport: 'basketball',
    title: 'Celtics vs Lakers Classic | Tatum 32 Pts vs LeBron 29 Pts | Full Game Highlights',
    tournament: 'NBA Championship',
    duration: '09:30',
    thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    views: '890K views',
    date: 'Today',
    keyMoments: [
      'Q2: LeBron James coast-to-coast dunk over two defenders',
      'Q3: Jaylen Brown 8-0 solo scoring run',
      'Q4: Tatum clutch stepback 3-pointer with 2:18 remaining',
      'Final Seconds: Celtics defensive trap forces turnover',
    ],
  },
  {
    id: 'hl_4',
    matchId: 'match_football_comp_1',
    sport: 'football',
    title: 'Manchester City 3 - 1 Chelsea | De Bruyne Masterclass & Foden Strike',
    tournament: 'English Premier League',
    duration: '07:20',
    thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80',
    views: '1.1M views',
    date: 'Yesterday',
    keyMoments: [
      "12' - Kevin De Bruyne free kick into top postage stamp",
      "41' - Cole Palmer penalty calmly slotted",
      "62' - Erling Haaland towering header",
      "88' - Phil Foden curled effort completes three points",
    ],
  },
];

let currentUserProfile: UserProfile = {
  id: 'user_sports_fan',
  name: 'Alex Morgan',
  email: 'sportsfan@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  favoriteSports: ['football', 'cricket', 'basketball'],
  followedTeamIds: ['team_rma', 'team_csk', 'team_bos'],
  bookmarkedMatchIds: ['match_cricket_1', 'match_football_1'],
  bookmarkedHighlightIds: ['hl_1', 'hl_2'],
  notificationsEnabled: true,
  scoreAlerts: true,
};

// -------------------------------------------------------------
// MONGODB STORAGE & IN-MEMORY MONGO-COMPATIBLE FALLBACK ENGINE
// -------------------------------------------------------------
class MongoCollectionWrapper<T extends Record<string, any>> {
  name: string;
  items: T[];

  constructor(name: string, initialItems: T[]) {
    this.name = name;
    this.items = [...initialItems];
  }

  async find(query?: Partial<Record<string, any>>): Promise<T[]> {
    if (!query || Object.keys(query).length === 0) return [...this.items];
    return this.items.filter((item) => {
      for (const key of Object.keys(query)) {
        if ((item as any)[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query: Partial<Record<string, any>>): Promise<T | null> {
    const list = await this.find(query);
    return list[0] || null;
  }

  async insertOne(doc: T): Promise<T> {
    this.items.push(doc);
    return doc;
  }

  async updateOne(query: Partial<Record<string, any>>, update: Partial<T>): Promise<boolean> {
    const index = this.items.findIndex((item) => {
      for (const key of Object.keys(query)) {
        if ((item as any)[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...update };
      return true;
    }
    return false;
  }

  async deleteOne(query: Partial<Record<string, any>>): Promise<boolean> {
    const index = this.items.findIndex((item) => {
      for (const key of Object.keys(query)) {
        if ((item as any)[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  async countDocuments(): Promise<number> {
    return this.items.length;
  }
}

// In-Memory Database Collections with MongoDB query semantics
const memoryDb = {
  tournaments: new MongoCollectionWrapper<Tournament>('tournaments', seedTournaments),
  matches: new MongoCollectionWrapper<Match>('matches', seedMatches),
  standings: new MongoCollectionWrapper<StandingRow>('standings', seedStandings),
  statistics: new MongoCollectionWrapper<StatLeader>('statistics', seedStatLeaders),
  players: new MongoCollectionWrapper<Player>('players', seedPlayers),
  teams: new MongoCollectionWrapper<Team>('teams', seedTeams),
  updates: new MongoCollectionWrapper<SportsNewsUpdate>('updates', seedNewsUpdates),
  highlights: new MongoCollectionWrapper<MatchHighlight>('highlights', seedHighlights),
};

let realDb: Db | null = null;

async function initMongo() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 2000 });
      await client.connect();
      realDb = client.db();
      console.log('Successfully connected to MongoDB server');

      // Check if data seeded, if not seed it
      const count = await realDb.collection('matches').countDocuments();
      if (count === 0) {
        await realDb.collection('tournaments').insertMany(seedTournaments as any);
        await realDb.collection('matches').insertMany(seedMatches as any);
        await realDb.collection('standings').insertMany(seedStandings as any);
        await realDb.collection('statistics').insertMany(seedStatLeaders as any);
        await realDb.collection('players').insertMany(seedPlayers as any);
        await realDb.collection('teams').insertMany(seedTeams as any);
        await realDb.collection('updates').insertMany(seedNewsUpdates as any);
        await realDb.collection('highlights').insertMany(seedHighlights as any);
        console.log('MongoDB initialized with complete sports seed collections');
      }
    } catch (err: any) {
      console.warn('MongoDB connection note: Using high-performance embedded MongoDB engine:', err.message);
    }
  } else {
    console.log('Embedded MongoDB engine active with complete sports data store.');
  }
}

initMongo();

// Helper to access collections
async function getCollection<T extends Record<string, any>>(name: keyof typeof memoryDb) {
  if (realDb) {
    const col = realDb.collection(name);
    return {
      find: async (query?: any) => (await col.find(query || {}).toArray()) as unknown as T[],
      findOne: async (query: any) => (await col.findOne(query)) as unknown as T | null,
      insertOne: async (doc: T) => {
        await col.insertOne(doc as any);
        return doc;
      },
      updateOne: async (query: any, update: any) => {
        await col.updateOne(query, { $set: update });
        return true;
      },
      deleteOne: async (query: any) => {
        await col.deleteOne(query);
        return true;
      },
    };
  }
  return memoryDb[name] as unknown as MongoCollectionWrapper<T>;
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Health check & MongoDB status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: realDb ? 'MongoDB Connected' : 'Embedded MongoDB Engine Active',
    aiFeatures: 'None (Pure Sports Logic)',
    timestamp: new Date().toISOString(),
  });
});

// Sport categories
app.get('/api/sports', (req, res) => {
  const sports: { id: SportType; name: string; icon: string; liveCount: number }[] = [
    { id: 'all', name: 'All Sports', icon: 'Trophy', liveCount: 4 },
    { id: 'football', name: 'Football', icon: 'CircleDot', liveCount: 2 },
    { id: 'cricket', name: 'Cricket', icon: 'Flame', liveCount: 2 },
    { id: 'basketball', name: 'Basketball', icon: 'Dribbble', liveCount: 1 },
    { id: 'tennis', name: 'Tennis', icon: 'Activity', liveCount: 1 },
    { id: 'formula1', name: 'Formula 1', icon: 'Gauge', liveCount: 0 },
  ];
  res.json(sports);
});

// Live Scores Quick Ticker
app.get('/api/live-scores', async (req, res) => {
  const matchesCol = await getCollection<Match>('matches');
  const allMatches = await matchesCol.find();
  const liveMatches = allMatches.filter((m) => m.status === 'live');
  res.json(liveMatches);
});

// Matches list with sport, status, search, and tournament filters
app.get('/api/matches', async (req, res) => {
  try {
    const { sport, status, tournamentId, q } = req.query;
    const matchesCol = await getCollection<Match>('matches');
    let matches = await matchesCol.find();

    if (sport && sport !== 'all') {
      matches = matches.filter((m) => m.sport === sport);
    }
    if (status) {
      matches = matches.filter((m) => m.status === status);
    }
    if (tournamentId) {
      matches = matches.filter((m) => m.tournamentId === tournamentId);
    }
    if (q) {
      const term = (q as string).toLowerCase();
      matches = matches.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(term) ||
          m.awayTeam.name.toLowerCase().includes(term) ||
          m.tournamentName.toLowerCase().includes(term) ||
          m.venue.toLowerCase().includes(term)
      );
    }

    res.json(matches);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single Match details
app.get('/api/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const matchesCol = await getCollection<Match>('matches');
    const match = await matchesCol.findOne({ id });
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Live Match Score Simulator (Simulates real-time live events for demonstration)
app.post('/api/matches/:id/simulate-live', async (req, res) => {
  try {
    const { id } = req.params;
    const matchesCol = await getCollection<Match>('matches');
    const match = await matchesCol.findOne({ id });

    if (!match || match.status !== 'live') {
      return res.status(400).json({ error: 'Active live match not found' });
    }

    // Dynamic increment based on sport
    if (match.sport === 'cricket') {
      const runs = [1, 2, 4, 6, 0][Math.floor(Math.random() * 5)];
      const currentScore = String(match.score.homeScore);
      const parts = currentScore.split('/');
      const runsTotal = parseInt(parts[0] || '182', 10) + runs;
      const wickets = parts[1] || '4';
      match.score.homeScore = `${runsTotal}/${wickets}`;
      match.score.periodOrOvers = '19.4 ov';
      match.score.summaryNote = `CSK need ${Math.max(0, 186 - runsTotal)} runs to win`;
      if (match.events) {
        match.events.unshift({
          time: '19.4',
          type: runs >= 4 ? 'boundary' : 'comment',
          player: 'Ravindra Jadeja',
          description: `${runs === 4 ? 'FOUR!' : runs === 6 ? 'SIX!' : `${runs} runs.`} Jadeja moves the scoreboard rapidly.`,
        });
      }
    } else if (match.sport === 'football') {
      match.score.homeScore = Number(match.score.homeScore) + 1;
      match.score.periodOrOvers = "78'";
      if (match.events) {
        match.events.unshift({
          time: "78'",
          type: 'goal',
          player: 'Federico Valverde',
          description: 'GOAL! Bullet strike from 25 yards out rattles the crossbar and bounces in!',
        });
      }
    } else if (match.sport === 'basketball') {
      match.score.homeScore = Number(match.score.homeScore) + 2;
      match.score.periodOrOvers = 'Q4 01:12';
      if (match.events) {
        match.events.unshift({
          time: '01:12',
          type: 'basket',
          player: 'Jaylen Brown',
          description: 'Driving layup contested at the rim!',
        });
      }
    }

    await matchesCol.updateOne({ id }, match);
    res.json({ success: true, match });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tournaments list
app.get('/api/tournaments', async (req, res) => {
  try {
    const { sport } = req.query;
    const tourCol = await getCollection<Tournament>('tournaments');
    let tournaments = await tourCol.find();
    if (sport && sport !== 'all') {
      tournaments = tournaments.filter((t) => t.sport === sport);
    }
    res.json(tournaments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tournament details
app.get('/api/tournaments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tourCol = await getCollection<Tournament>('tournaments');
    const tournament = await tourCol.findOne({ id });
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    const matchesCol = await getCollection<Match>('matches');
    const matches = await matchesCol.find({ tournamentId: id });
    const standingsCol = await getCollection<StandingRow>('standings');
    const standings = await standingsCol.find({ tournamentId: id });

    res.json({ tournament, matches, standings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Standings / Points Table
app.get('/api/standings', async (req, res) => {
  try {
    const { sport, tournamentId } = req.query;
    const standingsCol = await getCollection<StandingRow>('standings');
    let rows = await standingsCol.find();

    if (tournamentId) {
      rows = rows.filter((r) => r.tournamentId === tournamentId);
    } else if (sport && sport !== 'all') {
      rows = rows.filter((r) => r.sport === sport);
    }

    // Sort by points descending, then position ascending
    rows.sort((a, b) => (b.points !== a.points ? b.points - a.points : a.position - b.position));

    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Statistics Leaders
app.get('/api/statistics', async (req, res) => {
  try {
    const { sport, category } = req.query;
    const statsCol = await getCollection<StatLeader>('statistics');
    let stats = await statsCol.find();

    if (sport && sport !== 'all') {
      stats = stats.filter((s) => s.sport === sport);
    }
    if (category) {
      stats = stats.filter((s) => s.category.toLowerCase().includes((category as string).toLowerCase()));
    }

    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Teams list & single
app.get('/api/teams', async (req, res) => {
  try {
    const { sport, search } = req.query;
    const teamsCol = await getCollection<Team>('teams');
    let teams = await teamsCol.find();

    if (sport && sport !== 'all') {
      teams = teams.filter((t) => t.sport === sport);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      teams = teams.filter((t) => t.name.toLowerCase().includes(q) || t.country.toLowerCase().includes(q));
    }

    res.json(teams);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teamsCol = await getCollection<Team>('teams');
    const team = await teamsCol.findOne({ id });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    const matchesCol = await getCollection<Match>('matches');
    const teamMatches = (await matchesCol.find()).filter(
      (m) => m.homeTeam.id === id || m.awayTeam.id === id
    );
    res.json({ ...team, recentMatches: teamMatches });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Players list & single
app.get('/api/players', async (req, res) => {
  try {
    const { sport, teamId, search } = req.query;
    const playersCol = await getCollection<Player>('players');
    let players = await playersCol.find();

    if (sport && sport !== 'all') {
      players = players.filter((p) => p.sport === sport);
    }
    if (teamId) {
      players = players.filter((p) => p.teamId === teamId);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      players = players.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nationality.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q)
      );
    }

    res.json(players);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const playersCol = await getCollection<Player>('players');
    const player = await playersCol.findOne({ id });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// News Updates
app.get('/api/updates', async (req, res) => {
  try {
    const { sport, category, search } = req.query;
    const updatesCol = await getCollection<SportsNewsUpdate>('updates');
    let updates = await updatesCol.find();

    if (sport && sport !== 'all') {
      updates = updates.filter((u) => u.sport === sport);
    }
    if (category) {
      updates = updates.filter((u) => u.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (search) {
      const q = (search as string).toLowerCase();
      updates = updates.filter(
        (u) => u.title.toLowerCase().includes(q) || u.summary.toLowerCase().includes(q)
      );
    }

    res.json(updates);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Match Highlights
app.get('/api/highlights', async (req, res) => {
  try {
    const { sport, matchId } = req.query;
    const hlCol = await getCollection<MatchHighlight>('highlights');
    let highlights = await hlCol.find();

    if (sport && sport !== 'all') {
      highlights = highlights.filter((h) => h.sport === sport);
    }
    if (matchId) {
      highlights = highlights.filter((h) => h.matchId === matchId);
    }

    res.json(highlights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Global Search (player/match/updates/teams)
app.get('/api/search', async (req, res) => {
  try {
    const q = ((req.query.q as string) || '').trim().toLowerCase();
    if (!q) {
      return res.json({ players: [], matches: [], teams: [], updates: [] });
    }

    const [playersCol, matchesCol, teamsCol, updatesCol] = await Promise.all([
      getCollection<Player>('players'),
      getCollection<Match>('matches'),
      getCollection<Team>('teams'),
      getCollection<SportsNewsUpdate>('updates'),
    ]);

    const [allPlayers, allMatches, allTeams, allUpdates] = await Promise.all([
      playersCol.find(),
      matchesCol.find(),
      teamsCol.find(),
      updatesCol.find(),
    ]);

    const players = allPlayers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.teamName.toLowerCase().includes(q)
    );

    const matches = allMatches.filter(
      (m) =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.tournamentName.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q)
    );

    const teams = allTeams.filter(
      (t) => t.name.toLowerCase().includes(q) || t.country.toLowerCase().includes(q)
    );

    const updates = allUpdates.filter(
      (u) => u.title.toLowerCase().includes(q) || u.summary.toLowerCase().includes(q)
    );

    res.json({ players, matches, teams, updates });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// User Profile
app.get('/api/user/profile', (req, res) => {
  res.json(currentUserProfile);
});

app.put('/api/user/profile', (req, res) => {
  try {
    const { name, email, avatar, favoriteSports, followedTeamIds, notificationsEnabled, scoreAlerts } = req.body;
    if (name !== undefined) currentUserProfile.name = name;
    if (email !== undefined) currentUserProfile.email = email;
    if (avatar !== undefined) currentUserProfile.avatar = avatar;
    if (favoriteSports !== undefined) currentUserProfile.favoriteSports = favoriteSports;
    if (followedTeamIds !== undefined) currentUserProfile.followedTeamIds = followedTeamIds;
    if (notificationsEnabled !== undefined) currentUserProfile.notificationsEnabled = !!notificationsEnabled;
    if (scoreAlerts !== undefined) currentUserProfile.scoreAlerts = !!scoreAlerts;

    res.json(currentUserProfile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Bookmark toggle
app.post('/api/user/bookmark', (req, res) => {
  try {
    const { type, id } = req.body; // type: 'match' | 'highlight'
    if (type === 'match') {
      if (currentUserProfile.bookmarkedMatchIds.includes(id)) {
        currentUserProfile.bookmarkedMatchIds = currentUserProfile.bookmarkedMatchIds.filter((item) => item !== id);
      } else {
        currentUserProfile.bookmarkedMatchIds.push(id);
      }
    } else if (type === 'highlight') {
      if (currentUserProfile.bookmarkedHighlightIds.includes(id)) {
        currentUserProfile.bookmarkedHighlightIds = currentUserProfile.bookmarkedHighlightIds.filter((item) => item !== id);
      } else {
        currentUserProfile.bookmarkedHighlightIds.push(id);
      }
    }
    res.json(currentUserProfile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SportsZone server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
