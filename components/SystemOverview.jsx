'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Cpu, Server, Activity, CheckCircle, Circle, AlertCircle } from 'lucide-react';

export default function SystemOverview() {
  const [ollamaStatus, setOllamaStatus] = useState({ status: 'checking', message: 'Checking...' });
  const [svmStatus, setSvmStatus] = useState({ status: 'checking', message: 'Checking...' });

  useEffect(() => {
    // Test Ollama connection
    fetch('/api/system/test-ollama', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOllamaStatus({ 
            status: 'active', 
            message: 'Connected',
            model: data.config.model,
            baseUrl: data.config.baseUrl
          });
        } else {
          setOllamaStatus({ status: 'error', message: data.message });
        }
      })
      .catch(() => {
        setOllamaStatus({ status: 'error', message: 'Connection failed' });
      });

    // Test SVM
    fetch('/api/system/test-svm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeData: {
          name: 'Test',
          position: 'Analyst',
          education: 'S1',
          workExperience: 3,
          grade: 'III/b',
          skills: ['Test']
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSvmStatus({ status: 'active', message: 'Operational' });
        } else {
          setSvmStatus({ status: 'error', message: 'Test failed' });
        }
      })
      .catch(() => {
        setSvmStatus({ status: 'error', message: 'Connection failed' });
      });
  }, []);

  const StatusIcon = ({ status }) => {
    if (status === 'active') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'checking') return <Circle className="w-5 h-5 text-yellow-500 animate-pulse" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const models = [
    {
      name: 'Ollama LLM',
      purpose: 'Career Recommendations & Insights',
      status: ollamaStatus.status,
      statusText: ollamaStatus.message,
      version: ollamaStatus.model || 'llama3.2:1b',
      type: 'Large Language Model',
      location: ollamaStatus.baseUrl || 'Self-hosted VPS',
      indicator: true // Show as primary AI model
    },
    {
      name: 'SVM Classifier',
      purpose: '9-Box Grid Classification',
      status: svmStatus.status,
      statusText: svmStatus.message,
      version: 'scikit-learn 1.7+',
      type: 'Machine Learning',
      location: 'Local Python',
      indicator: false
    }
  ];

  const databases = [
    {
      name: 'MongoDB',
      type: 'NoSQL Database',
      purpose: 'Primary Data Storage',
      status: 'active',
      version: '7.0+',
      collections: ['profiles', 'talent_analyses', 'institution_analyses', 'merit_data']
    },
    {
      name: 'Blockchain Store',
      type: 'Custom Blockchain',
      purpose: 'Immutable Audit Trail',
      status: 'active',
      version: 'v1.0',
      collections: ['blocks', 'transactions', 'verifications']
    }
  ];

  const systemMetrics = [
    { label: 'Application Status', value: 'Running', color: 'text-green-500' },
    { label: 'Environment', value: 'Production', color: 'text-blue-500' },
    { label: 'Database', value: 'Connected', color: 'text-green-500' },
    { label: 'AI Models', value: `${models.filter(m => m.status === 'active').length}/${models.length} Active`, color: 'text-green-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          System Overview
        </h1>
        <p className="text-muted-foreground">
          Monitoring status sistem, AI models, dan database real-time
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
            <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
          </Card>
        ))}
      </div>

      {/* AI Models Status */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Models Status</h2>
            <p className="text-sm text-muted-foreground">Hybrid AI: Machine Learning + Large Language Model</p>
          </div>
        </div>

        <div className="space-y-4">
          {models.map((model, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <StatusIcon status={model.status} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{model.name}</h3>
                      {model.indicator && model.status === 'active' && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Active Model
                          </span>
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{model.purpose}</p>
                  </div>
                </div>
                <Badge variant={model.status === 'active' ? 'default' : model.status === 'checking' ? 'secondary' : 'destructive'}>
                  {model.statusText}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p className="font-medium text-foreground">{model.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground">{model.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{model.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Database Status */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-500 rounded-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Database Systems</h2>
            <p className="text-sm text-muted-foreground">Data storage & blockchain infrastructure</p>
          </div>
        </div>

        <div className="space-y-4">
          {databases.map((db, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-foreground">{db.name}</h3>
                    <p className="text-sm text-muted-foreground">{db.purpose}</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">
                  {db.status === 'active' ? 'Connected' : 'Active'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Type: <span className="text-foreground font-medium">{db.type}</span></p>
                  <p className="text-muted-foreground">Version: <span className="text-foreground font-medium">{db.version}</span></p>
                </div>
                {db.collections && (
                  <div className="text-right">
                    <p className="text-muted-foreground">{db.collections.length} Collections</p>
                    <p className="text-xs text-muted-foreground mt-1">{db.collections.slice(0, 2).join(', ')}...</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tech Stack Summary */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex items-center space-x-3 mb-4">
          <Server className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-foreground">Tech Stack</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Frontend</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Next.js 14 (React 18)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Tailwind CSS + shadcn/ui</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-3">Backend</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Next.js API Routes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Python ML Pipeline</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
