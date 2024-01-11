import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DealStage = 'Prospecting' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type DealPriority = 'High' | 'Medium' | 'Low';

export interface DealTask {
  id: number;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface DealDocument {
  id: number;
  name: string;
  size: string;
  uploadedAt: string;
}

export interface DealActivity {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: 'stage_change' | 'note' | 'task' | 'email';
}

export interface Deal {
  id: number;
  title: string;
  companyName: string;
  contactName: string;
  value: number;
  stage: DealStage;
  probability: number; // Percentage (e.g. 20, 50, 80, 100, 0)
  expectedCloseDate: string;
  owner: string;
  priority: DealPriority;
  lastActivity: string;
  winLossReason?: string;
  
  // Tab details
  tasks: DealTask[];
  documents: DealDocument[];
  notes: string[];
  timeline: DealActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class DealsService {
  private initialDeals: Deal[] = [
    {
      id: 1,
      title: 'Enterprise CRM Migration',
      companyName: 'Apex Global Systems',
      contactName: 'Sarah Jenkins',
      value: 120000,
      stage: 'Negotiation',
      probability: 80,
      expectedCloseDate: '2026-08-15',
      owner: 'Alex Morgan',
      priority: 'High',
      lastActivity: '1 hour ago',
      tasks: [{ id: 1, title: 'Send final contract draft', dueDate: '2026-08-01', isCompleted: false }],
      documents: [{ id: 1, name: 'SLA_Draft_v2.pdf', size: '1.8 MB', uploadedAt: '2026-07-28' }],
      notes: ['Client requested 5% discount on multi-year terms.'],
      timeline: [{ id: 1, title: 'Moved to Negotiation', description: 'Updated stage after pricing call.', timestamp: '2026-07-28 11:00 AM', type: 'stage_change' }]
    },
    {
      id: 2,
      title: 'Cloud Infrastructure SLA',
      companyName: 'BrightTech Solutions',
      contactName: 'David Chen',
      value: 45000,
      stage: 'Proposal',
      probability: 50,
      expectedCloseDate: '2026-08-30',
      owner: 'Liam O\'Connor',
      priority: 'Medium',
      lastActivity: '3 hours ago',
      tasks: [],
      documents: [{ id: 2, name: 'Proposal_BrightTech.pdf', size: '3.1 MB', uploadedAt: '2026-07-25' }],
      notes: ['Technical team reviewing API integration requirements.'],
      timeline: []
    },
    {
      id: 3,
      title: 'Custom AI Module Integration',
      companyName: 'Vanguard Ltd',
      contactName: 'Elena Rostova',
      value: 85000,
      stage: 'Prospecting',
      probability: 20,
      expectedCloseDate: '2026-09-15',
      owner: 'Sarah Jenkins',
      priority: 'Medium',
      lastActivity: '1 day ago',
      tasks: [],
      documents: [],
      notes: [],
      timeline: []
    },
    {
      id: 4,
      title: 'Annual SaaS Expansion',
      companyName: 'Solaris Systems',
      contactName: 'Emma Watson',
      value: 210000,
      stage: 'Closed Won',
      probability: 100,
      expectedCloseDate: '2026-07-10',
      owner: 'Alex Morgan',
      priority: 'High',
      lastActivity: '2 weeks ago',
      winLossReason: 'Best value proposition and feature set.',
      tasks: [],
      documents: [],
      notes: [],
      timeline: []
    },
    {
      id: 5,
      title: 'Legacy Database Replacement',
      companyName: 'Quantum Corp',
      contactName: 'James Wilson',
      value: 30000,
      stage: 'Closed Lost',
      probability: 0,
      expectedCloseDate: '2026-07-05',
      owner: 'Liam O\'Connor',
      priority: 'Low',
      lastActivity: '3 weeks ago',
      winLossReason: 'Went with competitor due to legacy system lock-in.',
      tasks: [],
      documents: [],
      notes: [],
      timeline: []
    }
  ];

  private dealsSubject = new BehaviorSubject<Deal[]>(this.initialDeals);
  deals$ = this.dealsSubject.asObservable();

 
}