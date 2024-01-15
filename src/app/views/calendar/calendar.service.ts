import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type EventType = 'Meeting' | 'Call' | 'Task' | 'Follow-up' | 'Holiday';
export type RelatedEntityType = 'Lead' | 'Deal' | 'Contact' | 'Company';
export type EventStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';

export interface CalendarParticipant {
  name: string;
  email: string;
  avatar: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  type: EventType;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endDate: string;   // YYYY-MM-DD
  endTime: string;   // HH:mm (24h)
  durationMinutes: number;
  locationOrLink: string;
  status: EventStatus;
  relatedEntityType?: RelatedEntityType;
  relatedEntityName?: string;
  relatedEntityId?: number;
  assignedUser: string;
  assignedAvatar: string;
  reminderMinutesBefore: number;
  isRecurring: boolean;
  recurrencePattern?: 'Daily' | 'Weekly' | 'Monthly';
  participants: CalendarParticipant[];
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private initialEvents: CalendarEvent[] = [
    {
      id: 1,
      title: 'Enterprise Architecture Sync',
      description: 'Review SLA terms and technical requirements with engineering leadership.',
      type: 'Meeting',
      startDate: '2026-07-30',
      startTime: '10:00',
      endDate: '2026-07-30',
      endTime: '11:00',
      durationMinutes: 60,
      locationOrLink: 'https://meet.google.com/krv-x-crm',
      status: 'Scheduled',
      relatedEntityType: 'Deal',
      relatedEntityName: 'Cloud Migration ($120k)',
      relatedEntityId: 101,
      assignedUser: 'Alex Morgan',
      assignedAvatar: 'AM',
      reminderMinutesBefore: 15,
      isRecurring: false,
      participants: [
        { name: 'Marcus Vance', email: 'marcus@nexustech.io', avatar: 'MV' },
        { name: 'Alex Morgan', email: 'alex@korvix.io', avatar: 'AM' }
      ],
      notes: 'Prepare security compliance slides.'
    },
    {
      id: 2,
      title: 'Discovery Call: Inbound Lead',
      description: 'Initial qualification call regarding platform capabilities.',
      type: 'Call',
      startDate: '2026-07-30',
      startTime: '14:30',
      endDate: '2026-07-30',
      endTime: '15:00',
      durationMinutes: 30,
      locationOrLink: '+1 (555) 019-2834',
      status: 'Scheduled',
      relatedEntityType: 'Lead',
      relatedEntityName: 'Rachel Adams (Horizon)',
      relatedEntityId: 2,
      assignedUser: 'Sarah Jenkins',
      assignedAvatar: 'SJ',
      reminderMinutesBefore: 10,
      isRecurring: false,
      participants: [
        { name: 'Rachel Adams', email: 'rachel@horizon.com', avatar: 'RA' }
      ]
    },
    {
      id: 3,
      title: 'Send Revised Contract Draft',
      description: 'Deliver updated agreement including legal edits.',
      type: 'Task',
      startDate: '2026-07-30',
      startTime: '16:00',
      endDate: '2026-07-30',
      endTime: '16:30',
      durationMinutes: 30,
      locationOrLink: 'CRM Internal',
      status: 'In Progress',
      relatedEntityType: 'Deal',
      relatedEntityName: 'Enterprise Cloud Migration ($120k)',
      relatedEntityId: 101,
      assignedUser: 'Alex Morgan',
      assignedAvatar: 'AM',
      reminderMinutesBefore: 30,
      isRecurring: false,
      participants: []
    },
    {
      id: 4,
      title: 'Account Health Follow-up',
      description: 'Quarterly check-in on account adoption and expansion opportunities.',
      type: 'Follow-up',
      startDate: '2026-07-31',
      startTime: '11:00',
      endDate: '2026-07-31',
      endTime: '11:45',
      durationMinutes: 45,
      locationOrLink: 'https://zoom.us/j/982341234',
      status: 'Scheduled',
      relatedEntityType: 'Company',
      relatedEntityName: 'Apex Logistics Corp',
      relatedEntityId: 44,
      assignedUser: 'Liam O\'Connor',
      assignedAvatar: 'LO',
      reminderMinutesBefore: 15,
      isRecurring: true,
      recurrencePattern: 'Monthly',
      participants: []
    },
    {
      id: 5,
      title: 'Team Weekly Retrospective',
      description: 'Weekly team sprint review and pipeline sync.',
      type: 'Meeting',
      startDate: '2026-07-27',
      startTime: '09:00',
      endDate: '2026-07-27',
      endTime: '10:00',
      durationMinutes: 60,
      locationOrLink: 'Conference Room B',
      status: 'Completed',
      assignedUser: 'Alex Morgan',
      assignedAvatar: 'AM',
      reminderMinutesBefore: 10,
      isRecurring: true,
      recurrencePattern: 'Weekly',
      participants: []
    }
  ];

  private eventsSubject = new BehaviorSubject<CalendarEvent[]>(this.initialEvents);
  events$: Observable<CalendarEvent[]> = this.eventsSubject.asObservable();

  addEvent(event: CalendarEvent): void {
    this.eventsSubject.next([...this.eventsSubject.value, event]);
  }

  updateEvent(updated: CalendarEvent): void {
    const events = this.eventsSubject.value.map(e => e.id === updated.id ? updated : e);
    this.eventsSubject.next(events);
  }

  rescheduleEvent(eventId: number, newDateStr: string): void {
    const events = this.eventsSubject.value.map(e => {
      if (e.id === eventId) {
        return { ...e, startDate: newDateStr, endDate: newDateStr };
      }
      return e;
    });
    this.eventsSubject.next(events);
  }

  cancelEvent(eventId: number): void {
    const events = this.eventsSubject.value.map(e => {
      if (e.id === eventId) {
        return { ...e, status: 'Cancelled' as EventStatus };
      }
      return e;
    });
    this.eventsSubject.next(events);
  }
}