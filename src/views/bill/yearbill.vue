<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.yearbillName"
            placeholder="客户名"
            clearable
          ></el-input>
          <el-select v-model="searchModel.yearbillDate" placeholder="年份">
            <el-option
              v-for="item in options"
              :key="item.yearName"
              :label="item.yearName"
              :value="item.yearName">
            </el-option>
          </el-select>
          <el-select v-model="searchModel.yearbillSaa" placeholder="是否清账">
            <el-option
              v-for="item in saaoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-button
            @click="getYearbillList"
            type="primary"
            round
            icon="el-icon-search"
          >查询</el-button>
          <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
            Excel导出
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="yearbillList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
              scope.$index+1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="yearbillName" label="姓名"></el-table-column>
        <el-table-column prop="yearbillRent" label="租金"></el-table-column>
        <el-table-column prop="yearbillContent" label="备注"></el-table-column>
        <el-table-column prop="yearbillOutnum" label="出库米数"></el-table-column>
        <el-table-column prop="yearbillInnum" label="入库米数"></el-table-column>
        <el-table-column prop="yearbillOutkouzi" label="扣子出库"></el-table-column>
        <el-table-column prop="yearbillInkouzi" label="扣子人库"></el-table-column>
        <el-table-column prop="yearbillOutyoudin" label="油顶出库"></el-table-column>
        <el-table-column prop="yearbillInyoudin" label="油顶入库"></el-table-column>
        <el-table-column prop="yearbillDate" label="年份"></el-table-column>
<!--        <el-table-column prop="yearbillOutceban" label="侧板出库"></el-table-column>
        <el-table-column prop="yearbillInceban" label="侧板入库"></el-table-column>
        <el-table-column prop="yearbillOutmoban" label="模板出库"></el-table-column>
        <el-table-column prop="yearbillInmoban" label="模板入库"></el-table-column>
        <el-table-column prop="yearbillOuttaotong" label="套筒出库"></el-table-column>
        <el-table-column prop="yearbillIntaotong" label="套筒入库"></el-table-column>
        <el-table-column prop="yearbillOutbbjin" label="步步紧出库"></el-table-column>
        <el-table-column prop="yearbillInbbjin" label="步步紧入库"></el-table-column>
        <el-table-column prop="yearbillOutduanjie" label="短接出库"></el-table-column>
        <el-table-column prop="yearbillInduanjie" label="短接入库"></el-table-column>-->
        <el-table-column prop="yearbillSaa" label="是否清账"></el-table-column>
<!--        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.yearbillId)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button @click="deleteYearbillById(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[10, 20, 50,total]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

  </div>
</template>

<script>
import yearbillApi from "@/api/yearbillManage"
import yearApi from "@/api/yearManage"

  export default {
    data() {
      return {
        downloadLoading: false,
        list: null,
        title: "",
        total: 0,
        yearbillList:[],
        searchModel: {
          pageNo: 1,
          pageSize: 10,
        },
        options: [],
        saaoptions: [{
          value: '是',
          label: '是'
        },
          {
            value: '否',
            label: '否'
          },
          {
            value: '未知',
            label: '未知'
          }]
      }
    },
    methods:{
      handleDownload() {//excel导出
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['时间', '地点', '内容', '金额','名字']
          const filterVal = ['moneyflowDate', 'moneyflowPlace', 'moneyflowInfo', 'moneyflowMoney','moneyflowName']
          const list = this.list
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getYearbillList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getYearbillList();
      },
      getYearbillList() {
        yearbillApi.getYearbillList(this.searchModel).then((response) => {
          this.total = response.data.total;
          this.yearbillList = response.data.rows;
          this.list=response.data.rows;
        });
      },
      getYearList(){
        yearApi.getYearList().then((response) => {
          this.options=response.data;
        })
      }
    },
    created(){
      this.getYearbillList();
      this.getYearList();
    }
  }
</script>

<style scoped>

</style>
