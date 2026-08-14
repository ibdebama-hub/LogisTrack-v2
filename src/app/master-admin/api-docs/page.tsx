'use client';

import React from 'react';
import OpenApiSpecViewer from '../../../components/modules/master-admin/api/OpenApiSpecViewer';

export default function MasterApiDocsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <OpenApiSpecViewer />
    </div>
  );
}
