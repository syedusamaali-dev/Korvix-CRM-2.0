import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadsService, Lead, LeadStatus, LeadSource } from './leads.service';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  leads: Lead[] = [];
  filteredLeads: Lead[] = [];
  
  statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Unqualified'];
  sources: LeadSource[] = ['Website', 'LinkedIn', 'Cold Outreach', 'Referral', 'Trade Show'];

  // View Controls
  viewMode: 'board' | 'table' = 'board';
  selectedLead: Lead | null = null;
  activeDetailTab: 'overview' | 'tasks' | 'notes' | 'timeline' = 'overview';
  
  // Modals
  showAddModal: boolean = false;
  showConvertModal: boolean = false;
  leadToConvert: Lead | null = null;

  // Filters
  searchTerm: string = '';
  selectedStatusFilter: string = 'All';
  selectedSourceFilter: string = 'All';

  // Selection & Sorting
  selectedIds: Set<number> = new Set<number>();
  selectAll: boolean = false;
  sortColumn: keyof Lead = 'firstName';
  sortAscending: boolean = true;

  // Convert Model
  dealTitleForConversion: string = '';
  dealValueForConversion: number = 25000;

  // New Lead Form Model
  newLead: Partial<Lead> = {
    firstName: '',
    lastName: '',
    companyName: '',
    jobTitle: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
    rating: 3,
    owner: 'Alex Morgan'
  };

  constructor(private leadsService: LeadsService) {}

  ngOnInit(): void {
    this.leadsService.leads$.subscribe(data => {
      this.leads = data;
      this.applyFilters();
    });
  }

  // KPIs
  get totalLeadsCount(): number { return this.leads.length; }
  get newLeadsCount(): number { return this.leads.filter(l => l.status === 'New').length; }
  get qualifiedLeadsCount(): number { return this.leads.filter(l => l.status === 'Qualified').length; }
  get conversionRate(): number { 
    return this.totalLeadsCount ? Math.round((this.qualifiedLeadsCount / this.totalLeadsCount) * 100) : 0; 
  }

  getLeadsByStatus(status: LeadStatus): Lead[] {
    return this.filteredLeads.filter(l => l.status === status);
  }

  applyFilters(): void {
    this.filteredLeads = this.leads.filter(l => {
      const fullName = `${l.firstName} ${l.lastName}`.toLowerCase();
      const matchesSearch = 
        fullName.includes(this.searchTerm.toLowerCase()) ||
        l.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatusFilter === 'All' || l.status === this.selectedStatusFilter;
      const matchesSource = this.selectedSourceFilter === 'All' || l.source === this.selectedSourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });

    this.sortData();
  }

  sortBy(column: keyof Lead): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.sortData();
  }

  private sortData(): void {
    this.filteredLeads.sort((a, b) => {
      const valA = a[this.sortColumn] ?? '';
      const valB = b[this.sortColumn] ?? '';
      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  // Drag and Drop
  onDragStart(event: DragEvent, leadId: number): void {
    event.dataTransfer?.setData('text/plain', leadId.toString());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetStatus: LeadStatus): void {
    event.preventDefault();
    const leadIdStr = event.dataTransfer?.getData('text/plain');
    if (!leadIdStr) return;

    const leadId = parseInt(leadIdStr, 10);
    this.leadsService.updateStatus(leadId, targetStatus);
  }

  // Lead Conversion Dialog
  openConvertModal(lead: Lead, event: Event): void {
    event.stopPropagation();
    this.leadToConvert = lead;
    this.dealTitleForConversion = `${lead.companyName} - Expansion Deal`;
    this.showConvertModal = true;
  }

  confirmConversion(): void {
    if (this.leadToConvert) {
      this.leadsService.updateStatus(this.leadToConvert.id, 'Qualified');
      alert(`Successfully converted ${this.leadToConvert.firstName} ${this.leadToConvert.lastName} into an active Contact and generated new Deal: "${this.dealTitleForConversion}"!`);
    }
    this.showConvertModal = false;
    this.leadToConvert = null;
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.filteredLeads.forEach(l => this.selectedIds.add(l.id));
    } else {
      this.selectedIds.clear();
    }
  }

  toggleSelect(id: number): void {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }

  deleteSelected(): void {
    if (confirm(`Delete ${this.selectedIds.size} selected lead(s)?`)) {
      this.leadsService.deleteLeads(Array.from(this.selectedIds));
      this.selectedIds.clear();
      this.selectAll = false;
    }
  }

  exportCSV(): void {
    const headers = ['First Name', 'Last Name', 'Company', 'Job Title', 'Email', 'Phone', 'Status', 'Source', 'Score', 'Owner'];
    const rows = this.filteredLeads.map(l => [
      `"${l.firstName}"`, `"${l.lastName}"`, `"${l.companyName}"`, `"${l.jobTitle}"`, `"${l.email}"`, `"${l.phone}"`, l.status, l.source, l.score, `"${l.owner}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Korvix_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }

  openDetails(lead: Lead): void {
    this.selectedLead = lead;
    this.activeDetailTab = 'overview';
  }

  closeDetails(): void {
    this.selectedLead = null;
  }

  saveLead(): void {
    if (!this.newLead.firstName || !this.newLead.companyName || !this.newLead.email) return;

    const leadToSave: Lead = {
      id: Date.now(),
      firstName: this.newLead.firstName,
      lastName: this.newLead.lastName || '',
      companyName: this.newLead.companyName,
      jobTitle: this.newLead.jobTitle || 'N/A',
      email: this.newLead.email,
      phone: this.newLead.phone || '',
      status: (this.newLead.status as LeadStatus) || 'New',
      source: (this.newLead.source as LeadSource) || 'Website',
      rating: this.newLead.rating || 3,
      score: 50,
      owner: this.newLead.owner || 'Alex Morgan',
      lastActivity: 'Just now',
      notes: [],
      tasks: [],
      timeline: [{ id: Date.now(), title: 'Lead Created', description: 'Captured into CRM', timestamp: 'Just now', type: 'status_change' }]
    };

    this.leadsService.addLead(leadToSave);
    this.showAddModal = false;
    this.newLead = { firstName: '', lastName: '', companyName: '', email: '', status: 'New', source: 'Website', rating: 3 };
  }
}