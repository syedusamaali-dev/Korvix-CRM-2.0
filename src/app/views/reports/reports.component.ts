import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService, ReportCategory, DateRangeFilter, PerformanceMetric, ChartDataPoint, FunnelStage } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  selectedCategory: ReportCategory = 'Sales';
  selectedDateRange: DateRangeFilter = 'this_month';
  
  // Metrics & KPIs
  totalRevenue = 635000;
  totalSalesCount = 50;
  newCustomersCount = 38;
  conversionRatePct = 13.3;
  activeDealsCount = 28;
  monthlyGrowthPct = 18.4;

  // Chart datasets
  revenueChartData: ChartDataPoint[] = [];
  leadSourceData: ChartDataPoint[] = [];
  pipelineFunnel: FunnelStage[] = [];
  teamPerformance: PerformanceMetric[] = [];

  // Drill-down Modal State
  selectedDrilldown: { title: string; data: any } | null = null;
  isRefreshing = false;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.revenueChartData = this.reportsService.getMonthlyRevenueData();
    this.leadSourceData = this.reportsService.getLeadsBySourceData();
    this.pipelineFunnel = this.reportsService.getPipelineFunnelData();
    this.reportsService.performance$.subscribe(data => this.teamPerformance = data);
  }

  onFilterChange(): void {
    this.isRefreshing = true;
    setTimeout(() => {
      // Simulate real-time data recalculation based on range
      if (this.selectedDateRange === 'last_month') {
        this.totalRevenue = 540000;
        this.totalSalesCount = 42;
      } else if (this.selectedDateRange === 'this_year') {
        this.totalRevenue = 2450000;
        this.totalSalesCount = 180;
      } else {
        this.totalRevenue = 635000;
        this.totalSalesCount = 50;
      }
      this.isRefreshing = false;
    }, 400);
  }

  // Helper calculation for SVG Line Chart points
  getSvgPolylinePoints(): string {
    const maxVal = Math.max(...this.revenueChartData.map(d => d.value));
    const width = 500;
    const height = 180;
    
    return this.revenueChartData.map((d, index) => {
      const x = (index / (this.revenueChartData.length - 1)) * width;
      const y = height - ((d.value / maxVal) * (height - 20));
      return `${x},${y}`;
    }).join(' ');
  }

  exportData(format: 'PDF' | 'CSV' | 'Excel'): void {
    alert(`Exporting ${this.selectedCategory} Report as ${format}...`);
  }

  triggerDrilldown(title: string, dataPoint: any): void {
    this.selectedDrilldown = { title, data: dataPoint };
  }

  closeDrilldown(): void {
    this.selectedDrilldown = null;
  }
}