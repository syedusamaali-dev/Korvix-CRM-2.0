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

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private initialTasks: Task[] = [
    {
      id: 1,
      title: 'Send Revised Enterprise Proposal',
      description: 'Prepare and send updated SLA terms to Nexus Tech team.',
      relatedEntityType: 'Deal',
      relatedEntityName: 'Enterprise Cloud Migration ($120k)',
      relatedEntityId: 101,
      assignee: 'Alex Morgan',
      assigneeAvatar: 'AM',
      priority: 'Urgent',
      status: 'In Progress',
      dueDate: '2026-07-30',
      dueTime: '15:00',
      progress: 60,
      recurring: 'None',
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
      ],
      timeline: [
        { id: 1, title: 'Task status changed to In Progress', timestamp: '2026-07-29 09:00 AM' }
      ]
    },
    {
      id: 2,
      title: 'Follow-up Call with Product Demo',
      description: 'Conduct follow-up qualification call for inbound lead.',
      relatedEntityType: 'Lead',
      relatedEntityName: 'Marcus Vance (VP Tech)',
      relatedEntityId: 1,
      assignee: 'Sarah Jenkins',
      assigneeAvatar: 'SJ',
      priority: 'High',
      status: 'To Do',
      dueDate: '2026-07-30',
      dueTime: '11:00',
      progress: 0,
      recurring: 'None',
      reminderSet: true,
      checklist: [],
      comments: [],
      attachments: [],
      timeline: []
    },
    {
      id: 3,
      title: 'Security Compliance Sign-off Review',
      description: 'Verify SOC2 compliance documentation before closing.',
      relatedEntityType: 'Company',
      relatedEntityName: 'Apex Logistics Corp',
      relatedEntityId: 44,
      assignee: 'Liam O\'Connor',
      assigneeAvatar: 'LO',
      priority: 'Medium',
      status: 'Review',
      dueDate: '2026-08-02',
      dueTime: '17:00',
      progress: 90,
      recurring: 'None',
      reminderSet: false,
      checklist: [],
      comments: [],
      attachments: [],
      timeline: []
    },
    {
      id: 4,
      title: 'Quarterly Check-in Call',
      description: 'Schedule account health check with executive sponsor.',
      relatedEntityType: 'Contact',
      relatedEntityName: 'Rachel Adams',
      relatedEntityId: 12,
      assignee: 'Alex Morgan',
      assigneeAvatar: 'AM',
      priority: 'Low',
      status: 'Completed',
      dueDate: '2026-07-25',
      dueTime: '10:00',
      progress: 100,
      recurring: 'Monthly',
      reminderSet: false,
      checklist: [],
      comments: [],
      attachments: [],
      timeline: []
    },
    {
      id: 5,
      title: 'Fix API Authentication Demo Key',
      description: 'Generate temporary dev tokens for prospective engineering lead.',
      relatedEntityType: 'Lead',
      relatedEntityName: 'Rachel Adams (Horizon Log)',
      relatedEntityId: 2,
      assignee: 'Sarah Jenkins',
      assigneeAvatar: 'SJ',
      priority: 'Urgent',
      status: 'To Do',
      dueDate: '2026-07-28', // OVERDUE TASK
      dueTime: '09:00',
      progress: 10,
      recurring: 'None',
      reminderSet: true,
      checklist: [],
      comments: [],
      attachments: [],
      timeline: []
    }
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.initialTasks);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

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