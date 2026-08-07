import React from 'react';
import OperationalMapCenter from '@/components/modules/maps/OperationalMapCenter';

export const metadata = {
  title: 'Centre de Supervision Cartographique — LogisTrack V2',
  description: 'Supervision opérationnelle en temps réel des agents, missions, zones et incidents'
};

export default function OperationalMapPage() {
  return <OperationalMapCenter />;
}
