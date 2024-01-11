import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactsService, Contact } from './contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  paginatedContacts: Contact[] = [];

  // View Controls
  viewMode: 'table' | 'card' = 'table';
  selectedContact: Contact | null = null;
  activeDetailTab:
    | 'overview'
    | 'timeline'
    | 'notes'
    | 'tasks'
    | 'deals'
    | 'emails' = 'overview';
  showAddModal: boolean = false;

  // Filters & Search
  searchTerm: string = '';
  selectedStatus: string = 'All';
  selectedTag: string = 'All';

  // Sorting & Pagination
  sortColumn: keyof Contact = 'firstName';
  sortAscending: boolean = true;
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;

  // Selection
  selectedIds: Set<number> = new Set<number>();
  selectAll: boolean = false;

  // New Contact Form Model
  newContact: Partial<Contact> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    companyName: '',
    status: 'Active',
    owner: 'Alex Morgan',
    tags: ['Prospect'],
  };

  constructor(private contactsService: ContactsService) {}

  ngOnInit(): void {
    this.contactsService.contacts$.subscribe((data) => {
      this.contacts = data;
      this.applyFilters();
    });
  }

  // KPIs
  get totalContacts(): number {
    return this.contacts.length;
  }
  get activeContacts(): number {
    return this.contacts.filter((c) => c.status === 'Active').length;
  }
  get vipContacts(): number {
    return this.contacts.filter((c) => c.tags.includes('VIP')).length;
  }

  applyFilters(): void {
    this.filteredContacts = this.contacts.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(this.searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.companyName.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'All' || c.status === this.selectedStatus;
      const matchesTag =
        this.selectedTag === 'All' || c.tags.includes(this.selectedTag as any);

      return matchesSearch && matchesStatus && matchesTag;
    });

    this.sortData();
  }

  sortBy(column: keyof Contact): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.sortData();
  }

  private sortData(): void {
    this.filteredContacts.sort((a, b) => {
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
      Math.ceil(this.filteredContacts.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedContacts = this.filteredContacts.slice(
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

  toggleFavorite(id: number, event: Event): void {
    event.stopPropagation();
    this.contactsService.toggleFavorite(id);
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.paginatedContacts.forEach((c) => this.selectedIds.add(c.id));
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
    if (confirm(`Delete ${this.selectedIds.size} selected contact(s)?`)) {
      this.contactsService.deleteContacts(Array.from(this.selectedIds));
      this.selectedIds.clear();
      this.selectAll = false;
    }
  }

  exportCSV(): void {
    const headers = [
      'First Name',
      'Last Name',
      'Job Title',
      'Company',
      'Email',
      'Phone',
      'Status',
      'Owner',
    ];
    const rows = this.filteredContacts.map((c) => [
      `"${c.firstName}"`,
      `"${c.lastName}"`,
      `"${c.jobTitle}"`,
      `"${c.companyName}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      c.status,
      `"${c.owner}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Korvix_Contacts_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }

  openDetails(contact: Contact): void {
    this.selectedContact = contact;
    this.activeDetailTab = 'overview';
  }

  closeDetails(): void {
    this.selectedContact = null;
  }

  saveContact(): void {
    if (!this.newContact.firstName || !this.newContact.email) return;

    const contactToSave: Contact = {
      id: Date.now(),
      avatar: `https://ui-avatars.com/api/?name=${this.newContact.firstName}+${this.newContact.lastName}&background=0d9488&color=fff`,
      firstName: this.newContact.firstName,
      lastName: this.newContact.lastName || '',
      jobTitle: this.newContact.jobTitle || 'N/A',
      companyName: this.newContact.companyName || 'Unassigned',
      companyId: 0,
      email: this.newContact.email,
      phone: this.newContact.phone || '',
      status: (this.newContact.status as any) || 'Active',
      owner: this.newContact.owner || 'Alex Morgan',
      lastActivity: 'Just now',
      tags: this.newContact.tags || ['Prospect'],
      isFavorite: false,
      notes: [],
      deals: [],
      tasks: [],
      timeline: [
        {
          id: Date.now(),
          type: 'email',
          title: 'Contact Created',
          description: 'Added to Korvix CRM',
          timestamp: 'Just now',
        },
      ],
    };

    this.contactsService.addContact(contactToSave);
    this.showAddModal = false;
    this.newContact = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      status: 'Active',
    };
  }
}
