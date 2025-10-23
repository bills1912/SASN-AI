'use client'

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Cpu, Server, Activity, CheckCircle, BookOpen, FileText, Target, Zap, Shield, TrendingUp } from 'lucide-react';

export default function SystemInfo() {
  const models = [
    {
      name: 'OpenAI GPT-4',
      purpose: 'Analisis Talenta & Rekomendasi',
      status: 'Active',
      version: 'gpt-4-turbo-preview'
    },
    {
      name: 'Natural Language Processing',
      purpose: 'Text Analysis & Sentiment',
      status: 'Active',
      version: 'v3.2'
    },
    {
      name: 'Machine Learning Model',
      purpose: '9-Box Grid Classification',
      status: 'Active',
      version: 'v2.1'
    },
    {
      name: 'Recommendation Engine',
      purpose: 'Job & Development Recommendations',
      status: 'Active',
      version: 'v1.5'
    }
  ];

  const databases = [
    {
      name: 'MongoDB',
      type: 'NoSQL Database',
      purpose: 'Primary Data Storage',
      status: 'Connected',
      version: '7.0',
      collections: ['profiles', 'talent_analysis', 'performance_data', 'news']
    },
    {
      name: 'Redis Cache',
      type: 'In-Memory Cache',
      purpose: 'Performance Optimization',
      status: 'Connected',
      version: '7.2'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          System Information
        </h1>
        <p className="text-muted-foreground">
          Monitor model AI dan database yang digunakan dalam sistem
        </p>
      </div>

      {/* AI Models Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">AI Models</h2>
            <p className="text-sm text-muted-foreground">Model yang digunakan untuk analisis</p>
          </div>
        </div>

        <div className="space-y-4">
          {models.map((model, index) => (
            <div 
              key={index}
              className="p-4 bg-muted/30 rounded-lg border border-muted hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">{model.name}</h3>
                    <span className="flex items-center text-xs text-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {model.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{model.purpose}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-muted-foreground">
                      Version: <span className="font-mono text-foreground">{model.version}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Database Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Database className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Databases</h2>
            <p className="text-sm text-muted-foreground">Sistem database dan storage</p>
          </div>
        </div>

        <div className="space-y-4">
          {databases.map((db, index) => (
            <div 
              key={index}
              className="p-4 bg-muted/30 rounded-lg border border-muted hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">{db.name}</h3>
                    <span className="flex items-center text-xs text-green-500">
                      <Activity className="w-3 h-3 mr-1" />
                      {db.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{db.purpose}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-muted-foreground">
                      Type: <span className="font-medium text-foreground">{db.type}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Version: <span className="font-mono text-foreground">{db.version}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {db.collections && (
                <div className="mt-3 pt-3 border-t border-muted">
                  <p className="text-xs text-muted-foreground mb-2">Collections:</p>
                  <div className="flex flex-wrap gap-2">
                    {db.collections.map((collection, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-slate-800 text-xs font-mono text-slate-300 rounded"
                      >
                        {collection}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* System Health */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Server className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">System Health</h2>
            <p className="text-sm text-muted-foreground">Status kesehatan sistem</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">API Status</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">Operational</p>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Database</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-500">Connected</p>
          </div>

          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">AI Models</span>
              <Cpu className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-500">Active</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
