import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Contact { id: number; name: string; role: string; email: string; phone: string; }
export interface Deal { id: number; title: string; value: number; stage: 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost'; }
export interface CompanyDocument { id: number; name: string; type: 'Contract' | 'Invoice' | 'Proposal' | 'Presentation'; uploadedDate: string; size: string; }
export interface Activity { id: number; title: string; timestamp: string; type: 'created' | 'contact_added' | 'deal_won' | 'meeting' | 'document'; description: string; }

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
  rating: number;
  contacts: Contact[];
  deals: Deal[];
  documents: CompanyDocument[];
  timeline: Activity[];
}

// Helper factory to keep mock generation short and clean
function createCompany(id: number, data: Partial<Company>): Company {
  const name = data.name || 'Company';
  const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  
  return {
    id,
    name,
    legalName: `${name} Inc.`,
    registrationNumber: `REG-2026-${100 + id}`,
    taxId: `US-${80000000 + id}`,
    logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
    website: `www.${domain}`,
    email: `contact@${domain}`,
    supportEmail: `support@${domain}`,
    phone: `+1 (555) ${100 + id}-${2000 + id}`,
    country: 'United States',
    state: 'CA',
    city: 'San Francisco',
    zipCode: '94105',
    streetAddress: `${100 * id} Tech Blvd`,
    industry: 'Information Technology',
    employees: 50,
    companySize: 'SMB',
    annualRevenue: 1000000,
    status: 'Active',
    priority: 'Medium',
    source: 'Inbound Sales',
    owner: 'Sarah Jenkins',
    createdDate: '2026-01-10',
    tags: ['Tech'],
    socials: { linkedin: `https://linkedin.com/company/${name.toLowerCase().replace(/\s+/g, '')}` },
    rating: 4,
    contacts: [],
    deals: [],
    documents: [],
    timeline: [{ id: 1, title: 'Company Created', timestamp: '2026-01-10 09:00 AM', type: 'created', description: 'Account onboarded' }],
    ...data
  };
}

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private initialCompanies: Company[] = [
    createCompany(1, {
      name: 'Apex Global Systems',
      industry: 'Information Technology',
      employees: 450,
      companySize: 'Enterprise',
      annualRevenue: 12500000,
      priority: 'High',
      tags: ['SaaS', 'High-Value', 'Priority'],
      rating: 5,
      contacts: [
        { id: 1, name: 'John Smith', role: 'CTO', email: 'john@apexglobal.com', phone: '+1 555-0192' },
        { id: 2, name: 'Elena Rostova', role: 'Head of Procurement', email: 'elena@apexglobal.com', phone: '+1 555-0194' }
      ],
      deals: [
        { id: 1, title: 'Enterprise License Renewal 2026', value: 150000, stage: 'Negotiation' },
        { id: 2, title: 'Cloud Migration Consultancy', value: 45000, stage: 'Closed Won' }
      ]
    }),
    createCompany(2, {
      name: 'BrightTech Solutions',
      country: 'Canada', state: 'ON', city: 'Toronto',
      industry: 'Software & Cloud',
      employees: 35,
      companySize: 'SMB',
      annualRevenue: 2800000,
      status: 'Lead',
      owner: 'Alex Morgan',
      contacts: [{ id: 3, name: 'David Chen', role: 'VP of Engineering', email: 'dchen@brighttech.io', phone: '+1 416-555-0112' }],
      deals: [{ id: 3, title: 'Korvix CRM Integration', value: 28000, stage: 'Proposal' }]
    }),
    createCompany(3, {
      name: 'Nexus Cybernetics',
      industry: 'Cybersecurity',
      employees: 120,
      companySize: 'Mid-Market',
      annualRevenue: 8500000,
      priority: 'High',
      tags: ['Security', 'SOC2'],
      contacts: [{ id: 4, name: 'Sarah Connor', role: 'CISO', email: 'sconnor@nexus.com', phone: '+1 555-0341' }],
      deals: [{ id: 4, title: 'Security Audit & Compliance', value: 65000, stage: 'Qualified' }]
    }),
    createCompany(4, {
      name: 'Vanguard Logistics',
      city: 'Chicago', state: 'IL',
      industry: 'Transportation & Supply Chain',
      employees: 800,
      companySize: 'Enterprise',
      annualRevenue: 34000000,
      owner: 'Michael Scott',
      tags: ['Logistics', 'Enterprise'],
      deals: [{ id: 5, title: 'Fleet Tracking Software', value: 210000, stage: 'Negotiation' }]
    }),
    createCompany(5, {
      name: 'Starlight Media',
      city: 'Los Angeles', state: 'CA',
      industry: 'Digital Marketing',
      employees: 25,
      companySize: 'SMB',
      annualRevenue: 1500000,
      status: 'Lead',
      priority: 'Low',
      tags: ['Marketing', 'Media']
    }),
    createCompany(6, {
      name: 'Quantum BioLabs',
      city: 'Boston', state: 'MA',
      industry: 'Biotechnology',
      employees: 210,
      companySize: 'Mid-Market',
      annualRevenue: 18000000,
      priority: 'High',
      contacts: [{ id: 5, name: 'Dr. Aris Thorne', role: 'Lead Researcher', email: 'athorne@quantumbio.com', phone: '+1 555-0988' }]
    }),
    createCompany(7, {
      name: 'Horizon Financial',
      city: 'New York', state: 'NY',
      industry: 'Fintech',
      employees: 600,
      companySize: 'Enterprise',
      annualRevenue: 45000000,
      tags: ['Fintech', 'Finance'],
      deals: [{ id: 6, title: 'Payment Gateway Integration', value: 180000, stage: 'Closed Won' }]
    }),
    createCompany(8, {
      name: 'EcoGreen Dynamics',
      city: 'Seattle', state: 'WA',
      industry: 'Renewable Energy',
      employees: 90,
      companySize: 'Mid-Market',
      annualRevenue: 6200000,
      status: 'Inactive',
      priority: 'Low'
    }),
    createCompany(9, {
      name: 'Omni Retail Group',
      city: 'Austin', state: 'TX',
      industry: 'E-commerce',
      employees: 320,
      companySize: 'Mid-Market',
      annualRevenue: 14000000,
      deals: [{ id: 7, title: 'POS System Upgrade', value: 95000, stage: 'Proposal' }]
    }),
    createCompany(10, {
      name: 'Elevate Cloud Solutions',
      city: 'Denver', state: 'CO',
      industry: 'Cloud Architecture',
      employees: 45,
      companySize: 'SMB',
      annualRevenue: 3100000,
      status: 'Active',
      priority: 'Medium',
      tags: ['Cloud', 'DevOps']
    })
  ];

  private companiesSubject = new BehaviorSubject<Company[]>(this.initialCompanies);
  companies$: Observable<Company[]> = this.companiesSubject.asObservable();

  getCompanies(): Company[] {
    return this.companiesSubject.value;
  }

  deleteCompanies(ids: number[]): void {
    this.companiesSubject.next(this.companiesSubject.value.filter(c => !ids.includes(c.id)));
  }
}