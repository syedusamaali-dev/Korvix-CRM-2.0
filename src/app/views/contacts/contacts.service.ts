import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ContactDeal {
  id: number;
  title: string;
  value: number;
  stage: string;
}

export interface ContactTask {
  id: number;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
}

export interface ContactActivity {
  id: number;
  type: 'email' | 'call' | 'meeting' | 'deal_update';
  title: string;
  description: string;
  timestamp: string;
}

export interface Contact {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyName: string;
  companyId: number;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  owner: string;
  lastActivity: string;
  tags: ('VIP' | 'Decision Maker' | 'Prospect' | 'Client')[];
  isFavorite: boolean;
  
  // Detailed Tab Data
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  socials?: {
    linkedin?: string;
    twitter?: string;
  };
  notes?: string[];
  deals?: ContactDeal[];
  tasks?: ContactTask[];
  timeline?: ContactActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private initialContacts: Contact[] = [
    {
      id: 1,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      jobTitle: 'Head of Procurement',
      companyName: 'Apex Global Systems',
      companyId: 101,
      email: 's.jenkins@apexglobal.com',
      phone: '+1 (555) 234-5678',
      status: 'Active',
      owner: 'Alex Morgan',
      lastActivity: '2 hours ago',
      tags: ['VIP', 'Decision Maker'],
      isFavorite: true,
      address: { street: '100 Market St', city: 'San Francisco', state: 'CA', country: 'USA' },
      socials: { linkedin: 'https://linkedin.com/in/sarahjenkins' },
      notes: ['Prefers morning phone calls.', 'Key decision maker for Q3 renewal.'],
      deals: [{ id: 1, title: 'Enterprise License Renewal', value: 150000, stage: 'Negotiation' }],
      tasks: [{ id: 1, title: 'Send revised SLA document', dueDate: '2026-08-05', status: 'Pending' }],
      timeline: [
        { id: 1, type: 'call', title: 'Discovery Call', description: 'Discussed cloud migration scale.', timestamp: '2026-07-28 10:00 AM' },
        { id: 2, type: 'email', title: 'Proposal Sent', description: 'Emailed pricing breakdown.', timestamp: '2026-07-29 09:30 AM' }
      ]
    },
    {
      id: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      firstName: 'David',
      lastName: 'Chen',
      jobTitle: 'VP of Engineering',
      companyName: 'BrightTech Solutions',
      companyId: 102,
      email: 'd.chen@brighttech.io',
      phone: '+1 (555) 987-6543',
      status: 'Active',
      owner: 'Liam O\'Connor',
      lastActivity: '1 day ago',
      tags: ['Decision Maker', 'Prospect'],
      isFavorite: false,
      address: { street: '250 Front St W', city: 'Toronto', state: 'ON', country: 'Canada' },
      notes: ['Interested in API integrations.'],
      deals: [{ id: 2, title: 'Korvix CRM Integration', value: 35000, stage: 'Proposal' }],
      tasks: [],
      timeline: [
        { id: 3, type: 'meeting', title: 'Technical Sync', description: 'Reviewed API webhooks.', timestamp: '2026-07-27 02:00 PM' }
      ]
    },
    {
      id: 3,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      firstName: 'Emma',
      lastName: 'Watson',
      jobTitle: 'Operations Director',
      companyName: 'Solaris Systems',
      companyId: 103,
      email: 'emma@solaris.net',
      phone: '+1 (555) 345-6789',
      status: 'Inactive',
      owner: 'Sarah Jenkins',
      lastActivity: '3 weeks ago',
      tags: ['Client'],
      isFavorite: false,
      deals: [],
      tasks: [],
      timeline: []
    }
  ];

  
}