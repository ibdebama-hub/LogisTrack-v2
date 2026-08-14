'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchMissionTemplates,
  saveMissionTemplate,
  PRESET_MISSION_TEMPLATES
} from '../lib/services/missionTemplateService';
import { MissionTemplate } from '../types/missionTemplate';

export function useMissionTemplates(organizationId: string = 'tenant-101') {
  const [templates, setTemplates] = useState<MissionTemplate[]>(PRESET_MISSION_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<MissionTemplate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchMissionTemplates(organizationId);
    setTemplates(res);
    if (res.length > 0 && !selectedTemplate) {
      setSelectedTemplate(res[0]);
    }
    setIsLoading(false);
  }, [organizationId, selectedTemplate]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSaveTemplate = async (templateData: Partial<MissionTemplate>) => {
    const updated: MissionTemplate = {
      ...PRESET_MISSION_TEMPLATES[0],
      ...templateData,
      id: templateData.id || `tpl-${Date.now()}`
    };

    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });

    setSelectedTemplate(updated);
    await saveMissionTemplate(updated);
  };

  const toggleTemplateActive = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, is_active: !t.is_active } : t))
    );
  };

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    isLoading,
    refreshTemplates: loadTemplates,
    saveTemplate: handleSaveTemplate,
    toggleTemplateActive
  };
}
