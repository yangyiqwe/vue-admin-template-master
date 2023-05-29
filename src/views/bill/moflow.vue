<template>
  <div>
    <!-- 结果列表 -->
    <el-card>
      <el-row>
        <el-col >
          <el-button
            @click="openEditUI(null)"
            type="info" plain
            v-permission="['admin']">添加</el-button>
<!--          <el-button type="success" plain
                     @click="exportMoflow()">Excel导出</el-button>-->
          <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
            Excel导出
          </el-button>

        </el-col>
      </el-row>
      <el-table :data="moneyflowList" stripe :summary-method="getSummaries" show-summary>
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            <!-- (pageNo-1) * pageSize + index + 1 -->
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="moneyflowMoney" label="金额" >
        </el-table-column>
        <el-table-column prop="moneyflowDate" label="时间" :formatter="formatDate" >
        </el-table-column>
        <el-table-column prop="moneyflowPlace" label="地点" >
        </el-table-column>
        <el-table-column prop="moneyflowInfo" label="详细内容">
        </el-table-column>
        <el-table-column prop="moneyflowName" label="名字">
        </el-table-column>

        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.moneyflowId)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button @click="deleteMoneyflowById(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
          </template>
        </el-table-column>
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

    <!-- 账单流水编辑对话框 -->
    <el-dialog
      @close="clearForm"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="moneyflowForm" ref="moneyflowFormRef" :rules="rules">
        <el-form-item
          label="金额"
          prop="moneyflowMoney"
          :label-width="formLabelWidth"
        >
          <el-input v-model="moneyflowForm.moneyflowMoney" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" :label-width="formLabelWidth">

          <el-date-picker
            v-model="moneyflowForm.moneyflowDate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地点" :label-width="formLabelWidth">
          <el-input v-model="moneyflowForm.moneyflowPlace" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input v-model="moneyflowForm.moneyflowInfo" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="moneyflowForm.moneyflowName" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMoneyflow">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import checkPermission from '@/utils/permission' // 权限判断函数
  import permission from '@/directive/permission/index.js' // 权限判断指令
 import moneyflowApi from "@/api/moneyflowManage.js";

export default {
  directives: { permission },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }
        ]
      },
      moneyflowForm: {},
      formLabelWidth: "130px",
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      moneyflowList: [],
      rules: {
      },
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '个人账单',
      autoWidth: true,
      bookType: 'xlsx',
    }
  },
  methods: {
    // checkPermission,
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        if(index === 2 || index === 3 || index === 4 || index === 5){
          sums[index] = '';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if(data == null) {
        return null;
      }
      let dt = new Date(data)
      return dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月' + dt.getDate() + '日'
    },
    deleteMoneyflowById(moneyflow){
      this.$confirm(`您确认删除账单 ${moneyflow.moneyflowMoney} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        moneyflowApi.deleteMoneyflowById(moneyflow.moneyflowId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getMoneyflowList();
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    saveMoneyflow() {
      // 触发表单验证
      this.$refs.moneyflowFormRef.validate((valid) => {
        if (valid) {
          // 提交请求给后台
          moneyflowApi.saveMoneyflow(this.moneyflowForm).then(response => {
            // 成功提示
            this.$message({
              message: response.message,
              type: 'success'
            });
            // 关闭对话框
            this.dialogFormVisible = false;
            // 刷新表格
            this.getMoneyflowList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });

    },
    clearForm() {
      this.moneyflowForm = {};
      this.$refs.moneyflowFormRef.clearValidate();
    },
    openEditUI(id) {
      if( id == null){
        this.title = "新增个人账单";
      }else{
        this.title = "修改个人账单";
        // 根据id查询用户数据
        moneyflowApi.getMoneyflowById(id).then(response => {
          this.moneyflowForm = response.data;
        });
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getMoneyflowList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getMoneyflowList();
    },
    getMoneyflowList() {
      moneyflowApi.getMoneyflowList(this.searchModel).then((response) => {
        this.moneyflowList = response.data.rows;
        this.total = response.data.total;
        this.list=response.data.rows;
        this.listLoading = false
      });
    },
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
    // exportMoflow(){
    //   moneyflowApi.exportMoflow().then((res) => {
    //     const link = document.createElement("a");
    //     const blob = new Blob([res], {
    //       type: "application/vnd.ms-excel;charset=utf-8",
    //   });
    //     link.style.display = "none";
    //     link.href = URL.createObjectURL(blob);
    //     link.setAttribute("download", 词库数据.xls);
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     this.msgSuccess("导出成功");
    //   })
    // }
  },
  created() {
    this.getMoneyflowList();
  },
};
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}
.el-dialog .el-input {
  width: 85%;
}
</style>
