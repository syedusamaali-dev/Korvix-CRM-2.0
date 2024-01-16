import { Injectable } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions, ChartType, PluginOptionsByType, ScaleOptions, TooltipLabelStyle } from 'chart.js';
import { DeepPartial } from './utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;
  [propName: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardChartsData {
  public mainChart: IChartProps = { type: 'line' };

  constructor() {
    this.initMainChart('Month');
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public initMainChart(period: string = 'Month'): void {
    const brandPrimary = '#6366f1';
    const brandSuccess = '#10b981';
    const brandTarget = '#f59e0b';
    const brandPrimaryBg = 'rgba(99, 102, 241, 0.1)';

    const pointsCount = period === 'Day' ? 7 : period === 'Month' ? 12 : 5;
    this.mainChart['Data1'] = []; // Won Revenue ($k)
    this.mainChart['Data2'] = []; // Pipeline Target ($k)
    this.mainChart['Data3'] = []; // Revenue Target / BEP ($k)

    for (let i = 0; i < pointsCount; i++) {
      this.mainChart['Data1'].push(this.random(120, 240));
      this.mainChart['Data2'].push(this.random(80, 180));
      this.mainChart['Data3'].push(150); // Target line
    }

    let labels: string[] = [];
    if (period === 'Month') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    } else if (period === 'Day') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else {
      labels = ['2022', '2023', '2024', '2025', '2026'];
    }

    const datasets: ChartDataset[] = [
      {
        data: this.mainChart['Data1'],
        label: 'Closed Revenue ($k)',
        backgroundColor: brandPrimaryBg,
        borderColor: brandPrimary,
        pointHoverBackgroundColor: brandPrimary,
        borderWidth: 2,
        fill: true
      },
      {
        data: this.mainChart['Data2'],
        label: 'Pipeline Forecast ($k)',
        backgroundColor: 'transparent',
        borderColor: brandSuccess,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2
      },
      {
        data: this.mainChart['Data3'],
        label: 'Monthly Target ($k)',
        backgroundColor: 'transparent',
        borderColor: brandTarget,
        pointHoverBackgroundColor: brandTarget,
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: { display: false },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales: this.getScales(),
      elements: {
        line: { tension: 0.35 },
        point: { radius: 2, hitRadius: 10, hoverRadius: 5 }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = { datasets, labels };
  }

  public getScales(): ScaleOptions<any> {
    return {
      x: {
        grid: { drawOnChartArea: false },
        ticks: { color: '#64748b' }
      },
      y: {
        beginAtZero: true,
        max: 300,
        ticks: {
          color: '#64748b',
          maxTicksLimit: 6,
          stepSize: 50
        }
      }
    };
  }
}