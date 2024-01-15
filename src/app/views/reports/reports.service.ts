import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ReportCategory = 
  | 'Sales' 
  | 'Revenue' 
  | 'Customer' 
  | 'Lead' 
  | 'Deal Pipeline' 
  | 'Team Performance';

export type DateRangeFilter = 'this_month' | 'last_month' | 'this_quarter' | 'this_year';

export interface PerformanceMetric {
  salesperson: string;
  dealsClosed: number;
  totalRevenue: number;
  targetAchievedPct: number;
  avatar: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  conversionPct: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private initialPerformance: PerformanceMetric[] = [
    { salesperson: 'Alex Morgan', dealsClosed: 14, totalRevenue: 185000, targetAchievedPct: 112, avatar: 'AM' },
    { salesperson: 'Sarah Jenkins', dealsClosed: 11, totalRevenue: 142000, targetAchievedPct: 95, avatar: 'SJ' },
    { salesperson: 'Liam O\'Connor', dealsClosed: 9, totalRevenue: 98000, targetAchievedPct: 82, avatar: 'LO' },
    { salesperson: 'Elena Rostova', dealsClosed: 16, totalRevenue: 210000, targetAchievedPct: 125, avatar: 'ER' }
  ];

  private performanceSubject = new BehaviorSubject<PerformanceMetric[]>(this.initialPerformance);
  performance$: Observable<PerformanceMetric[]> = this.performanceSubject.asObservable();

  getMonthlyRevenueData(): ChartDataPoint[] {
    return [
      { label: 'Jan', value: 42000, secondaryValue: 38000 },
      { label: 'Feb', value: 58000, secondaryValue: 45000 },
      { label: 'Mar', value: 65000, secondaryValue: 52000 },
      { label: 'Apr', value: 72000, secondaryValue: 61000 },
      { label: 'May', value: 89000, secondaryValue: 70000 },
      { label: 'Jun', value: 94000, secondaryValue: 81000 },
      { label: 'Jul', value: 115000, secondaryValue: 88000 }
    ];
  }

  getLeadsBySourceData(): ChartDataPoint[] {
    return [
      { label: 'Inbound Web', value: 42 },
      { label: 'LinkedIn Ads', value: 28 },
      { label: 'Cold Outreach', value: 18 },
      { label: 'Referrals', value: 12 }
    ];
  }

  getPipelineFunnelData(): FunnelStage[] {
    return [
      { stage: 'Leads Generated', count: 240, conversionPct: 100 },
      { stage: 'Qualified Leads', count: 160, conversionPct: 66.6 },
      { stage: 'Proposal Sent', count: 90, conversionPct: 37.5 },
      { stage: 'Negotiation', count: 45, conversionPct: 18.7 },
      { stage: 'Closed Won', count: 32, conversionPct: 13.3 }
    ];
  }
}