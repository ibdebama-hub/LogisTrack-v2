'use client';

import React from 'react';
import ClientPortalLayout from '../../components/layout/ClientPortalLayout';

export default function ClientPortalRouteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ClientPortalLayout>{children}</ClientPortalLayout>;
}
