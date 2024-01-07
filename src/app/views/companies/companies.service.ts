import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Deal {
  id: number;
  title: string;
  value: number;
  stage: 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
}

export interface CompanyDocument {
  id: number;
  name: string;
  type: 'Contract' | 'Invoice' | 'Proposal' | 'Presentation';
  uploadedDate: string;
  size: string;
}

export interface Activity {
  id: number;
  title: string;
  timestamp: string;
  type: 'created' | 'contact_added' | 'deal_won' | 'meeting' | 'document';
  description: string;
}

export interface Company {
  id: number;
  logo: string;
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  supportEmail: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  streetAddress: string;
  employees: number;
  companySize: 'SMB' | 'Mid-Market' | 'Enterprise';
  annualRevenue: number;
  status: 'Active' | 'Lead' | 'Inactive';
  priority: 'High' | 'Medium' | 'Low';
  source: string;
  owner: string;
  createdDate: string;
  tags: string[];
  socials: { linkedin?: string; twitter?: string; facebook?: string };
  rating: number; // 1 to 5 Stars
  contacts: Contact[];
  deals: Deal[];
  documents: CompanyDocument[];
  timeline: Activity[];
}

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private initialCompanies: Company[] = [
    {
      id: 1,
      logo: 'https://ui-avatars.com/api/?name=Apex+Global&background=0D8ABC&color=fff',
      name: 'Apex Global Systems',
      legalName: 'Apex Global Systems Inc.',
      registrationNumber: 'REG-2024-998',
      taxId: 'US-99847291',
      industry: 'Information Technology',
      website: 'www.apexglobal.com',
      phone: '+1 (555) 234-5678',
      email: 'contact@apexglobal.com',
      supportEmail: 'support@apexglobal.com',
      country: 'United States',
      state: 'CA',
      city: 'San Francisco',
      zipCode: '94105',
      streetAddress: '100 Market St Suite 300',
      employees: 450,
      companySize: 'Enterprise',
      annualRevenue: 12500000,
      status: 'Active',
      priority: 'High',
      source: 'Inbound Sales',
      owner: 'Sarah Jenkins',
      createdDate: '2026-01-10',
      tags: ['SaaS', 'High-Value', 'Priority'],
      socials: { linkedin: 'https://linkedin.com/company/apex', twitter: 'https://x.com/apex' },
      rating: 5,
      contacts: [
        { id: 1, name: 'John Smith', role: 'Chief Technology Officer', email: 'john@apexglobal.com', phone: '+1 555-0192' },
        { id: 2, name: 'Elena Rostova', role: 'Head of Procurement', email: 'elena@apexglobal.com', phone: '+1 555-0194' }
      ],
      deals: [
        { id: 1, title: 'Enterprise License Renewal 2026', value: 150000, stage: 'Negotiation' },
        { id: 2, title: 'Cloud Migration Consultancy', value: 45000, stage: 'Closed Won' }
      ],
      documents: [
        { id: 1, name: 'Master_Services_Agreement_2026.pdf', type: 'Contract', uploadedDate: '2026-01-12', size: '2.4 MB' }
      ],
      timeline: [
        { id: 1, title: 'Deal Won', timestamp: '2026-02-14 10:30 AM', type: 'deal_won', description: 'Closed $45,000 Cloud Migration consultancy' },
        { id: 2, title: 'Company Created', timestamp: '2026-01-10 09:00 AM', type: 'created', description: 'Account onboarded by Sarah Jenkins' }
      ]
    },
    {
      id: 2,
      logo: 'https://ui-avatars.com/api/?name=BrightTech&background=0D9488&color=fff',
      name: 'BrightTech Solutions',
      legalName: 'BrightTech Solutions LLC',
      registrationNumber: 'REG-2025-112',
      taxId: 'US-88371920',
      industry: 'Software & Cloud',
      website: 'www.brighttech.io',
      phone: '+1 (555) 987-6543',
      email: 'hello@brighttech.io',
      supportEmail: 'help@brighttech.io',
      country: 'Canada',
      state: 'ON',
      city: 'Toronto',
      zipCode: 'M5V 2T6',
      streetAddress: '250 Front St W',
      employees: 35,
      companySize: 'SMB',
      annualRevenue: 2800000,
      status: 'Lead',
      priority: 'Medium',
      source: 'Webinar',
      owner: 'Alex Morgan',
      createdDate: '2026-02-01',
      tags: ['Cloud', 'Growth'],
      socials: { linkedin: 'https://linkedin.com/company/brighttech' },
      rating: 4,
      contacts: [
        { id: 3, name: 'David Chen', role: 'VP of Engineering', email: 'dchen@brighttech.io', phone: '+1 416-555-0112' }
      ],
      deals: [
        { id: 3, title: 'Korvix CRM Integration', value: 28000, stage: 'Proposal' }
      ],
      documents: [],
      timeline: [
        { id: 3, title: 'New Contact Added', timestamp: '2026-02-02 02:15 PM', type: 'contact_added', description: 'David Chen added as primary contact' }
      ]
    }
  ];

  private companiesSubject = new BehaviorSubject<Company[]>(this.initialCompanies);
  companies$ = this.companiesSubject.asObservable();

  getCompanies(): Company[] {
    return this.companiesSubject.value;
  }

  deleteCompanies(ids: number[]): void {
    const updated = this.companiesSubject.value.filter(c => !ids.includes(c.id));
    this.companiesSubject.next(updated);
  }
}