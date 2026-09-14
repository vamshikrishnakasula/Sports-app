import React, { useState } from 'react';
import { UserProfile, SportType, Team } from '../types';
import { X, User, Bell, Bookmark, Check, Shield, Trophy } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  teams: Team[];
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  teams,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [favoriteSports, setFavoriteSports] = useState<SportType[]>(profile.favoriteSports);
  const [followedTeamIds, setFollowedTeamIds] = useState<string[]>(profile.followedTeamIds);
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile.notificationsEnabled);
  const [scoreAlerts, setScoreAlerts] = useState(profile.scoreAlerts);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const allSports: { id: SportType; label: string }[] = [
    { id: 'football', label: 'Football' },
    { id: 'cricket', label: 'Cricket' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'formula1', label: 'Formula 1' },
  ];

  const toggleSport = (sport: SportType) => {
    if (favoriteSports.includes(sport)) {
      setFavoriteSports(favoriteSports.filter((s) => s !== sport));
    } else {
      setFavoriteSports([...favoriteSports, sport]);
    }
  };

  const toggleTeam = (teamId: string) => {
    if (followedTeamIds.includes(teamId)) {
      setFollowedTeamIds(followedTeamIds.filter((id) => id !== teamId));
    } else {
      setFollowedTeamIds([...followedTeamIds, teamId]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        name,
        email,
        favoriteSports,
        followedTeamIds,
        notificationsEnabled,
        scoreAlerts,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Sports Fan Profile</h3>
              <p className="text-xs text-slate-400">Personalize your feed, followed clubs and alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Account Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Favorite Sports */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Favorite Sports
            </h4>
            <div className="flex flex-wrap gap-2">
              {allSports.map((s) => {
                const isSelected = favoriteSports.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleSport(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-orange-600 border-orange-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Followed Teams */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Followed Teams & Clubs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teams.map((t) => {
                const isFollowed = followedTeamIds.includes(t.id);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => toggleTeam(t.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition text-xs cursor-pointer ${
                      isFollowed
                        ? 'bg-slate-800 border-orange-500 text-white'
                        : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={t.logo} alt="" className="w-5 h-5 rounded object-cover" />
                      <span className="font-semibold">{t.name}</span>
                    </div>
                    {isFollowed && <Check className="w-4 h-4 text-orange-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications and Alerts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-orange-400" />
              Notifications & Alerts
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-200 block">Live Score Alerts</span>
                  <span className="text-[11px] text-slate-400">
                    Get notifications when goals, boundaries, or wickets fall in followed matches.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={scoreAlerts}
                  onChange={(e) => setScoreAlerts(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-200 block">Breaking News Bulletins</span>
                  <span className="text-[11px] text-slate-400">
                    Receive urgent sports news and team transfer alerts.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Saved Items Counter */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-orange-400" />
              <span>Bookmarked Content</span>
            </span>
            <span>
              {profile.bookmarkedMatchIds.length} Matches • {profile.bookmarkedHighlightIds.length} Highlights
            </span>
          </div>

          {/* Footer Save Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-lg shadow-orange-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
