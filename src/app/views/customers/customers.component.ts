// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-customers',
//   imports: [],
//   templateUrl: './customers.component.html',
//   styleUrl: './customers.component.scss',
// })
// export class CustomersComponent {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Lead' | 'Inactive';
  value: number;
  createdDate: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  // Master Dataset
  allCustomers: Customer[] = [
    {
      id: 101,
      name: 'Alex Morgan',
      email: 'alex@apexglobal.com',
      company: 'Apex Global',
      status: 'Active',
      value: 12500,
      createdDate: '2026-01-15',
    },
    {
      id: 102,
      name: 'Sarah Jenkins',
      email: 's.jenkins@brighttech.io',
      company: 'BrightTech',
      status: 'Lead',
      value: 4200,
      createdDate: '2026-02-10',
    },
    {
      id: 103,
      name: 'David Chen',
      email: 'd.chen@vanguard.com',
      company: 'Vanguard Ltd',
      status: 'Inactive',
      value: 8900,
      createdDate: '2025-11-04',
    },
    {
      id: 104,
      name: 'Emma Watson',
      email: 'emma@solaris.net',
      company: 'Solaris Systems',
      status: 'Active',
      value: 34000,
      createdDate: '2026-03-01',
    },
    {
      id: 105,
      name: "Liam O'Connor",
      email: 'liam@nexus.io',
      company: 'Nexus Digital',
      status: 'Active',
      value: 19500,
      createdDate: '2026-01-28',
    },
    {
      id: 106,
      name: 'Maria Garcia',
      email: 'm.garcia@cortex.com',
      company: 'Cortex AI',
      status: 'Lead',
      value: 6100,
      createdDate: '2026-02-22',
    },
    {
      id: 107,
      name: 'James Wilson',
      email: 'j.wilson@quantum.org',
      company: 'Quantum Corp',
      status: 'Inactive',
      value: 1500,
      createdDate: '2025-09-12',
    },
    {
      id: 108,
      name: 'Olivia Taylor',
      email: 'olivia@strata.com',
      company: 'Strata Cloud',
      status: 'Active',
      value: 27800,
      createdDate: '2026-03-14',
    },
    {
      id: 109,
      name: 'Noah Miller',
      email: 'nmiller@omni.com',
      company: 'Omni Media',
      status: 'Lead',
      value: 9300,
      createdDate: '2026-02-05',
    },
    {
      id: 110,
      name: 'Sophia Patel',
      email: 'sophia@zenith.com',
      company: 'Zenith Tech',
      status: 'Active',
      value: 45000,
      createdDate: '2026-01-09',
    },
  ];

  // Processed Data
  filteredCustomers: Customer[] = [];
  paginatedCustomers: Customer[] = [];

  // Search & Filters
  searchTerm: string = '';
  selectedStatus: string = 'All';

  // Sorting
  sortColumn: keyof Customer = 'name';
  sortAscending: boolean = true;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Bulk Selection
  selectAll: boolean = false;
  selectedIds: Set<number> = new Set<number>();

  ngOnInit(): void {
    this.applyFilters();
  }

  // --- Search & Filter Logic ---
  applyFilters(): void {
    this.filteredCustomers = this.allCustomers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'All' ||
        customer.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.sortData();
  }

  // --- Sorting Logic ---
  sortBy(column: keyof Customer): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.sortData();
  }

  private sortData(): void {
    this.filteredCustomers.sort((a, b) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];

      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  // --- Pagination Logic ---
  updatePagination(): void {
    this.totalPages =
      Math.ceil(this.filteredCustomers.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCustomers = this.filteredCustomers.slice(
      startIndex,
      endIndex,
    );

    this.updateSelectAllState();
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  // --- Selection Logic ---
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.paginatedCustomers.forEach((c) => this.selectedIds.add(c.id));
    } else {
      this.paginatedCustomers.forEach((c) => this.selectedIds.delete(c.id));
    }
  }

  toggleSelect(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.updateSelectAllState();
  }

  private updateSelectAllState(): void {
    this.selectAll =
      this.paginatedCustomers.length > 0 &&
      this.paginatedCustomers.every((c) => this.selectedIds.has(c.id));
  }

  // --- Bulk Actions ---
  deleteSelected(): void {
    if (this.selectedIds.size === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${this.selectedIds.size} customer(s)?`,
      )
    ) {
      this.allCustomers = this.allCustomers.filter(
        (c) => !this.selectedIds.has(c.id),
      );
      this.selectedIds.clear();
      this.applyFilters();
    }
  }

  // --- CSV Export Logic ---
  exportCSV(): void {
    if (this.filteredCustomers.length === 0) return;

    const headers = [
      'ID',
      'Name',
      'Email',
      'Company',
      'Status',
      'Deal Value ($)',
      'Created Date',
    ];
    const rows = this.filteredCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.company}"`,
      c.status,
      c.value,
      c.createdDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `korvix_customers_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
