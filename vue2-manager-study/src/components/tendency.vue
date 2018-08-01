<template>
  <div class="data_charts">
    <div id="main" style="width: 90%;height:450px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  props: ["sevenDay", "sevenData"],
  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));
    this.initData();
  },
  methods: {
    initData() {
      const option = {
        title: {
          text: "走势图",
          subtext: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["新注册用户", "新增订单", "新增管理员"]
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.sevenDay
        },
        yAxis: [
          {
            type: "value",
            name: "用户",
            min: 0,
            max: 200,
            position: "left",
            axisLine: {
              lineStyle: {
                color: "#999"
              }
            },
            axisLabel: {
              formatter: "{value}"
            }
          },
          {
            type: "value",
            name: "订单",
            min: 0,
            max: 200,
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#999"
              }
            },
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        series: [
          {
            name: "新注册用户",
            type: "line",
            data: this.sevenData[0],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            }
          },
          {
            name: "新增订单",
            type: "line",
            data: this.sevenData[1],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            }
          },
          {
            name: "新增管理员",
            type: "line",
            data: this.sevenData[2],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
.data_charts {
  display: flex;
  justify-content: center;
}
</style>

