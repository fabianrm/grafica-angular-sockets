import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;


  constructor(private http: HttpClient, private wsService: WebsocketService) { }
  ngOnInit(): void {
    this.getData();
    this.escucharSocket();
  }

  escucharSocket() {
    this.wsService.listen('cambio-grafica')
      .subscribe((data: any) => {
        console.log('Socket', data);
        this.barChartData.datasets[0].data = data[0].data[0];
        this.chart?.update();

      });
  }

  getData() {
    this.http.get('http://localhost:5000/grafica')
      .subscribe((data: any) => {
        console.log(data);
        this.barChartData.datasets[0].data = data[0].data[0];
        // this.chart?.update();
        // console.log('Objeto', this.barChartData.datasets);
      });
  }

  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: ['Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4'],
    datasets: [
      { data: [0, 0, 0, 0], label: 'Preguntas' },
    ],
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    // console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    // console.log(event, active);
  }


  //Para un boton random
  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
    ];

    this.chart?.update();

  }





}
