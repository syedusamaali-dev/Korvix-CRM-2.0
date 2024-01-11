import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  address?: { street: string; city: string; state: string; country: string; };
  socials?: { linkedin?: string; twitter?: string; };
  notes?: string[];
  deals?: ContactDeal[];
  tasks?: ContactTask[];
  timeline?: ContactActivity[];
}

// Helper factory to streamline mock contact generation
function createContact(id: number, data: Partial<Contact> & { firstName: string; lastName: string; companyName: string }): Contact {
  const email = data.email || `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@${data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  
  return {
    id,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName + ' ' + data.lastName)}&background=0D8ABC&color=fff`,
    jobTitle: 'Manager',
    companyId: 100 + id,
    email,
    phone: `+1 (555) ${200 + id}-${4000 + id}`,
    status: 'Active',
    owner: 'Alex Morgan',
    lastActivity: '1 day ago',
    tags: ['Prospect'],
    isFavorite: false,
    address: { street: `${100 * id} Main St`, city: 'San Francisco', state: 'CA', country: 'USA' },
    socials: { linkedin: `https://linkedin.com/in/${data.firstName.toLowerCase()}${data.lastName.toLowerCase()}` },
    notes: [],
    deals: [],
    tasks: [],
    timeline: [
      { id: 1, type: 'email', title: 'Contact Created', description: 'Added to CRM pipeline', timestamp: '2026-07-20 09:00 AM' }
    ],
    ...data,
  };
}

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private initialContacts: Contact[] = [
    createContact(1, {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      jobTitle: 'Head of Procurement',
      companyName: 'Apex Global Systems',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      lastActivity: '2 hours ago',
      tags: ['VIP', 'Decision Maker'],
      isFavorite: true,
      notes: ['Prefers morning phone calls.', 'Key decision maker for Q3 renewal.'],
      deals: [{ id: 1, title: 'Enterprise License Renewal', value: 150000, stage: 'Negotiation' }],
      tasks: [{ id: 1, title: 'Send revised SLA document', dueDate: '2026-08-05', status: 'Pending' }],
      timeline: [
        { id: 1, type: 'call', title: 'Discovery Call', description: 'Discussed cloud migration scale.', timestamp: '2026-07-28 10:00 AM' },
        { id: 2, type: 'email', title: 'Proposal Sent', description: 'Emailed pricing breakdown.', timestamp: '2026-07-29 09:30 AM' }
      ]
    }),
    createContact(2, {
      firstName: 'David',
      lastName: 'Chen',
      jobTitle: 'VP of Engineering',
      companyName: 'BrightTech Solutions',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      owner: "Liam O'Connor",
      tags: ['Decision Maker', 'Prospect'],
      address: { street: '250 Front St W', city: 'Toronto', state: 'ON', country: 'Canada' },
      notes: ['Interested in API integrations.'],
      deals: [{ id: 2, title: 'Korvix CRM Integration', value: 35000, stage: 'Proposal' }]
    }),
    createContact(3, {
      firstName: 'Emma',
      lastName: 'Watson',
      jobTitle: 'Operations Director',
      companyName: 'Solaris Systems',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status: 'Inactive',
      owner: 'Sarah Jenkins',
      lastActivity: '3 weeks ago',
      tags: ['Client']
    }),
    createContact(4, {
      firstName: 'Marcus',
      lastName: 'Vance',
      jobTitle: 'Director of Security',
      companyName: 'Nexus Cybernetics',
      tags: ['VIP', 'Decision Maker'],
      isFavorite: true,
      notes: ['Requires SOC2 audit reports prior to signing.'],
      deals: [{ id: 3, title: 'Cyber Security Expansion', value: 85000, stage: 'Qualified' }]
    }),
    createContact(5, {
      firstName: 'Elena',
      lastName: 'Rostova',
      jobTitle: 'Chief Technology Officer',
      companyName: 'Vanguard Logistics',
      owner: 'Sarah Jenkins',
      lastActivity: '5 hours ago',
      tags: ['Decision Maker', 'Client'],
      deals: [{ id: 4, title: 'Fleet Tracking Module', value: 120000, stage: 'Closed Won' }]
    }),
    createContact(6, {
      firstName: 'Michael',
      lastName: 'Scott',
      jobTitle: 'Regional Manager',
      companyName: 'Starlight Media',
      status: 'Inactive',
      tags: ['Prospect'],
      notes: ['Follow up in Q4 after budget review.']
    }),
    createContact(7, {
      firstName: 'Dr. Aris',
      lastName: 'Thorne',
      jobTitle: 'Lead Bio-Researcher',
      companyName: 'Quantum BioLabs',
      tags: ['VIP'],
      isFavorite: true,
      deals: [{ id: 5, title: 'Lab Automation Software', value: 65000, stage: 'Proposal' }]
    }),
    createContact(8, {
      firstName: 'Karen',
      lastName: 'Lindqvist',
      jobTitle: 'Chief Medical Officer',
      companyName: 'Nordic Healthcare',
      owner: "Liam O'Connor",
      tags: ['Decision Maker', 'Client'],
      tasks: [{ id: 2, title: 'Schedule Onboarding Session', dueDate: '2026-08-02', status: 'Pending' }]
    }),
    createContact(9, {
      firstName: 'James',
      lastName: 'Wilson',
      jobTitle: 'Head of Infrastructure',
      companyName: 'AeroSpace Velocity',
      tags: ['VIP', 'Decision Maker'],
      deals: [{ id: 6, title: 'Telemetry Data Pipeline', value: 310000, stage: 'Negotiation' }]
    }),
    createContact(10, {
      firstName: 'Sophia',
      lastName: 'Martinez',
      jobTitle: 'Product Design Lead',
      companyName: 'PixelCraft Studios',
      tags: ['Prospect'],
      lastActivity: '3 days ago'
    })
  ];

  private contactsSubject = new BehaviorSubject<Contact[]>(this.initialContacts);
  contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();

  getContacts(): Contact[] {
    return this.contactsSubject.value;
  }

  toggleFavorite(id: number): void {
    const updated = this.contactsSubject.value.map((c) =>
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    );
    this.contactsSubject.next(updated);
  }

  addContact(contact: Contact): void {
    this.contactsSubject.next([contact, ...this.contactsSubject.value]);
  }

  deleteContacts(ids: number[]): void {
    this.contactsSubject.next(this.contactsSubject.value.filter((c) => !ids.includes(c.id)));
  }
}