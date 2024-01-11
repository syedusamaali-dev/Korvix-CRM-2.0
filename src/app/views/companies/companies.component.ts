import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompaniesService, Company } from './companies.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  paginatedCompanies: Company[] = [];
  selectedCompany: Company | null = null;
  activeDetailTab:
    | 'overview'
    | 'contacts'
    | 'deals'
    | 'documents'
    | 'timeline' = 'overview';

  // Filters
  searchTerm: string = '';
  selectedIndustry: string = 'All';
  selectedStatus: string = 'All';
  selectedSize: string = 'All';

  // Sorting & Pagination
  sortColumn: keyof Company = 'name';
  sortAscending: boolean = true;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Bulk Selection
  selectedIds: Set<number> = new Set<number>();
  selectAll: boolean = false;

  constructor(private companiesService: CompaniesService) {}

  ngOnInit(): void {
    this.companiesService.companies$.subscribe((data) => {
      this.companies = data;
      this.applyFilters();
    });
  }

  // KPI Calculations
  get totalCompanies(): number {
    return this.companies.length;
  }
  get activeCompanies(): number {
    return this.companies.filter((c) => c.status === 'Active').length;
  }
  get enterpriseCount(): number {
    return this.companies.filter((c) => c.companySize === 'Enterprise').length;
  }
  get smbCount(): number {
    return this.companies.filter((c) => c.companySize === 'SMB').length;
  }

  applyFilters(): void {
    this.filteredCompanies = this.companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.industry
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        company.website.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesIndustry =
        this.selectedIndustry === 'All' ||
        company.industry === this.selectedIndustry;
      const matchesStatus =
        this.selectedStatus === 'All' || company.status === this.selectedStatus;
      const matchesSize =
        this.selectedSize === 'All' ||
        company.companySize === this.selectedSize;

      return matchesSearch && matchesIndustry && matchesStatus && matchesSize;
    });

    this.sortData();
  }

  sortBy(column: keyof Company): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.sortData();
  }

  private sortData(): void {
    this.filteredCompanies.sort((a, b) => {
      const valA = a[this.sortColumn] ?? '';
      const valB = b[this.sortColumn] ?? '';
      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages =
      Math.ceil(this.filteredCompanies.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedCompanies = this.filteredCompanies.slice(
      start,
      start + this.pageSize,
    );
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.paginatedCompanies.forEach((c) => this.selectedIds.add(c.id));
    } else {
      this.selectedIds.clear();
    }
  }

  toggleSelect(id: number): void {
    this.selectedIds.has(id)
      ? this.selectedIds.delete(id)
      : this.selectedIds.add(id);
  }

  deleteSelected(): void {
    if (
      confirm(
        `Are you sure you want to delete ${this.selectedIds.size} company record(s)?`,
      )
    ) {
      this.companiesService.deleteCompanies(Array.from(this.selectedIds));
      this.selectedIds.clear();
      this.selectAll = false;
    }
  }

  exportCSV(): void {
    const headers = [
      'Company Name',
      'Industry',
      'Website',
      'Phone',
      'Country',
      'Size',
      'Status',
      'Owner',
    ];
    const rows = this.filteredCompanies.map((c) => [
      `"${c.name}"`,
      `"${c.industry}"`,
      `"${c.website}"`,
      `"${c.phone}"`,
      `"${c.country}"`,
      c.companySize,
      c.status,
      `"${c.owner}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Korvix_Companies_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }

  openDetails(company: Company): void {
    this.selectedCompany = company;
    this.activeDetailTab = 'overview';
  }

  closeDetails(): void {
    this.selectedCompany = null;
  }
}
