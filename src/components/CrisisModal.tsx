import React from 'react';
import { Phone, HeartHandshake, X, ExternalLink, ShieldAlert } from 'lucide-react';
import { CrisisResource } from '../types';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const crisisResources: CrisisResource[] = [
  {
    name: 'Suicide & Crisis Lifeline',
    phone: '988',
    sms: 'Text 988',
    website: 'https://988lifeline.org',
    availableHours: '24/7, Free & Confidential',
    description: 'Immediate crisis support for distress, panic, or self-harm concerns in the United States and Canada.',
    region: 'United States & Canada',
  },
  {
    name: 'NHS Mental Health Services & SHOUT',
    phone: '111',
    sms: 'Text SHOUT to 85258',
    website: 'https://giveusashout.org',
    availableHours: '24/7, Free & Confidential',
    description: 'Immediate mental health triage and text-based crisis volunteer counseling in the United Kingdom.',
    region: 'United Kingdom',
  },
  {
    name: 'Tele-MANAS & Sneha India',
    phone: '14416 or 044-24640050',
    website: 'https://telemanas.mohfw.gov.in',
    availableHours: '24/7, Free Toll-free Support',
    description: 'National tele-mental health programme of India offering compassionate emotional counseling in multiple languages.',
    region: 'India',
  },
  {
    name: 'Lifeline Australia',
    phone: '13 11 14',
    sms: 'Text 0477 13 11 14',
    website: 'https://www.lifeline.org.au',
    availableHours: '24/7, Free & Confidential',
    description: 'National charity providing all Australians experiencing emotional distress with crisis support.',
    region: 'Australia',
  },
  {
    name: 'Befrienders Worldwide & Find A Helpline',
    phone: 'Local Emergency (112 / 911 / 999)',
    website: 'https://findahelpline.com',
    availableHours: 'Worldwide Directory',
    description: 'Free, confidential support from a local crisis center in over 130 countries.',
    region: 'International',
  },
];

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div
        id="crisis-modal-card"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-6 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-serif">Crisis & Immediate Support Resources</h2>
              <p className="text-sm text-stone-600 mt-1">
                If you are in acute danger or experiencing overwhelming thoughts of self-harm, please reach out to trained compassionate professionals immediately. You are not alone.
              </p>
            </div>
          </div>
          <button
            id="close-crisis-modal-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick grounding reminder */}
        <div className="bg-amber-50/80 px-6 py-3 border-b border-amber-100 flex items-center space-x-3 text-xs text-amber-900">
          <HeartHandshake className="w-4 h-4 shrink-0 text-amber-700" />
          <span>
            <strong>Right here, right now:</strong> Place one hand flat over your chest. Feel your heart beating. Take a long, gentle exhale. Help is available and waiting for you.
          </span>
        </div>

        {/* Lifeline List */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-stone-100">
          {crisisResources.map((item, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md mb-1">
                    {item.region}
                  </span>
                  <h3 className="font-semibold text-stone-900 text-base">{item.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {item.phone}</span>
                  </a>
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Web</span>
                    </a>
                  )}
                </div>
              </div>
              <p className="text-xs text-stone-600 mt-2">{item.description}</p>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-stone-500">
                <span>🕒 {item.availableHours}</span>
                {item.sms && <span>💬 {item.sms}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between text-xs text-stone-500">
          <span>MindEase is an AI supportive tool, not a substitute for clinical or emergency psychiatric care.</span>
          <button
            id="dismiss-crisis-modal-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium transition-colors"
          >
            I am safe / Close
          </button>
        </div>
      </div>
    </div>
  );
};
