'use client'

import DetailedDocumentation from './DetailedDocumentation';

export default function TechnicalDocumentation() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Technical Documentation
        </h1>
        <p className="text-muted-foreground">
          Dokumentasi lengkap aplikasi MeritChain untuk AI Hackathon 2025
        </p>
      </div>

      {/* Use DetailedDocumentation component */}
      <DetailedDocumentation />
    </div>
  );
}
