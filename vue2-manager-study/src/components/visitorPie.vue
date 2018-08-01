<template>
  <div>
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
  export default {
    props:['pieData'],
    mounted(){
      this.myChart = echarts.init(document.getElementById('main'));
      this.initData()
    },
    methods:{
      initData(){
        const option = {
    title : {
        text: '用户分布',
        subtext: '',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['北京','上海','深圳','杭州','其他']
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:this.pieData.beijing, name:'北京'},
                {value:this.pieData.shanghai, name:'上海'},
                {value:this.pieData.shenzhen, name:'深圳'},
                {value:this.pieData.hangzhou, name:'杭州'},
                {value:this.pieData.qita, name:'其他'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

this.myChart.setOption(option);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/base';
  #main{
    display:flex;
    justify-content: center;
    margin-top:20px;
  }
</style>
