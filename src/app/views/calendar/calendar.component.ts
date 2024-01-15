import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarService, CalendarEvent, EventType, RelatedEntityType, EventStatus } from './calendar.service';

interface MonthGridDay {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  events: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];

  // View States
  viewMode: 'month' | 'week' | 'day' | 'agenda' = 'month';
  currentDate = new Date(2026, 6, 30); // Anchor date: July 30, 2026
  selectedEvent: CalendarEvent | null = null;
  showCreateModal = false;

  // Filters & Search
  searchTerm = '';
  selectedTypeFilter = 'All';
  selectedUserFilter = 'All';

  // Grid Data
  monthDays: MonthGridDay[] = [];
  weekDays: { date: Date; dateStr: string; dayName: string; dayNumber: number; isToday: boolean }[] = [];
  hoursGrid: string[] = [];

  // Options
  eventTypes: EventType[] = ['Meeting', 'Call', 'Task', 'Follow-up', 'Holiday'];
  entityTypes: RelatedEntityType[] = ['Lead', 'Deal', 'Contact', 'Company'];

  // New Event Model Form
  newEvent: Partial<CalendarEvent> = {
    title: '',
    type: 'Meeting',
    startDate: '2026-07-30',
    startTime: '10:00',
    endDate: '2026-07-30',
    endTime: '11:00',
    durationMinutes: 60,
    locationOrLink: '',
    status: 'Scheduled',
    relatedEntityType: 'Deal',
    relatedEntityName: '',
    assignedUser: 'Alex Morgan',
    assignedAvatar: 'AM',
    reminderMinutesBefore: 15,
    isRecurring: false
  };

  constructor(private calendarService: CalendarService) {
    // Generate 24-hour slots for Day/Week views
    for (let i = 0; i < 24; i++) {
      const hourStr = i < 10 ? `0${i}:00` : `${i}:00`;
      this.hoursGrid.push(hourStr);
    }
  }

  ngOnInit(): void {
    this.calendarService.events$.subscribe(data => {
      this.events = data;
      this.applyFilters();
    });
  }

  get todayStr(): string {
    return '2026-07-30';
  }

  // --- KPI CALCULATIONS ---
  get todayEventsCount(): number {
    return this.events.filter(e => e.startDate === this.todayStr && e.status !== 'Cancelled').length;
  }
  get upcomingMeetingsCount(): number {
    return this.events.filter(e => e.type === 'Meeting' && e.startDate >= this.todayStr && e.status === 'Scheduled').length;
  }
  get dueTasksCount(): number {
    return this.events.filter(e => e.type === 'Task' && e.status !== 'Completed' && e.status !== 'Cancelled').length;
  }
  get followUpsCount(): number {
    return this.events.filter(e => e.type === 'Follow-up' && e.status === 'Scheduled').length;
  }
  get completedEventsCount(): number {
    return this.events.filter(e => e.status === 'Completed').length;
  }

  // --- NAVIGATION ---
  goToToday(): void {
    this.currentDate = new Date(2026, 6, 30);
    this.rebuildView();
  }

  navigateDate(offset: number): void {
    if (this.viewMode === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + offset, 1);
    } else if (this.viewMode === 'week') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + (offset * 7));
    } else if (this.viewMode === 'day') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + offset);
    }
    this.rebuildView();
  }

  setViewMode(mode: 'month' | 'week' | 'day' | 'agenda'): void {
    this.viewMode = mode;
    this.rebuildView();
  }

  // --- FILTERING & BUILDING VIEWS ---
  applyFilters(): void {
    this.filteredEvents = this.events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            (e.relatedEntityName && e.relatedEntityName.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesType = this.selectedTypeFilter === 'All' || e.type === this.selectedTypeFilter;
      const matchesUser = this.selectedUserFilter === 'All' || e.assignedUser === this.selectedUserFilter;

      return matchesSearch && matchesType && matchesUser;
    });

    this.rebuildView();
  }

  private rebuildView(): void {
    if (this.viewMode === 'month') {
      this.generateMonthGrid();
    } else if (this.viewMode === 'week') {
      this.generateWeekGrid();
    }
  }

  private generateMonthGrid(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: MonthGridDay[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const dateStr = this.formatDateIso(date);
      days.push({
        date,
        dateStr,
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        isToday: dateStr === this.todayStr,
        events: this.filteredEvents.filter(e => e.startDate === dateStr)
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const dateStr = this.formatDateIso(date);
      days.push({
        date,
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === this.todayStr,
        events: this.filteredEvents.filter(e => e.startDate === dateStr)
      });
    }

    // Next month padding
    const remainingSlots = (days.length > 35 ? 42 : 35) - days.length;
    for (let j = 1; j <= remainingSlots; j++) {
      const date = new Date(year, month + 1, j);
      const dateStr = this.formatDateIso(date);
      days.push({
        date,
        dateStr,
        dayNumber: j,
        isCurrentMonth: false,
        isToday: dateStr === this.todayStr,
        events: this.filteredEvents.filter(e => e.startDate === dateStr)
      });
    }

    this.monthDays = days;
  }

  private generateWeekGrid(): void {
    const curr = new Date(this.currentDate);
    const firstDayOfWeek = curr.getDate() - curr.getDay(); // Sunday anchor

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(firstDayOfWeek + i));
      const dateStr = this.formatDateIso(day);
      const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
      week.push({
        date: day,
        dateStr,
        dayName,
        dayNumber: day.getDate(),
        isToday: dateStr === this.todayStr
      });
    }
    this.weekDays = week;
  }

  getEventsForDate(dateStr: string): CalendarEvent[] {
    return this.filteredEvents.filter(e => e.startDate === dateStr);
  }

  getEventsForTimeSlot(dateStr: string, hour: string): CalendarEvent[] {
    const hourPrefix = hour.substring(0, 2);
    return this.filteredEvents.filter(e => e.startDate === dateStr && e.startTime.startsWith(hourPrefix));
  }

  // --- DRAG AND DROP ---
  onDragStart(event: DragEvent, calendarEventId: number): void {
    event.dataTransfer?.setData('text/plain', calendarEventId.toString());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetDateStr: string): void {
    event.preventDefault();
    const idStr = event.dataTransfer?.getData('text/plain');
    if (!idStr) return;

    const eventId = parseInt(idStr, 10);
    this.calendarService.rescheduleEvent(eventId, targetDateStr);
  }

  // --- ACTIONS & MODALS ---
  openCreateModal(defaultType: EventType = 'Meeting'): void {
    this.newEvent.type = defaultType;
    this.showCreateModal = true;
  }

  openEventDetails(event: CalendarEvent): void {
    this.selectedEvent = event;
  }

  closeEventDetails(): void {
    this.selectedEvent = null;
  }

  saveNewEvent(): void {
    if (!this.newEvent.title || !this.newEvent.startDate) return;

    const created: CalendarEvent = {
      id: Date.now(),
      title: this.newEvent.title,
      description: this.newEvent.description || '',
      type: (this.newEvent.type as EventType) || 'Meeting',
      startDate: this.newEvent.startDate,
      startTime: this.newEvent.startTime || '09:00',
      endDate: this.newEvent.endDate || this.newEvent.startDate,
      endTime: this.newEvent.endTime || '10:00',
      durationMinutes: this.newEvent.durationMinutes || 60,
      locationOrLink: this.newEvent.locationOrLink || 'Office',
      status: 'Scheduled',
      relatedEntityType: this.newEvent.relatedEntityType,
      relatedEntityName: this.newEvent.relatedEntityName,
      assignedUser: this.newEvent.assignedUser || 'Alex Morgan',
      assignedAvatar: 'AM',
      reminderMinutesBefore: this.newEvent.reminderMinutesBefore || 15,
      isRecurring: this.newEvent.isRecurring || false,
      participants: []
    };

    this.calendarService.addEvent(created);
    this.showCreateModal = false;
  }

  markEventCompleted(event: CalendarEvent): void {
    event.status = 'Completed';
    this.calendarService.updateEvent(event);
  }

  cancelEvent(event: CalendarEvent): void {
    this.calendarService.cancelEvent(event.id);
    if (this.selectedEvent && this.selectedEvent.id === event.id) {
      this.selectedEvent.status = 'Cancelled';
    }
  }

  private formatDateIso(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}