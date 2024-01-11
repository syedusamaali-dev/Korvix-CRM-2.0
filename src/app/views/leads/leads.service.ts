import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

// Helper factory to auto-generate baseline lead structure and keep code concise
function createLead(id: number, data: Partial<Lead> & { firstName: string; lastName: string; companyName: string }): Lead {
  const domain = data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const email = data.email || `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@${domain}`;

  return {
    id,
    jobTitle: 'Decision Maker',
    email,
    phone: `+1 (555) ${100 + id}-${3000 + id}`,
    status: 'New',
    source: 'Website',
    rating: 3,
    score: 50,
    owner: 'Alex Morgan',
    lastActivity: '1 day ago',
    notes: [],
    tasks: [],
    timeline: [
      { id: 1, title: 'Lead Created', description: 'Lead captured in system', timestamp: '2026-07-25 09:00 AM', type: 'status_change' }
    ],
    ...data
  };
}

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  private initialLeads: Lead[] = [
    createLead(1, {
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
      lastActivity: '1 hour ago',
      notes: ['Interested in enterprise tier with 50+ seats.'],
      tasks: [{ id: 1, title: 'Schedule qualification demo', dueDate: '2026-08-02', isCompleted: false }],
      timeline: [
        { id: 1, title: 'Lead Status Changed', description: 'Moved to Qualified by Alex', timestamp: '2026-07-28 10:30 AM', type: 'status_change' }
      ]
    }),
    createLead(2, {
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
      owner: "Liam O'Connor",
      lastActivity: '4 hours ago',
      notes: ['Filled out contact form regarding API pricing.']
    }),
    createLead(3, {
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
      lastActivity: 'Yesterday'
    }),
    createLead(4, {
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
      lastActivity: '3 days ago',
      notes: ['Budget too low for enterprise plans.']
    }),
    createLead(5, {
      firstName: 'Samantha',
      lastName: 'Wright',
      companyName: 'Apex Cloud Systems',
      jobTitle: 'CTO',
      status: 'Qualified',
      source: 'Referral',
      rating: 5,
      score: 92,
      owner: 'Sarah Jenkins',
      lastActivity: '30 mins ago',
      notes: ['Referred by existing client. High intent.'],
      tasks: [{ id: 2, title: 'Send custom contract draft', dueDate: '2026-08-01', isCompleted: false }]
    }),
    createLead(6, {
      firstName: 'Derek',
      lastName: 'Forde',
      companyName: 'Quantum Robotics',
      jobTitle: 'Head of Engineering',
      status: 'Contacted',
      source: 'LinkedIn',
      rating: 4,
      score: 74,
      owner: "Liam O'Connor",
      lastActivity: '2 hours ago',
      notes: ['Expressed interest in automated API pipeline webhooks.']
    }),
    createLead(7, {
      firstName: 'Priya',
      lastName: 'Patel',
      companyName: 'BioHealth Dynamics',
      jobTitle: 'VP of Product',
      status: 'New',
      source: 'Website',
      rating: 4,
      score: 68,
      lastActivity: '5 hours ago'
    }),
    createLead(8, {
      firstName: 'Viktor',
      lastName: 'Kovacs',
      companyName: 'Nordic Cybersec',
      jobTitle: 'IT Security Lead',
      status: 'Qualified',
      source: 'Trade Show',
      rating: 5,
      score: 88,
      owner: 'Sarah Jenkins',
      lastActivity: '1 day ago',
      notes: ['Needs SOC2 compliance verification documentation.']
    }),
    createLead(9, {
      firstName: 'Amara',
      lastName: 'Okafor',
      companyName: 'Fintech Spark',
      jobTitle: 'Founder & CEO',
      status: 'Contacted',
      source: 'Referral',
      rating: 3,
      score: 55,
      lastActivity: '2 days ago'
    }),
    createLead(10, {
      firstName: 'Ethan',
      lastName: 'Hunt',
      companyName: 'Mission Logistics',
      jobTitle: 'Supply Chain Director',
      status: 'Unqualified',
      source: 'Cold Outreach',
      rating: 1,
      score: 20,
      owner: "Liam O'Connor",
      lastActivity: '4 days ago',
      notes: ['Current contract locked until 2028.']
    })
  ];

  private leadsSubject = new BehaviorSubject<Lead[]>(this.initialLeads);
  leads$: Observable<Lead[]> = this.leadsSubject.asObservable();

  getLeads(): Lead[] {
    return this.leadsSubject.value;
  }

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
    this.leadsSubject.next(this.leadsSubject.value.filter(l => !ids.includes(l.id)));
  }
}