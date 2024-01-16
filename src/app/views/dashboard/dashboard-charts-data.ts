import { Injectable } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions
} from 'chart.js';

export type DeepPartial<T> = { [P in keyof T]?: _DeepPartial<T[P]> };
export type _DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? _DeepPartialArray<U>
    : T extends object
      ? DeepPartial<T>
      : T | undefined;
export interface _DeepPartialArray<T> extends Array<_DeepPartial<T>> {}

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type?: ChartType;
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
    const brandPrimary = '#4f46e5';
    const brandPrimaryBg = 'rgba(79, 70, 229, 0.12)';
    const brandSuccess = '#059669';
    const brandTarget = '#d97706';

    const pointsCount = period === 'Day' ? 7 : period === 'Month' ? 12 : 5;
    this.mainChart['Data1'] = [];
    this.mainChart['Data2'] = [];
    this.mainChart['Data3'] = [];

    for (let i = 0; i < pointsCount; i++) {
      this.mainChart['Data1'].push(this.random(120, 240));
      this.mainChart['Data2'].push(this.random(80, 180));
      this.mainChart['Data3'].push(150);
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
        pointBackgroundColor: brandPrimary,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: brandPrimary,
        pointHoverBorderWidth: 2,
        borderWidth: 2.5,
        fill: true
      },
      {
        data: this.mainChart['Data2'],
        label: 'Pipeline Forecast ($k)',
        backgroundColor: 'transparent',
        borderColor: brandSuccess,
        pointBackgroundColor: brandSuccess,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: brandSuccess,
        pointHoverBorderWidth: 2,
        borderWidth: 2
      },
      {
        data: this.mainChart['Data3'],
        label: 'Monthly Target ($k)',
        backgroundColor: 'transparent',
        borderColor: brandTarget,
        pointBackgroundColor: brandTarget,
        pointHoverBackgroundColor: brandTarget,
        borderWidth: 1.5,
        borderDash: [6, 4]
      }
    ];

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          labelColor: (context) => ({
            backgroundColor: context.dataset.borderColor as string,
            borderColor: context.dataset.borderColor as string
          })
        }
      }
    };

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales: this.getScales(),
      elements: {
        line: { tension: 0.3 },
        point: { radius: 3, hitRadius: 10, hoverRadius: 6 }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = { datasets, labels };
  }

  public getScales(): ScaleOptions<any> {
    return {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 12, weight: 500 } }
      },
      y: {
        beginAtZero: true,
        max: 300,
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          color: '#64748b',
          maxTicksLimit: 6,
          stepSize: 50,
          font: { size: 12 }
        }
      }
    };
  }
}