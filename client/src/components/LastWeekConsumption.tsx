"use client";
import React, { useEffect } from "react";
import Chart from "chart.js";

export default function LastWeekConsumption() {
  const [chartData, setChartData] = React.useState({
    labels: ["MON", "TUE", "WED", "THU", "FRI"],
    datasets: [
      {
        label: "Consumption",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    fetch("http://192.168.1.188:5000/last_5_day_consumption")
      .then((response) => response.json())
      .then((data) => {
        setChartData({
          labels: ["MON", "TUE", "WED", "THU", "FRI"],
          datasets: [
            {
              label: "Consumption",
              data: data.map((item: { tot: any }) =>
                parseFloat(item.tot.toFixed(2))
              ),
              backgroundColor: "rgba(75, 192, 192, 0.8)",
              borderWidth: 1,
            },
          ],
        });
      });
  }, []);

  React.useEffect(() => {
    console.log(chartData);
    var config = {
      type: "bar",
      data: chartData,
      options: {
        maintainAspectRatio: true,
        responsive: true,
        title: {
          display: false,
          text: "Last week consumption",
          fontColor: "white",
        },
        legend: {
          display: false,
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Day",
                fontColor: "white",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Consumption",
                fontColor: "white",
              },
            },
          ],
        },
      },
    };
    var ctx = document.getElementById("line-chart").getContext("2d");
    window.myLine = new Chart(ctx, config);
  }, [chartData]);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h2 className="text-white text-2xl font-normal">Usage time</h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
