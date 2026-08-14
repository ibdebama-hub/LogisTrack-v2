'use client';

import React from 'react';
import MasterAdminLayout from '../../components/layout/MasterAdminLayout';

export default function MasterAdminRouteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <MasterAdminLayout>{children}</MasterAdminLayout>;
}
