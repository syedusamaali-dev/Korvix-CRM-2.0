import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type DealStage = 
  | 'Prospecting' 
  | 'Qualification' 
  | 'Proposal Sent' 
  | 'Negotiation' 
  | 'Contract Review' 
  | 'Won' 
  | 'Lost';

export type DealPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface DealTask {
  id: number;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface DealNote {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

export interface DealDocument {
  id: number;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export interface DealEmail {
  id: number;
  subject: string;
  sender: string;
  date: string;
  preview: string;
}

export interface DealActivity {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: 'stage_change' | 'email' | 'task' | 'meeting' | 'note';
}

export interface Deal {
  id: number;
  name: string;
  company: string;
  contact: string;
  contactEmail: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number; // Percentage 0 - 100
  closeDate: string;
  owner: string;
  priority: DealPriority;
  source: string;
  description: string;
  isOverdueFollowUp?: boolean;
  tasks: DealTask[];
  notes: DealNote[];
  documents: DealDocument[];
  emails: DealEmail[];
  timeline: DealActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class DealsService {
  private initialDeals: Deal[] = [
    {
      id: 101,
      name: 'Enterprise Cloud Migration',
      company: 'Apex Logistics Corp',
      contact: 'David Miller',
      contactEmail: 'dmiller@apexlogistics.com',
      value: 120000,
      currency: 'USD',
      stage: 'Negotiation',
      probability: 80,
      closeDate: '2026-08-15',
      owner: 'Alex Morgan',
      priority: 'Urgent',
      source: 'Inbound Web',
      description: 'Full migration of on-prem infrastructure to cloud enterprise tier.',
      isOverdueFollowUp: true,
      tasks: [
        { id: 1, title: 'Send revised SLA agreement', dueDate: '2026-07-28', isCompleted: false },
        { id: 2, title: 'Confirm security sign-off', dueDate: '2026-08-01', isCompleted: false }
      ],
      notes: [
        { id: 1, author: 'Alex Morgan', text: 'Client requested a 5% discount on 3-year term.', createdAt: '2026-07-25' }
      ],
      documents: [
        { id: 1, fileName: 'Cloud_Proposal_v2.pdf', fileSize: '2.4 MB', uploadedAt: '2026-07-20' }
      ],
      emails: [
        { id: 1, subject: 'Revised Terms Review', sender: 'dmiller@apexlogistics.com', date: '2026-07-24', preview: 'We reviewed the draft proposal and have two minor questions...' }
      ],
      timeline: [
        { id: 1, title: 'Stage Updated', description: 'Moved from Proposal Sent to Negotiation', timestamp: '2026-07-24 14:20', type: 'stage_change' }
      ]
    },
    {
      id: 102,
      name: 'Global CRM Licensing',
      company: 'Nexus Financials',
      contact: 'Sarah Jenkins',
      contactEmail: 's.jenkins@nexusfin.org',
      value: 85000,
      currency: 'USD',
      stage: 'Proposal Sent',
      probability: 60,
      closeDate: '2026-09-01',
      owner: 'Liam O\'Connor',
      priority: 'High',
      source: 'LinkedIn Lead',
      description: '250 seat licensing deal for global advisory team.',
      tasks: [],
      notes: [],
      documents: [],
      emails: [],
      timeline: []
    },
    {
      id: 103,
      name: 'AI Analytics Add-on',
      company: 'Vanguard Health',
      contact: 'Dr. Robert Chen',
      contactEmail: 'rchen@vanguardhealth.io',
      value: 45000,
      currency: 'USD',
      stage: 'Qualification',
      probability: 30,
      closeDate: '2026-08-30',
      owner: 'Alex Morgan',
      priority: 'Medium',
      source: 'Webinar',
      description: 'Adding predictive analytics module to existing account.',
      tasks: [],
      notes: [],
      documents: [],
      emails: [],
      timeline: []
    },
    {
      id: 104,
      name: 'Custom ERP Integration',
      company: 'Omni Retail Group',
      contact: 'Elena Rostova',
      contactEmail: 'elena@omniretail.com',
      value: 210000,
      currency: 'USD',
      stage: 'Contract Review',
      probability: 90,
      closeDate: '2026-08-05',
      owner: 'Sarah Jenkins',
      priority: 'Urgent',
      source: 'Referral',
      description: 'Complex custom API integration and staff training.',
      tasks: [],
      notes: [],
      documents: [],
      emails: [],
      timeline: []
    },
    {
      id: 105,
      name: 'Security Operations Expansion',
      company: 'CyberShield Systems',
      contact: 'Marcus Vance',
      contactEmail: 'mvance@cybershield.com',
      value: 60000,
      currency: 'USD',
      stage: 'Won',
      probability: 100,
      closeDate: '2026-07-15',
      owner: 'Alex Morgan',
      priority: 'Low',
      source: 'Cold Outreach',
      description: 'Closed annual subscription contract.',
      tasks: [],
      notes: [],
      documents: [],
      emails: [],
      timeline: []
    }
  ];

  private dealsSubject = new BehaviorSubject<Deal[]>(this.initialDeals);
  deals$: Observable<Deal[]> = this.dealsSubject.asObservable();

  updateStage(dealId: number, newStage: DealStage): void {
    const defaultProbabilities: Record<DealStage, number> = {
      'Prospecting': 10,
      'Qualification': 30,
      'Proposal Sent': 60,
      'Negotiation': 80,
      'Contract Review': 90,
      'Won': 100,
      'Lost': 0
    };

    const updated = this.dealsSubject.value.map(deal => {
      if (deal.id === dealId) {
        return {
          ...deal,
          stage: newStage,
          probability: defaultProbabilities[newStage],
          timeline: [
            {
              id: Date.now(),
              title: `Stage Changed to ${newStage}`,
              description: `Probability updated to ${defaultProbabilities[newStage]}%`,
              timestamp: new Date().toLocaleString(),
              type: 'stage_change' as const
            },
            ...deal.timeline
          ]
        };
      }
      return deal;
    });
    this.dealsSubject.next(updated);
  }

  addDeal(deal: Deal): void {
    this.dealsSubject.next([deal, ...this.dealsSubject.value]);
  }

  bulkUpdateStage(ids: number[], stage: DealStage): void {
    const updated = this.dealsSubject.value.map(d => ids.includes(d.id) ? { ...d, stage } : d);
    this.dealsSubject.next(updated);
  }

  deleteDeals(ids: number[]): void {
    this.dealsSubject.next(this.dealsSubject.value.filter(d => !ids.includes(d.id)));
  }
}