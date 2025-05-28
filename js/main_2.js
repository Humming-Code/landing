const { AgCharts } = agCharts;

const formatDate = (value) => {
  return Intl.DateTimeFormat("en-GB").format(value);
};

const formatNumber = (value) => {
  return `${Math.floor(value)}억`;
};

const options = {
  container: document.getElementById("myChart"),
  data: getData(),
  title: {
    text: "서비스 도입 후 매출 변화 추이 (실제 데이터)",
  },
  subtitle: {
    text: "IN KOREAN WON",
  },
  series: [
    {
      type: "area",
      xKey: "date",
      yKey: "sales",
      yName: "Sales",
      strokeWidth: 1,
      fill: {
        type: "gradient",
        colorStops: [
          { color: "#ffffff", stop: 0 },
          { color: "#7da9e8", stop: 0.75 },
          { color: "#2c6ed5", stop: 1 },
        ],
      },
      label: {
        enabled: true,
        formatter: ({ xKey, yKey, datum }) => {
          const dates = [
            formatDate(new Date(2008, 9, 11)),
            formatDate(new Date(2012, 9, 26)),
            formatDate(new Date(2017, 0, 8)),
            formatDate(new Date(2020, 10, 25)),
            formatDate(new Date(2023, 0, 1)),
          ];
          return dates.includes(formatDate(datum[xKey]))
            ? formatNumber(datum[yKey])
            : "";
        },
      },
    },
  ],
  axes: [
    {
      type: "time",
      position: "bottom",
      unit: "month",
    },
    {
      type: "number",
      position: "left",
      label: {
        formatter: ({ value }) => formatNumber(value),
      },
    },
  ],
};

AgCharts.create(options);
