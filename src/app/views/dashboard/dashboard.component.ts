import { Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

export interface ISalesRepPerformance {
  name: string;
  role: string;
  assignedLeads: number;
  dealVelocityDays: number;
  quotaAttainmentPct: number;
  region: string;
  paymentTier: string;
  lastActive: string;
  avatar: string;
  status: 'success' | 'danger' | 'warning' | 'info' | 'secondary';
  progressColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    WidgetsDropdownComponent,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ChartjsComponent,
    CardFooterComponent,
    GutterDirective,
    ProgressComponent,
    WidgetsBrandComponent,
    CardHeaderComponent,
    TableDirective,
    AvatarComponent
  ]
})
export class DashboardComponent implements OnInit {
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  // Korvix CRM Sales Team Data
  public salesReps: ISalesRepPerformance[] = [
    {
      name: 'Alex Morgan',
      role: 'Enterprise AE',
      assignedLeads: 48,
      dealVelocityDays: 14,
      quotaAttainmentPct: 112,
      region: 'Us',
      paymentTier: 'Enterprise',
      lastActive: '2 mins ago',
      avatar: './assets/images/avatars/1.jpg',
      status: 'success',
      progressColor: 'success'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Senior Account Rep',
      assignedLeads: 35,
      dealVelocityDays: 21,
      quotaAttainmentPct: 95,
      region: 'Br',
      paymentTier: 'Professional',
      lastActive: '12 mins ago',
      avatar: './assets/images/avatars/2.jpg',
      status: 'success',
      progressColor: 'info'
    },
    {
      name: 'Liam O\'Connor',
      role: 'Mid-Market Representative',
      assignedLeads: 29,
      dealVelocityDays: 28,
      quotaAttainmentPct: 82,
      region: 'In',
      paymentTier: 'Growth',
      lastActive: '1 hour ago',
      avatar: './assets/images/avatars/3.jpg',
      status: 'warning',
      progressColor: 'warning'
    },
    {
      name: 'Elena Rostova',
      role: 'Lead SDR',
      assignedLeads: 62,
      dealVelocityDays: 9,
      quotaAttainmentPct: 125,
      region: 'Fr',
      paymentTier: 'Enterprise',
      lastActive: '3 hours ago',
      avatar: './assets/images/avatars/4.jpg',
      status: 'success',
      progressColor: 'success'
    }
  ];

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);

  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });

  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
  }

  public initCharts(): void {
    this.mainChartRef()?.stop();
    this.mainChart = this.#chartsData.mainChart;
  }

  public setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  public handleChartRef($chartRef: any): void {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  private updateChartOnColorModeChange(): void {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  private setChartStyles(): void {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }
}