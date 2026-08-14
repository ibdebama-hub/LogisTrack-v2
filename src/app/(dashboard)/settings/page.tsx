'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Building, MessageSquare, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import OrganizationSettings from '../../../components/modules/settings/OrganizationSettings';
import SmsGatewayConfig from '../../../components/modules/settings/SmsGatewayConfig';
import UserRolesManagement from '../../../components/modules/settings/UserRolesManagement';
import InviteUserModal from '../../../components/modules/settings/InviteUserModal';
import {
  MOCK_ORGANIZATION_PROFILE,
  MOCK_SMS_GATEWAYS,
  MOCK_SMS_TEMPLATES,
  MOCK_SYSTEM_USERS
} from '../../../lib/mockSettingsData';
import {
  OrganizationProfile,
  SmsGatewayConfigModel,
  SmsTemplate,
  SystemUser
} from '../../../types/settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'org' | 'sms' | 'users'>('org');

  const [orgProfile, setOrgProfile] = useState<OrganizationProfile>(MOCK_ORGANIZATION_PROFILE);
  const [gateways, setGateways] = useState<SmsGatewayConfigModel[]>(MOCK_SMS_GATEWAYS);
  const [templates, setTemplates] = useState<SmsTemplate[]>(MOCK_SMS_TEMPLATES);
  const [users, setUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('logistrack_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.company_name) {
          setOrgProfile(prev => ({
            ...prev,
            company_name: parsed.company_name
          }));
        }
        if (parsed.full_name) {
          setUsers(prev => [
            {
              id: 'user-active',
              full_name: parsed.full_name,
              email: parsed.email || 'admin@gks-logistics.gn',
              phone: '+224 620 00 00 00',
              role: parsed.role || 'DISPATCHER',
              status: 'ACTIF',
              last_login: 'Maintenant',
              zone_assigned: 'Siège Social'
            },
            ...prev
          ]);
        }
      }
    } catch (e) {}
  }, []);

  // Toggle user status
  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIF' ? 'SUSPENDU' : 'ACTIF' }
          : u
      )
    );
  };

  // Add new invited user
  const handleInviteUser = (newUser: Partial<SystemUser>) => {
    const userToAdd: SystemUser = {
      id: `user-${Date.now()}`,
      full_name: newUser.full_name || 'Collaborateur',
      email: newUser.email || '',
      phone: newUser.phone || '',
      role: newUser.role || 'DISPATCHER',
      status: 'ACTIF',
      last_login: 'Invitation envoyée',
      zone_assigned: newUser.zone_assigned || 'Siège'
    };

    setUsers([userToAdd, ...users]);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <Settings className="w-3 h-3 text-indigo-400" /> CENTRE DE CONFIGURATION & SMS
            </span>
            <span className="text-slate-500 text-xs font-mono">• Administrateur Général</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Paramètres Système & Intégrations APIs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gestion du profil de l'organisation, intégrations passerelles SMS/OTP, gabarits de notification et habilitations RBAC.
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('org')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'org'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Organisation</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'sms'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Passerelles SMS & OTP</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Utilisateurs & Droits</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ORGANIZATION SETTINGS */}
      {activeTab === 'org' && (
        <OrganizationSettings
          profile={orgProfile}
          onSaveProfile={updated => setOrgProfile(updated)}
        />
      )}

      {/* TAB 2: SMS & OTP GATEWAYS CONFIG */}
      {activeTab === 'sms' && (
        <SmsGatewayConfig
          gateways={gateways}
          templates={templates}
          onSaveGateways={updated => setGateways(updated)}
          onSaveTemplates={updated => setTemplates(updated)}
        />
      )}

      {/* TAB 3: USER ROLES MANAGEMENT */}
      {activeTab === 'users' && (
        <UserRolesManagement
          users={users}
          onToggleUserStatus={handleToggleUserStatus}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
        />
      )}

      {/* INVITE USER MODAL */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
    </div>
  );
}
