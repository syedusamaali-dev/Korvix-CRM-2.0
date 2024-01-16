import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormCheckLabelDirective,
  ProgressComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

interface ISalesRep {
  name: string;
  role: string;
  assignedLeads: number;
  avatar: string;
  status: 'success' | 'warning' | 'danger' | 'info';
  region: string;
  quotaAttainmentPct: number;
  dealVelocityDays: number;
  paymentTier: 'Enterprise' | 'Professional' | 'Growth';
  lastActive: string;
  progressColor: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    ButtonDirective,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ProgressComponent,
    AvatarComponent,
    TableDirective,
    IconDirective,
    ChartjsComponent
  ]
})
export class DashboardComponent implements OnInit {
  public mainChart: IChartProps = { type: 'line' };

  public kpiChartsData: any[] = [];
  public kpiChartsOptions: any[] = [];

  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  public salesReps: ISalesRep[] = [
    {
      name: 'Alex Morgan',
      role: 'Senior AE',
      assignedLeads: 42,
      avatar: './assets/images/avatars/1.jpg',
      status: 'success',
      region: 'Us',
      quotaAttainmentPct: 112,
      dealVelocityDays: 14,
      paymentTier: 'Enterprise',
      lastActive: '5 min ago',
      progressColor: 'success'
    },
    {
      name: 'Sarah Chen',
      role: 'Account Executive',
      assignedLeads: 28,
      avatar: './assets/images/avatars/2.jpg',
      status: 'warning',
      region: 'Gb',
      quotaAttainmentPct: 88,
      dealVelocityDays: 18,
      paymentTier: 'Enterprise',
      lastActive: '12 min ago',
      progressColor: 'info'
    },
    {
      name: 'Marcus Vance',
      role: 'SDR Lead',
      assignedLeads: 65,
      avatar: './assets/images/avatars/3.jpg',
      status: 'success',
      region: 'De',
      quotaAttainmentPct: 95,
      dealVelocityDays: 21,
      paymentTier: 'Professional',
      lastActive: '1 hour ago',
      progressColor: 'primary'
    },
    {
      name: 'Elena Rostova',
      role: 'Enterprise AE',
      assignedLeads: 19,
      avatar: './assets/images/avatars/4.jpg',
      status: 'danger',
      region: 'Fr',
      quotaAttainmentPct: 45,
      dealVelocityDays: 30,
      paymentTier: 'Growth',
      lastActive: '3 hours ago',
      progressColor: 'danger'
    }
  ];

  constructor(private chartsData: DashboardChartsData) {}

  ngOnInit(): void {
    this.initMainChart();
    this.initKpiCharts();
  }

  public initMainChart(): void {
    this.mainChart = this.chartsData.mainChart;
  }

  public setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.mainChart = this.chartsData.mainChart;
  }

  public handleChartRef(event: any): void {
    if (event) {
      setTimeout(() => {
        event.update();
      }, 50);
    }
  }

  private initKpiCharts(): void {
    const sharedOptions = {
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      maintainAspectRatio: false,
      scales: {
        x: { display: false },
        y: { display: false }
      },
      elements: {
        line: { tension: 0.4 },
        point: { radius: 0, hoverRadius: 4 }
      }
    };

    // 1. Active Leads (Indigo)
    this.kpiChartsData[0] = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Active Leads',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        pointBackgroundColor: '#ffffff',
        data: [65, 59, 84, 84, 51, 55, 40],
        borderWidth: 2
      }]
    };
    this.kpiChartsOptions[0] = { ...sharedOptions };

    // 2. Closed Revenue (Emerald)
    this.kpiChartsData[1] = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Revenue ($k)',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        pointBackgroundColor: '#ffffff',
        data: [1, 18, 9, 17, 34, 22, 62],
        borderWidth: 2
      }]
    };
    this.kpiChartsOptions[1] = { ...sharedOptions };

    // 3. Lead Win Rate (Amber)
    this.kpiChartsData[2] = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Win Rate (%)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.9)',
        data: [78, 81, 80, 45, 34, 12, 40],
        fill: true,
        borderWidth: 2
      }]
    };
    this.kpiChartsOptions[2] = { ...sharedOptions };

    // 4. Pipeline Deals (Rose Red)
    this.kpiChartsData[3] = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets: [{
        label: 'Deals',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderColor: 'transparent',
        data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84],
        barPercentage: 0.6
      }]
    };
    this.kpiChartsOptions[3] = { ...sharedOptions };
  }
}