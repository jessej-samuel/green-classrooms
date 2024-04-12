"use client";
import React, { useEffect } from "react";
import Chart from "chart.js";

export default function LastWeekConsumption() {
  const [chartData, setChartData] = React.useState([]);

  useEffect(() => {
    fetch("http://192.168.1.188:5000/last_5_day_consumption")
      .then((response) => response.json())
      .then((data) => {
        setChartData({
          labels: ["MON", "TUE", "WED", "THU", "FRI"],
          datasets: [
            {
              label: "Consumption",
              data: data.map((item) => item.tot),
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
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Last week consumption",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
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
                display: false,
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
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                Consumption
              </h6>
              <h2 className="text-white text-xl font-semibold">Last week</h2>
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
