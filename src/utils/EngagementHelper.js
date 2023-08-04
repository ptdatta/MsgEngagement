import Highcharts from "highcharts";

const engagementMessageOverTimeChartOptions = (messageCountList, channels) => {
  const filteredChannels = channels.filter((channel) => {
    const messageCountForChannel = messageCountList.filter(
      (messageCount) => messageCount.channelId === channel.value
    );
    return messageCountForChannel.length > 1;
  });

  const seriesData = filteredChannels.map((channel) => {
    const data = messageCountList
      .filter((messageCount) => messageCount.channelId === channel.value)
      .map((messageCount) => ({
        x: new Date(messageCount.timeBucket).getTime(),
        y: parseInt(messageCount.count),
      }));
    return { name: channel.name, data };
  });

  const options = {
    chart: {
      type: "spline",
      backgroundColor: "#22222c",
      style: {
        color: "white",
      },
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: "white",
      },
      itemHoverStyle: {
        color: "#d1d1d1",
      },
    },
    title: {
      text: "Engagement Messages Over Time",
      style: {
        color: "white",
      },
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
        style: {
          color: "#a7a8a8",
        },
      },
      tickInterval: 24 * 3600 * 1000,
      labels: {
        style: {
          color: "#a7a8a8",
        },
        formatter: function () {
          const date = new Date(this.value);
          return Highcharts.dateFormat("%b %e", date);
        },
      },
    },
    yAxis: {
      title: {
        text: "Message Count",
        style: {
          color: "#a7a8a8",
        },
      },
      labels: {
        style: {
          color: "#a7a8a8",
        },
      },
      gridLineWidth: 0,
    },
    tooltip: {
      borderWidth: 2,
      borderColor: "#34ebd8",
      backgroundColor: "black",
      style: {
        color: "white",
      },
      formatter: function () {
        return `
              <b>${this.series.name}</b><br/>
              ${this.y} messages on ${Highcharts.dateFormat(
          "%e %b",
          new Date(this.x)
        )}
            `;
      },
    },
    series: seriesData,
    plotOptions: {
      series: {
        color: "#34ebd8",
        marker: {
          enabled: false,
        },
        events: {
          mouseOver: function () {
            this.update({
              marker: {
                enabled: true,
              },
            });

            this.chart.xAxis[0].addPlotLine({
              value: this.x,
              color: "white",
              width: 1.5,
              zIndex: 10,
              id: "hover-line",
            });
          },
          mouseOut: function () {
            this.update({
              marker: {
                enabled: false,
              },
            });

            this.chart.xAxis[0].removePlotLine("hover-line");
          },
        },
      },
    },
  };
  return options;
};

export default { engagementMessageOverTimeChartOptions };
