import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type RelatedEntityType = 'Lead' | 'Deal' | 'Contact' | 'Company';

export interface TaskChecklistItem {
  id: number;
  text: string;
  isDone: boolean;
}

export interface TaskComment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface TaskAttachment {
  id: number;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export interface TaskActivity {
  id: number;
  title: string;
  timestamp: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  relatedEntityType: RelatedEntityType;
  relatedEntityName: string;
  relatedEntityId: number;
  assignee: string;
  assigneeAvatar: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  dueTime: string;
  progress: number; // 0 - 100%
  recurring: 'None' | 'Daily' | 'Weekly' | 'Monthly';
  reminderSet: boolean;
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  timeline: TaskActivity[];
}

// Helper factory to auto-generate baseline properties and keep data clean
function createTask(id: number, data: Partial<Task> & { title: string; relatedEntityType: RelatedEntityType; relatedEntityName: string }): Task {
  const assignee = data.assignee || 'Alex Morgan';
  const initials = assignee.split(' ').map(n => n[0]).join('').toUpperCase();
  const status = data.status || 'To Do';
  const progress = data.progress ?? (status === 'Completed' ? 100 : status === 'In Progress' ? 50 : 0);

  return {
    id,
    description: `Follow up on task for ${data.relatedEntityName}`,
    relatedEntityId: 100 + id,
    assignee,
    assigneeAvatar: initials,
    priority: 'Medium',
    status,
    dueDate: '2026-08-05',
    dueTime: '12:00',
    progress,
    recurring: 'None',
    reminderSet: false,
    checklist: [],
    comments: [],
    attachments: [],
    timeline: [
      { id: 1, title: `Task created for ${data.relatedEntityName}`, timestamp: '2026-07-28 09:00 AM' }
    ],
    ...data
  };
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private initialTasks: Task[] = [
    createTask(1, {
      title: 'Send Revised Enterprise Proposal',
      description: 'Prepare and send updated SLA terms to Nexus Tech team.',
      relatedEntityType: 'Deal',
      relatedEntityName: 'Enterprise Cloud Migration ($120k)',
      relatedEntityId: 101,
      assignee: 'Alex Morgan',
      priority: 'Urgent',
      status: 'In Progress',
      dueDate: '2026-07-30',
      dueTime: '15:00',
      progress: 60,
      reminderSet: true,
      checklist: [
        { id: 1, text: 'Review legal terms with counsel', isDone: true },
        { id: 2, text: 'Attach pricing matrix PDF', isDone: true },
        { id: 3, text: 'Send email via CRM tab', isDone: false }
      ],
      comments: [
        { id: 1, author: 'Alex Morgan', avatar: 'AM', text: 'Legal team approved clause 4.2.', timestamp: '2026-07-29 11:30 AM' }
      ],
      attachments: [
        { id: 1, fileName: 'Draft_Proposal_v2.pdf', fileSize: '1.2 MB', uploadedAt: '2026-07-29' }
      ]
    }),
    createTask(2, {
      title: 'Follow-up Call with Product Demo',
      description: 'Conduct follow-up qualification call for inbound lead.',
      relatedEntityType: 'Lead',
      relatedEntityName: 'Marcus Vance (VP Tech)',
      relatedEntityId: 1,
      assignee: 'Sarah Jenkins',
      priority: 'High',
      dueDate: '2026-07-30',
      dueTime: '11:00',
      reminderSet: true
    }),
    createTask(3, {
      title: 'Security Compliance Sign-off Review',
      description: 'Verify SOC2 compliance documentation before closing.',
      relatedEntityType: 'Company',
      relatedEntityName: 'Apex Logistics Corp',
      relatedEntityId: 44,
      assignee: "Liam O'Connor",
      priority: 'Medium',
      status: 'Review',
      dueDate: '2026-08-02',
      dueTime: '17:00',
      progress: 90
    }),
    createTask(4, {
      title: 'Quarterly Check-in Call',
      description: 'Schedule account health check with executive sponsor.',
      relatedEntityType: 'Contact',
      relatedEntityName: 'Rachel Adams',
      relatedEntityId: 12,
      priority: 'Low',
      status: 'Completed',
      dueDate: '2026-07-25',
      dueTime: '10:00',
      recurring: 'Monthly'
    }),
    createTask(5, {
      title: 'Fix API Authentication Demo Key',
      description: 'Generate temporary dev tokens for prospective engineering lead.',
      relatedEntityType: 'Lead',
      relatedEntityName: 'Rachel Adams (Horizon Log)',
      relatedEntityId: 2,
      assignee: 'Sarah Jenkins',
      priority: 'Urgent',
      dueDate: '2026-07-28', // Overdue
      dueTime: '09:00',
      progress: 10,
      reminderSet: true
    }),
    createTask(6, {
      title: 'Prepare Custom Pricing Tier Breakdown',
      description: 'Calculate multi-region deployment discounts for enterprise deal.',
      relatedEntityType: 'Deal',
      relatedEntityName: 'Global SaaS Expansion ($240k)',
      assignee: "Liam O'Connor",
      priority: 'High',
      status: 'In Progress',
      dueDate: '2026-08-01',
      dueTime: '14:00',
      progress: 40
    }),
    createTask(7, {
      title: 'Verify Vendor Procurement Form',
      description: 'Complete tax identification and compliance documents.',
      relatedEntityType: 'Company',
      relatedEntityName: 'Starlight Media Group',
      priority: 'Medium',
      status: 'Review',
      dueDate: '2026-08-03',
      dueTime: '16:30',
      progress: 80
    }),
    createTask(8, {
      title: 'Send Onboarding Kit & Resources',
      description: 'Dispatch Welcome PDF bundle and API documentation links.',
      relatedEntityType: 'Contact',
      relatedEntityName: 'Elena Rostova',
      assignee: 'Sarah Jenkins',
      priority: 'Low',
      status: 'Completed',
      dueDate: '2026-07-27',
      dueTime: '09:30'
    }),
    createTask(9, {
      title: 'Schedule Technical Architecture Review',
      description: 'Coordinate joint engineering meeting between solutions architect and client team.',
      relatedEntityType: 'Lead',
      relatedEntityName: 'Derek Forde (Quantum Robotics)',
      assignee: 'Alex Morgan',
      priority: 'Urgent',
      dueDate: '2026-07-31',
      dueTime: '10:00',
      reminderSet: true
    }),
    createTask(10, {
      title: 'Draft Master Service Agreement (MSA)',
      description: 'Work with legal team to prepare standard contract template for Q3.',
      relatedEntityType: 'Deal',
      relatedEntityName: 'BioLabs Enterprise SLA',
      assignee: "Liam O'Connor",
      priority: 'High',
      status: 'To Do',
      dueDate: '2026-08-06',
      dueTime: '12:00'
    })
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.initialTasks);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  updateTaskStatus(taskId: number, status: TaskStatus): void {
    const updated = this.tasksSubject.value.map(task => {
      if (task.id === taskId) {
        const isDone = status === 'Completed';
        return {
          ...task,
          status,
          progress: isDone ? 100 : (status === 'To Do' ? 0 : task.progress),
          timeline: [
            { id: Date.now(), title: `Moved to ${status}`, timestamp: new Date().toLocaleString() },
            ...task.timeline
          ]
        };
      }
      return task;
    });
    this.tasksSubject.next(updated);
  }

  addTask(task: Task): void {
    this.tasksSubject.next([task, ...this.tasksSubject.value]);
  }

  updateTask(updatedTask: Task): void {
    const updated = this.tasksSubject.value.map(t => t.id === updatedTask.id ? updatedTask : t);
    this.tasksSubject.next(updated);
  }

  deleteTasks(ids: number[]): void {
    this.tasksSubject.next(this.tasksSubject.value.filter(t => !ids.includes(t.id)));
  }
}