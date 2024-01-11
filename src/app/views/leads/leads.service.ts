import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Unqualified';
export type LeadSource = 'Website' | 'LinkedIn' | 'Cold Outreach' | 'Referral' | 'Trade Show';

export interface LeadTask {
  id: number;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface LeadActivity {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: 'email' | 'call' | 'status_change';
}

export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  companyName: string;
  jobTitle: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  rating: number; // 1 to 5 Stars
  owner: string;
  score: number; // 0 - 100 Lead Score
  lastActivity: string;
  notes: string[];
  tasks: LeadTask[];
  timeline: LeadActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  private initialLeads: Lead[] = [
    {
      id: 1,
      firstName: 'Marcus',
      lastName: 'Vance',
      companyName: 'Nexis Tech Solutions',
      jobTitle: 'VP of Technology',
      email: 'm.vance@nexistech.io',
      phone: '+1 (555) 019-2831',
      status: 'Qualified',
      source: 'LinkedIn',
      rating: 5,
      score: 85,
      owner: 'Alex Morgan',
      lastActivity: '1 hour ago',
      notes: ['Interested in enterprise tier with 50+ seats.'],
      tasks: [{ id: 1, title: 'Schedule qualification demo', dueDate: '2026-08-02', isCompleted: false }],
      timeline: [
        { id: 1, title: 'Lead Status Changed', description: 'Moved to Qualified by Alex', timestamp: '2026-07-28 10:30 AM', type: 'status_change' }
      ]
    },
    {
      id: 2,
      firstName: 'Rachel',
      lastName: 'Adams',
      companyName: 'Horizon Logistics',
      jobTitle: 'Operations Manager',
      email: 'rachel@horizonlog.com',
      phone: '+1 (555) 432-8765',
      status: 'Contacted',
      source: 'Website',
      rating: 3,
      score: 60,
      owner: 'Liam O\'Connor',
      lastActivity: '4 hours ago',
      notes: ['Filled out contact form regarding API pricing.'],
      tasks: [],
      timeline: []
    },
    {
      id: 3,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      companyName: 'Starlight Retail',
      jobTitle: 'Director of Operations',
      email: 'c.mendoza@starlight.net',
      phone: '+1 (555) 888-1212',
      status: 'New',
      source: 'Cold Outreach',
      rating: 2,
      score: 40,
      owner: 'Sarah Jenkins',
      lastActivity: 'Yesterday',
      notes: [],
      tasks: [],
      timeline: []
    },
    {
      id: 4,
      firstName: 'Jessica',
      lastName: 'Alba',
      companyName: 'Pinnacle Growth',
      jobTitle: 'Chief Marketing Officer',
      email: 'jalba@pinnacle.com',
      phone: '+1 (555) 999-4433',
      status: 'Unqualified',
      source: 'Trade Show',
      rating: 1,
      score: 15,
      owner: 'Alex Morgan',
      lastActivity: '3 days ago',
      notes: ['Budget too low for enterprise plans.'],
      tasks: [],
      timeline: []
    }
  ];

  private leadsSubject = new BehaviorSubject<Lead[]>(this.initialLeads);
  leads$ = this.leadsSubject.asObservable();

  updateStatus(leadId: number, status: LeadStatus): void {
    const updated = this.leadsSubject.value.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status,
          lastActivity: 'Just now',
          timeline: [
            {
              id: Date.now(),
              title: `Status Changed to ${status}`,
              description: `Lead status updated to ${status}`,
              timestamp: 'Just now',
              type: 'status_change' as const
            },
            ...lead.timeline
          ]
        };
      }
      return lead;
    });
    this.leadsSubject.next(updated);
  }

  addLead(lead: Lead): void {
    this.leadsSubject.next([lead, ...this.leadsSubject.value]);
  }

  deleteLeads(ids: number[]): void {
    const updated = this.leadsSubject.value.filter(l => !ids.includes(l.id));
    this.leadsSubject.next(updated);
  }
}