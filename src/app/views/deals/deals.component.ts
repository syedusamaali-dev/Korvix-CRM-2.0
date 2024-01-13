import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealsService, Deal, DealStage, DealPriority } from './deals.service';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss'
})
export class DealsComponent implements OnInit {
  deals: Deal[] = [];
  filteredDeals: Deal[] = [];

  stages: DealStage[] = [
    'Prospecting',
    'Qualification',
    'Proposal Sent',
    'Negotiation',
    'Contract Review',
    'Won',
    'Lost'
  ];

  priorities: DealPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

  // View States
  viewMode: 'kanban' | 'table' | 'analytics' = 'kanban';
  selectedDeal: Deal | null = null;
  activeDetailTab: 'overview' | 'activities' | 'tasks' | 'notes' | 'documents' | 'emails' | 'timeline' = 'overview';

  // Controls & Filters
  searchTerm = '';
  selectedStageFilter = 'All';
  selectedOwnerFilter = 'All';
  selectedPriorityFilter = 'All';

  // Bulk Actions
  selectedIds = new Set<number>();
  selectAll = false;
  bulkStageTarget: DealStage = 'Qualification';

  // Duplicate Warning State
  showDuplicateWarning = false;

  // New Deal Modal
  showAddModal = false;
  newDeal: Partial<Deal> = {
    name: '',
    company: '',
    contact: '',
    value: 50000,
    currency: 'USD',
    stage: 'Prospecting',
    priority: 'Medium',
    owner: 'Alex Morgan'
  };

  constructor(private dealsService: DealsService) {}

  ngOnInit(): void {
    this.dealsService.deals$.subscribe(data => {
      this.deals = data;
      this.applyFilters();
    });
  }

  // --- KPI CALCULATIONS ---
  get totalDeals(): number { return this.deals.length; }
  get openDeals(): number { return this.deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length; }
  get wonDeals(): number { return this.deals.filter(d => d.stage === 'Won').length; }
  get lostDeals(): number { return this.deals.filter(d => d.stage === 'Lost').length; }
  get pipelineValue(): number {
    return this.deals
      .filter(d => d.stage !== 'Lost')
      .reduce((sum, d) => sum + d.value, 0);
  }
  get expectedRevenue(): number {
    return this.deals
      .filter(d => d.stage !== 'Lost')
      .reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);
  }

  // --- FILTERING & SORTING ---
  applyFilters(): void {
    this.filteredDeals = this.deals.filter(d => {
      const matchesSearch = 
        d.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        d.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        d.contact.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStage = this.selectedStageFilter === 'All' || d.stage === this.selectedStageFilter;
      const matchesOwner = this.selectedOwnerFilter === 'All' || d.owner === this.selectedOwnerFilter;
      const matchesPriority = this.selectedPriorityFilter === 'All' || d.priority === this.selectedPriorityFilter;

      return matchesSearch && matchesStage && matchesOwner && matchesPriority;
    });
  }

  getDealsByStage(stage: DealStage): Deal[] {
    return this.filteredDeals.filter(d => d.stage === stage);
  }

  getStageTotalValue(stage: DealStage): number {
    return this.getDealsByStage(stage).reduce((sum, d) => sum + d.value, 0);
  }

  // --- DRAG AND DROP ---
  onDragStart(event: DragEvent, dealId: number): void {
    event.dataTransfer?.setData('text/plain', dealId.toString());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetStage: DealStage): void {
    event.preventDefault();
    const dealIdStr = event.dataTransfer?.getData('text/plain');
    if (!dealIdStr) return;

    const dealId = parseInt(dealIdStr, 10);
    this.dealsService.updateStage(dealId, targetStage);
  }

  // --- DUPLICATE CHECK & SAVE ---
  checkForDuplicates(): void {
    const exists = this.deals.some(d => 
      d.name.toLowerCase() === this.newDeal.name?.toLowerCase() &&
      d.company.toLowerCase() === this.newDeal.company?.toLowerCase()
    );
    this.showDuplicateWarning = exists;
  }

  saveDeal(): void {
    if (!this.newDeal.name || !this.newDeal.company) return;

    const created: Deal = {
      id: Date.now(),
      name: this.newDeal.name,
      company: this.newDeal.company,
      contact: this.newDeal.contact || 'N/A',
      contactEmail: 'contact@company.com',
      value: this.newDeal.value || 0,
      currency: 'USD',
      stage: (this.newDeal.stage as DealStage) || 'Prospecting',
      probability: 20,
      closeDate: '2026-09-30',
      owner: this.newDeal.owner || 'Alex Morgan',
      priority: (this.newDeal.priority as DealPriority) || 'Medium',
      source: 'Manual Creation',
      description: 'Newly added deal.',
      tasks: [],
      notes: [],
      documents: [],
      emails: [],
      timeline: [{ id: Date.now(), title: 'Deal Created', description: 'Created in CRM', timestamp: 'Just now', type: 'stage_change' }]
    };

    this.dealsService.addDeal(created);
    this.showAddModal = false;
    this.showDuplicateWarning = false;
    this.newDeal = { name: '', company: '', value: 50000, stage: 'Prospecting', priority: 'Medium' };
  }

  // --- BULK ACTIONS ---
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.filteredDeals.forEach(d => this.selectedIds.add(d.id));
    } else {
      this.selectedIds.clear();
    }
  }

  toggleSelect(id: number): void {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }

  executeBulkUpdate(): void {
    this.dealsService.bulkUpdateStage(Array.from(this.selectedIds), this.bulkStageTarget);
    this.selectedIds.clear();
    this.selectAll = false;
  }

  executeBulkDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedIds.size} deal(s)?`)) {
      this.dealsService.deleteDeals(Array.from(this.selectedIds));
      this.selectedIds.clear();
      this.selectAll = false;
    }
  }

  // --- NAVIGATION ---
  openDetail(deal: Deal): void {
    this.selectedDeal = deal;
    this.activeDetailTab = 'overview';
  }

  closeDetail(): void {
    this.selectedDeal = null;
  }

  exportCSV(): void {
    const headers = ['Deal Name', 'Company', 'Contact', 'Value', 'Stage', 'Probability', 'Close Date', 'Owner', 'Priority'];
    const rows = this.filteredDeals.map(d => [
      `"${d.name}"`, `"${d.company}"`, `"${d.contact}"`, d.value, d.stage, `${d.probability}%`, d.closeDate, `"${d.owner}"`, d.priority
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Korvix_Deals_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }
}