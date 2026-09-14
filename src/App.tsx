import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LiveTicker } from './components/LiveTicker';
import { HomeView } from './components/views/HomeView';
import { LiveScoreView } from './components/views/LiveScoreView';
import { FixturesView } from './components/views/FixturesView';
import { TournamentsView } from './components/views/TournamentsView';
import { StandingsView } from './components/views/StandingsView';
import { StatisticsView } from './components/views/StatisticsView';
import { TeamsPlayersView } from './components/views/TeamsPlayersView';
import { UpdatesView } from './components/views/UpdatesView';
import { HighlightsView } from './components/views/HighlightsView';

// Modals
import { MatchDetailModal } from './components/MatchDetailModal';
import { SearchModal } from './components/SearchModal';
import { UserProfileModal } from './components/UserProfileModal';
import { HighlightModal } from './components/HighlightModal';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { UpdateDetailModal } from './components/UpdateDetailModal';

import { api } from './services/api';
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
} from './types';
import { Loader2, Database, ShieldCheck, Trophy, Sparkles, RefreshCw } from 'lucide-react';

const defaultUserProfile: UserProfile = {
  id: 'fan_1',
  name: 'Alex Johnson',
  email: 'alex.sports@sportszone.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  favoriteSports: ['football', 'cricket', 'basketball'],
  followedTeamIds: ['rcb_1', 'arsenal_1'],
  notificationsEnabled: true,
  scoreAlerts: true,
  bookmarkedMatchIds: ['match_1'],
  bookmarkedHighlightIds: ['hl_1'],
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedSport, setSelectedSport] = useState<SportType>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<string>('connected');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data States
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [stats, setStats] = useState<StatLeader[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [updates, setUpdates] = useState<SportsNewsUpdate[]>([]);
  const [highlights, setHighlights] = useState<MatchHighlight[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeMatchModal, setActiveMatchModal] = useState<Match | null>(null);
  const [activeHighlightModal, setActiveHighlightModal] = useState<MatchHighlight | null>(null);
  const [activePlayerModal, setActivePlayerModal] = useState<Player | null>(null);
  const [activeUpdateModal, setActiveUpdateModal] = useState<SportsNewsUpdate | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch all initial sports platform data
  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        fetchedMatches,
        fetchedTournaments,
        fetchedStandings,
        fetchedStats,
        fetchedTeams,
        fetchedPlayers,
        fetchedUpdates,
        fetchedHighlights,
        fetchedProfile,
      ] = await Promise.all([
        api.getMatches().catch(() => []),
        api.getTournaments().catch(() => []),
        api.getStandings().catch(() => []),
        api.getStats().catch(() => []),
        api.getTeams().catch(() => []),
        api.getPlayers().catch(() => []),
        api.getUpdates().catch(() => []),
        api.getHighlights().catch(() => []),
        api.getUserProfile().catch(() => defaultUserProfile),
      ]);

      setMatches(fetchedMatches);
      setTournaments(fetchedTournaments);
      setStandings(fetchedStandings);
      setStats(fetchedStats);
      setTeams(fetchedTeams);
      setPlayers(fetchedPlayers);
      setUpdates(fetchedUpdates);
      setHighlights(fetchedHighlights);
      setUserProfile(fetchedProfile);
    } catch (err) {
      console.error('Error fetching sports data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Simulate live action (triggers server score tick and reloads live matches)
  const handleSimulateLive = async (targetMatchId?: string) => {
    try {
      const matchToSimulate =
        targetMatchId ||
        matches.find((m) => m.status === 'live')?.id ||
        matches[0]?.id;

      if (!matchToSimulate) return;

      const result = await api.simulateLiveTick(matchToSimulate);
      if (result.success && result.match) {
        // Update local state with latest match score
        setMatches((prev) =>
          prev.map((m) => (m.id === result.match.id ? result.match : m))
        );
        if (activeMatchModal && activeMatchModal.id === result.match.id) {
          setActiveMatchModal(result.match);
        }
        showToast(
          `⚡ Live Action Updated: ${result.match.homeTeam.shortName} vs ${result.match.awayTeam.shortName} (${result.match.score.homeScore} - ${result.match.score.awayScore})`
        );
      }
    } catch (err) {
      console.error('Simulate error:', err);
    }
  };

  // User profile handlers
  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    try {
      const saved = await api.updateUserProfile(updated);
      setUserProfile(saved);
      showToast('Profile preferences updated');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmarkMatch = async (matchId: string) => {
    const isBookmarked = userProfile.bookmarkedMatchIds.includes(matchId);
    const updatedIds = isBookmarked
      ? userProfile.bookmarkedMatchIds.filter((id) => id !== matchId)
      : [...userProfile.bookmarkedMatchIds, matchId];

    await handleUpdateProfile({ bookmarkedMatchIds: updatedIds });
    showToast(isBookmarked ? 'Match removed from saved' : 'Match saved to favorites');
  };

  const handleToggleBookmarkHighlight = async (highlightId: string) => {
    const isBookmarked = userProfile.bookmarkedHighlightIds.includes(highlightId);
    const updatedIds = isBookmarked
      ? userProfile.bookmarkedHighlightIds.filter((id) => id !== highlightId)
      : [...userProfile.bookmarkedHighlightIds, highlightId];

    await handleUpdateProfile({ bookmarkedHighlightIds: updatedIds });
    showToast(isBookmarked ? 'Highlight removed from saved' : 'Highlight saved to bookmarks');
  };

  const liveMatches = matches.filter((m) => m.status === 'live');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-orange-500 text-white text-xs font-semibold shadow-2xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        selectedSport={selectedSport}
        onSelectSport={setSelectedSport}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onSimulateLive={() => handleSimulateLive()}
        liveMatchCount={liveMatches.length}
        dbStatus={dbStatus}
      />

      {/* Top Live Scores Ticker */}
      <LiveTicker
        liveMatches={liveMatches}
        onSelectMatch={(match) => setActiveMatchModal(match)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-3" />
            <p className="text-sm font-semibold text-slate-300">
              Loading SportsZone Pro live scores & data...
            </p>
            <p className="text-xs text-slate-500 mt-1">Connecting to Node.js & MongoDB backend</p>
          </div>
        ) : (
          <>
            {/* HOME VIEW */}
            {currentTab === 'home' && (
              <HomeView
                matches={matches}
                updates={updates}
                standings={standings}
                stats={stats}
                highlights={highlights}
                selectedSport={selectedSport}
                onSelectMatch={(match) => setActiveMatchModal(match)}
                onSelectUpdate={(update) => setActiveUpdateModal(update)}
                onSelectHighlight={(hl) => setActiveHighlightModal(hl)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {/* LIVE SCORES VIEW */}
            {currentTab === 'live' && (
              <LiveScoreView
                matches={matches}
                selectedSport={selectedSport}
                onSimulateLiveAction={handleSimulateLive}
                onSelectMatch={(match) => setActiveMatchModal(match)}
              />
            )}

            {/* FIXTURES & UPCOMING VIEW */}
            {currentTab === 'fixtures' && (
              <FixturesView
                matches={matches}
                selectedSport={selectedSport}
                onSelectMatch={(match) => setActiveMatchModal(match)}
              />
            )}

            {/* TOURNAMENTS VIEW */}
            {currentTab === 'tournaments' && (
              <TournamentsView
                tournaments={tournaments}
                selectedSport={selectedSport}
                onSelectTournament={(tour) => {
                  setCurrentTab('standings');
                }}
              />
            )}

            {/* STANDINGS / POINTS TABLE VIEW */}
            {currentTab === 'standings' && (
              <StandingsView
                standings={standings}
                tournaments={tournaments}
                selectedSport={selectedSport}
              />
            )}

            {/* STATISTICS VIEW */}
            {currentTab === 'statistics' && (
              <StatisticsView
                stats={stats}
                selectedSport={selectedSport}
                onSelectPlayerName={(name) => {
                  const p = players.find((pl) => pl.name === name);
                  if (p) setActivePlayerModal(p);
                }}
              />
            )}

            {/* TEAMS & PLAYERS VIEW */}
            {currentTab === 'teams-players' && (
              <TeamsPlayersView
                teams={teams}
                players={players}
                selectedSport={selectedSport}
                onSelectPlayer={(player) => setActivePlayerModal(player)}
              />
            )}

            {/* UPDATES / NEWS VIEW */}
            {currentTab === 'updates' && (
              <UpdatesView
                updates={updates}
                selectedSport={selectedSport}
                onSelectUpdate={(update) => setActiveUpdateModal(update)}
              />
            )}

            {/* HIGHLIGHTS VIEW */}
            {currentTab === 'highlights' && (
              <HighlightsView
                highlights={highlights}
                selectedSport={selectedSport}
                bookmarkedHighlightIds={userProfile.bookmarkedHighlightIds}
                onToggleBookmark={handleToggleBookmarkHighlight}
                onSelectHighlight={(hl) => setActiveHighlightModal(hl)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xs">
              SZ
            </div>
            <span className="font-bold text-slate-200">SportsZone Pro</span>
            <span>— Full Stack Sports Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB Engine</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>REST API Express Backend</span>
            </span>
          </div>

          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} SportsZone. All real-time scores and statistics.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Match Detail Modal */}
      {activeMatchModal && (
        <MatchDetailModal
          match={activeMatchModal}
          onClose={() => setActiveMatchModal(null)}
          isBookmarked={userProfile.bookmarkedMatchIds.includes(activeMatchModal.id)}
          onToggleBookmark={handleToggleBookmarkMatch}
          onSimulateLive={handleSimulateLive}
        />
      )}

      {/* 2. Unified Search Modal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectPlayer={(p) => setActivePlayerModal(p)}
          onSelectMatch={(m) => setActiveMatchModal(m)}
          onSelectUpdate={(u) => setActiveUpdateModal(u)}
        />
      )}

      {/* 3. User Profile Modal */}
      {isProfileOpen && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          profile={userProfile}
          teams={teams}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* 4. Highlight Modal */}
      {activeHighlightModal && (
        <HighlightModal
          highlight={activeHighlightModal}
          onClose={() => setActiveHighlightModal(null)}
          isBookmarked={userProfile.bookmarkedHighlightIds.includes(activeHighlightModal.id)}
          onToggleBookmark={handleToggleBookmarkHighlight}
        />
      )}

      {/* 5. Player Detail Modal */}
      {activePlayerModal && (
        <PlayerDetailModal
          player={activePlayerModal}
          onClose={() => setActivePlayerModal(null)}
        />
      )}

      {/* 6. Update Detail Modal */}
      {activeUpdateModal && (
        <UpdateDetailModal
          update={activeUpdateModal}
          onClose={() => setActiveUpdateModal(null)}
        />
      )}
    </div>
  );
}
