import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService, Task, TaskStatus, TaskPriority, RelatedEntityType } from './tasks.service';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  statuses: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Completed'];
  priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
  entityTypes: RelatedEntityType[] = ['Lead', 'Deal', 'Contact', 'Company'];

  // View States
  viewMode: 'list' | 'kanban' | 'calendar' = 'list';
  selectedTask: Task | null = null;
  activeTab: 'overview' | 'checklist' | 'comments' | 'attachments' | 'timeline' = 'overview';

  // Filters
  searchTerm = '';
  selectedStatusFilter = 'All';
  selectedPriorityFilter = 'All';
  selectedAssigneeFilter = 'All';
  selectedDueDateFilter = 'All';

  // Selection
  selectedIds = new Set<number>();
  selectAll = false;

  // New Comment & Subtask inputs
  newCommentText = '';
  newChecklistItemText = '';

  // Calendar State
  currentCalendarDate = new Date(2026, 6, 1); // July 2026
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Modal
  showAddModal = false;
  newTask: Partial<Task> = {
    title: '',
    description: '',
    relatedEntityType: 'Deal',
    relatedEntityName: '',
    assignee: 'Alex Morgan',
    assigneeAvatar: 'AM',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '2026-07-30',
    dueTime: '12:00',
    recurring: 'None',
    reminderSet: true
  };

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.tasksService.tasks$.subscribe(data => {
      this.tasks = data;
      this.applyFilters();
    });
  }

  // --- KPI CALCULATIONS ---
  get todayStr(): string {
    return '2026-07-30'; // Static reference anchor for demo state
  }

  get totalTasksCount(): number { return this.tasks.length; }
  get pendingTasksCount(): number { return this.tasks.filter(t => t.status === 'To Do').length; }
  get inProgressTasksCount(): number { return this.tasks.filter(t => t.status === 'In Progress').length; }
  get completedTasksCount(): number { return this.tasks.filter(t => t.status === 'Completed').length; }
  get overdueTasksCount(): number { 
    return this.tasks.filter(t => t.status !== 'Completed' && t.dueDate < this.todayStr).length; 
  }
  get dueTodayTasksCount(): number { 
    return this.tasks.filter(t => t.dueDate === this.todayStr && t.status !== 'Completed').length; 
  }

  // --- FILTERING ---
  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(t => {
      const matchesSearch = 
        t.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.relatedEntityName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatusFilter === 'All' || t.status === this.selectedStatusFilter;
      const matchesPriority = this.selectedPriorityFilter === 'All' || t.priority === this.selectedPriorityFilter;
      const matchesAssignee = this.selectedAssigneeFilter === 'All' || t.assignee === this.selectedAssigneeFilter;

      let matchesDate = true;
      if (this.selectedDueDateFilter === 'Today') matchesDate = t.dueDate === this.todayStr;
      if (this.selectedDueDateFilter === 'Overdue') matchesDate = t.dueDate < this.todayStr && t.status !== 'Completed';

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesDate;
    });

    if (this.viewMode === 'calendar') {
      this.generateCalendar();
    }
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.filteredTasks.filter(t => t.status === status);
  }

  isTaskOverdue(task: Task): boolean {
    return task.status !== 'Completed' && task.dueDate < this.todayStr;
  }

  // --- KANBAN DRAG & DROP ---
  onDragStart(event: DragEvent, taskId: number): void {
    event.dataTransfer?.setData('text/plain', taskId.toString());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetStatus: TaskStatus): void {
    event.preventDefault();
    const taskIdStr = event.dataTransfer?.getData('text/plain');
    if (!taskIdStr) return;

    const taskId = parseInt(taskIdStr, 10);
    this.tasksService.updateTaskStatus(taskId, targetStatus);
  }

  // --- CALENDAR GENERATION ---
  generateCalendar(): void {
    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: prevDate,
        dayNumber: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: false,
        tasks: []
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().slice(0, 10);
      const dayTasks = this.filteredTasks.filter(t => t.dueDate === dateStr);

      days.push({
        date,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === this.todayStr,
        tasks: dayTasks
      });
    }

    // Next month padding days to fill 35 or 42 grid cells
    const remainingGridSlots = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let j = 1; j <= remainingGridSlots; j++) {
      const nextDate = new Date(year, month + 1, j);
      days.push({
        date: nextDate,
        dayNumber: j,
        isCurrentMonth: false,
        isToday: false,
        tasks: []
      });
    }

    this.calendarDays = days;
  }

  changeMonth(offset: number): void {
    this.currentCalendarDate = new Date(
      this.currentCalendarDate.getFullYear(),
      this.currentCalendarDate.getMonth() + offset,
      1
    );
    this.generateCalendar();
  }

  // --- ACTIONS & QUICK TOGGLES ---
  toggleTaskComplete(task: Task, event: Event): void {
    event.stopPropagation();
    const newStatus: TaskStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
    this.tasksService.updateTaskStatus(task.id, newStatus);
  }

  toggleChecklistItem(item: { isDone: boolean }): void {
    item.isDone = !item.isDone;
    this.recalculateTaskProgress();
  }

  addChecklistItem(): void {
    if (!this.selectedTask || !this.newChecklistItemText.trim()) return;
    this.selectedTask.checklist.push({
      id: Date.now(),
      text: this.newChecklistItemText.trim(),
      isDone: false
    });
    this.newChecklistItemText = '';
    this.recalculateTaskProgress();
  }

  private recalculateTaskProgress(): void {
    if (!this.selectedTask) return;
    const items = this.selectedTask.checklist;
    if (items.length === 0) return;

    const completed = items.filter(i => i.isDone).length;
    this.selectedTask.progress = Math.round((completed / items.length) * 100);
    this.tasksService.updateTask(this.selectedTask);
  }

  addComment(): void {
    if (!this.selectedTask || !this.newCommentText.trim()) return;
    this.selectedTask.comments.unshift({
      id: Date.now(),
      author: 'Alex Morgan',
      avatar: 'AM',
      text: this.newCommentText.trim(),
      timestamp: 'Just now'
    });
    this.newCommentText = '';
    this.tasksService.updateTask(this.selectedTask);
  }

  // --- BULK SELECTION ---
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.filteredTasks.forEach(t => this.selectedIds.add(t.id));
    } else {
      this.selectedIds.clear();
    }
  }

  toggleSelect(id: number): void {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }

  deleteSelected(): void {
    if (confirm(`Delete ${this.selectedIds.size} selected task(s)?`)) {
      this.tasksService.deleteTasks(Array.from(this.selectedIds));
      this.selectedIds.clear();
      this.selectAll = false;
    }
  }

  // --- DETAIL PANEL & CREATE ---
  openDetail(task: Task): void {
    this.selectedTask = task;
    this.activeTab = 'overview';
  }

  closeDetail(): void {
    this.selectedTask = null;
  }

  saveTask(): void {
    if (!this.newTask.title || !this.newTask.dueDate) return;

    const created: Task = {
      id: Date.now(),
      title: this.newTask.title,
      description: this.newTask.description || '',
      relatedEntityType: (this.newTask.relatedEntityType as RelatedEntityType) || 'Deal',
      relatedEntityName: this.newTask.relatedEntityName || 'General Opportunity',
      relatedEntityId: Date.now(),
      assignee: this.newTask.assignee || 'Alex Morgan',
      assigneeAvatar: (this.newTask.assignee || 'Alex Morgan').split(' ').map(n => n[0]).join(''),
      priority: (this.newTask.priority as TaskPriority) || 'Medium',
      status: (this.newTask.status as TaskStatus) || 'To Do',
      dueDate: this.newTask.dueDate,
      dueTime: this.newTask.dueTime || '12:00',
      progress: 0,
      recurring: this.newTask.recurring || 'None',
      reminderSet: this.newTask.reminderSet || false,
      checklist: [],
      comments: [],
      attachments: [],
      timeline: [{ id: Date.now(), title: 'Task Created', timestamp: 'Just now' }]
    };

    this.tasksService.addTask(created);
    this.showAddModal = false;
    this.newTask = { title: '', description: '', priority: 'Medium', status: 'To Do', relatedEntityType: 'Deal' };
  }
}