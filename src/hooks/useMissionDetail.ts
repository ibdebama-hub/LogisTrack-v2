'use client';

import { useState } from 'react';
import {
  transitionMissionStatus,
  createMissionIncident,
  postMissionComment
} from '../lib/services/missionService';
import {
  Mission,
  MissionStatus,
  IncidentType,
  IncidentSeverity,
  MissionHistoryEntry,
  MissionIncident,
  MissionComment
} from '../types/mission';

export function useMissionDetail(initialMission: Mission | null) {
  const [mission, setMission] = useState<Mission | null>(initialMission);

  const changeStatus = async (newStatus: MissionStatus, commentText: string = '') => {
    if (!mission) return;

    const newHistoryEntry: MissionHistoryEntry = {
      id: `h-${Date.now()}`,
      mission_id: mission.id,
      previous_status: mission.status,
      new_status: newStatus,
      user_name: 'Yves Touré (Dispatcher)',
      action_title: `Changement de statut en ${newStatus}`,
      comment: commentText,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setMission((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            history: [newHistoryEntry, ...(prev.history || [])]
          }
        : null
    );

    await transitionMissionStatus(mission.id, newStatus, 'Yves Touré (Dispatcher)', commentText);
  };

  const addIncident = async (type: IncidentType, severity: IncidentSeverity, description: string) => {
    if (!mission) return;

    const newIncident: MissionIncident = {
      id: `inc-${Date.now()}`,
      mission_id: mission.id,
      incident_type: type,
      severity,
      reported_by_name: 'Yves Touré (Dispatcher)',
      description,
      status: 'OPEN',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setMission((prev) =>
      prev
        ? {
            ...prev,
            incidents: [newIncident, ...(prev.incidents || [])]
          }
        : null
    );

    await createMissionIncident(mission.id, type, severity, description);
  };

  const addComment = async (text: string) => {
    if (!mission || !text.trim()) return;

    const newComment: MissionComment = {
      id: `com-${Date.now()}`,
      mission_id: mission.id,
      author_role: 'DISPATCHER',
      author_name: 'Yves Touré',
      comment_text: text,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setMission((prev) =>
      prev
        ? {
            ...prev,
            comments: [newComment, ...(prev.comments || [])]
          }
        : null
    );

    await postMissionComment(mission.id, 'DISPATCHER', 'Yves Touré', text);
  };

  return {
    mission,
    setMission,
    changeStatus,
    addIncident,
    addComment
  };
}
