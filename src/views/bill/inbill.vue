<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.inbillConnection"
            placeholder="需方"
            clearable
          ></el-input>
          <el-date-picker
            v-model="searchModel.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            :picker-options="pickerOptions0">
          </el-date-picker>
          <el-date-picker
            v-model="searchModel.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            :picker-options="pickerOptions1">
          </el-date-picker>
          <el-select v-model="searchModel.inbillArtice" placeholder="品名">
            <el-option
              v-for="item in options"
              :key="item.articleId"
              :label="item.articleName"
              :value="item.articleName">
            </el-option>
          </el-select>
          <el-select v-model="searchModel.inbillSpci" placeholder="规格/米" style="margin-top: 10px">
            <el-option
              v-for="item in spciOptions"
              :key="item.styleName"
              :label="item.styleName"
              :value="item.styleName">
            </el-option>
          </el-select>
          <ul style="padding-left: 0px">
            <li>
              <el-button style="margin-top: 10px"
                         @click="getInbillList"
                         type="primary"
                         round
                         icon="el-icon-search"
              >查询</el-button>
            </li>
            <li>
              <el-button :loading="downloadLoading" type="primary" style="margin-top: 10px" round  icon="el-icon-download" @click="handleDownload">
                Excel导出
              </el-button>
            </li>
            <li>
              <el-upload class="upload-demo"
                         :auto-upload="true"
                         :multiple="false"
                         :limit="1"
                         :on-exceed="fileUploadExceed"
                         :on-success="fileUploadSuccess"
                         :on-error="fileUploadError"
                         :action="importUrl"
                         name="file"
                         accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              >
                <!--accept 只接受某种格式的文件-->
                <el-button style="height: 40px" icon="el-icon-upload" round type="primary">Excel导入</el-button>
              </el-upload>
            </li>
            <li>
              <el-button type="primary" style="cursor:pointer;margin-top: 10px" round  @click="downloadExcel">Excel导入模板</el-button>
            </li>
            <li>
              <el-button type="primary" round icon="el-icon-loading" style="margin: 10px " @click="daochu">
                <template #icon>
                  <el-icon><Download /></el-icon>
                </template>
                已结账导出</el-button>
            </li>
          </ul>
        </el-col>

<!--        <el-col :span="4" align="right">
          <el-button
            @click="openEditUI(null)"
            type="primary"
            icon="el-icon-plus"
            circle
          ></el-button>
        </el-col>-->
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="inbillList" stripe :summary-method="getSummaries" show-summary style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
              scope.$index+1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="inbillConnection" label="需方"></el-table-column>
        <el-table-column prop="inbillDate" label="日期"></el-table-column>
        <el-table-column prop="inbillArtice" label="品名"></el-table-column>
        <el-table-column prop="inbillSpci" label="规格/米"></el-table-column>
        <el-table-column prop="inbillNum" label="数量"></el-table-column>
        <el-table-column prop="inbillTotal" label="小计/米"></el-table-column>
        <el-table-column prop="inbillReceiving" label="收货人"></el-table-column>
        <el-table-column prop="inbillCotent" label="备注"></el-table-column>
        <el-table-column prop="inbillInrent" label="收租金"></el-table-column>
        <el-table-column prop="inbillInrentPeople" label="收款人"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.inbillId)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button @click="deleteInbillById(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[10, 20, 50,100,total]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 用户信息编辑对话框 -->
    <el-dialog
      @close="clearForm"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="inbillForm" ref="inbillFormRef" :label-position="labelPosition" label-width="80px" >
        <el-form-item label="需方">
          <el-input v-show="isedit"  v-model="inbillForm.inbillConnection" autocomplete="off"></el-input>
          <el-select v-show="isadd"
                     v-model="inbillForm.inbillConnection"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="需方"
                     :remote-method="remoteMethod"
                     :loading="loading">
            <el-option
              v-for="item in connoptions"
              :key="item.connectionId"
              :label="item.connectionUserName"
              :value="item.connectionUserName">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="日期">

          <el-date-picker
            v-model="inbillForm.inbillDate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="品名">
          <el-select v-model="inbillForm.inbillArtice" placeholder="品名" @change="blurArtice">
            <el-option
              v-for="item in options"
              :key="item.articleId"
              :label="item.articleName"
              :value="item.articleName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格/米" v-show="isArtice">
          <el-select v-model="inbillForm.inbillSpci" placeholder="规格/米"  v-show="isedit"><!--@change="change"-->
            <el-option
              v-for="item in spciOptions"
              :key="item.styleName"
              :label="item.styleName"
              :value="item.styleName">
            </el-option>
          </el-select>

          <el-select v-model="inbillSpcis"  multiple placeholder="规格/米"  v-show="isadd"><!--@change="change"-->
            <el-option
              v-for="item in spciOptions"
              :key="item.styleName"
              :label="item.styleName"
              :value="item.styleName">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="inbillForm.inbillNum" autocomplete="off"  v-show="isedit"></el-input><!--@change="change"-->

          <el-select
            v-model="inbillNums"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入数量" v-show="isadd">
          </el-select>
        </el-form-item>
        <el-form-item label="小计/米" v-show="isedit">
          <el-input v-model="inbillForm.inbillTotal" autocomplete="off" ></el-input><!--@change="change"-->
        </el-form-item>
        <el-form-item label="收货人">
          <el-select v-model="inbillForm.inbillReceiving" placeholder="收货人">
            <el-option
              v-for="item in moneymanOptions"
              :key="item.putmanName"
              :label="item.putmanName"
              :value="item.putmanName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="inbillForm.inbillCotent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收租金">
          <el-input v-model="inbillForm.inbillInrent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收款人">
          <el-select v-model="inbillForm.inbillInrentPeople" placeholder="收款人">
            <el-option
              v-for="item in moneymanOptions"
              :key="item.putmanName"
              :label="item.putmanName"
              :value="item.putmanName">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveInbill">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import inbillApi from '@/api/inbillManage'
  import article from '@/api/articleManage'
  import connectionApi from "@/api/connectionManage";
  import styleApi from  "@/api/styleManage"
  import putManApi from "@/api/putManManage"

  export default {
    data() {
      return {
        importUrl: 'http://localhost:8888/inbill/import',
        filename:'',
        downloadLoading: false,
        inbillNums:[],
        inbillSpcis:[],
        labelPosition: 'right',
        title: "",
        isadd:false,
        isedit:false,
        isArtice:true,
        connoptions:[],
        spciOptions:[],
        list: [],
        downloadlist:null,
        loading: false,
        inbillForm:{},
        dialogFormVisible: false,
        total: 0,
        inbillList:[],
        searchModel: {
          pageNo: 1,
          pageSize: 10,
        },
        options: [],
        moneymanOptions:[],
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.searchModel.endTime) {//如果结束时间不为空，则小于开始时间
              return new Date(this.searchModel.endTime).getTime() < time.getTime()
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.searchModel.startTime) {//如果开始时间不为空，则结束时间大于开始时间
              return new Date(this.searchModel.startTime).getTime() > time.getTime()
            }
          }
        },
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
      }
    },
    methods:{
      daochu() {
        window.open('http://localhost:8888/inbill/checkoutexport')
      },
      downloadExcel () {
        // templatefile.xlsx存储在public文件夹下
        let a = document.createElement('a')
        // a.href
        // 点击前往其他站点
        // 指向本站点的某个文件，比如图片
        a.href = './入库表.xlsx'
        // download 属性 H5的新增属性.指定且只能指定，下载后的默认文件名字和文件后缀。
        a.download = '入库表.xlsx'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      },
      // 上传多于一个文件时
      fileUploadExceed() {
        this.$message.warning('只能选取一个文件')
      },
      //上传成功回调
      fileUploadSuccess(response) {
        if (response.code === 0) {
          this.$message.success('数据导入成功')
          this.dialogVisible = false
        } else {
          this.$message.error(response.message)
        }
      },
      //上传失败回调
      fileUploadError(error) {
        this.$message.error('数据导入失败')
      },
      blurArtice:function(){
        if(this.inbillForm.inbillArtice!="钢管"){
          this.isArtice=false;
        }else
          this.isArtice=true;
      },
      //el-select远程搜索
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.connoptions = this.list.filter(item => {
              return item.connectionUserName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
            console.log('item'+ this.connoptions )
          }, 200);
        } else {
          this.options = [];
        }
      },
      //table 合计
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if(index === 4 || index === 8 || index === 9 || index === 10){
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
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getInbillList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getInbillList();
      },
      deleteInbillById(inbill){
        this.$confirm(`您确认删除这条出库单 ${inbill.inbillConnection} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          inbillApi.deleteInbillById(inbill.inbillId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getInbillList();
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      saveInbill() {
        // 触发表单验证
        this.$refs.inbillFormRef.validate((valid) => {
          if (valid) {
            this.inbillForm.inbillConnection=this.inbillForm.inbillConnection.toString();
            this.$set(this.inbillForm, "inbillSpcis", this.inbillSpcis);//添加inbillSpcis数组
            this.$set(this.inbillForm, "inbillNums", this.inbillNums);//添加inbillNums数组
            // 提交请求给后台
            inbillApi.saveInbill(this.inbillForm).then(response => {
              // 成功提示
              this.$message({
                message: response.message,
                type: 'success'
              });
              // 关闭对话框
              this.dialogFormVisible = false;
              // 刷新表格
              this.getInbillList();
            });
          } else {
            console.log("提交错误!!");
            return false;
          }
        })
      },
      clearForm() {
        this.inbillForm = {};
        this.$refs.inbillFormRef.clearValidate();
      },
      openEditUI(id) {
        if( id == null){
          this.title = "新增入库";
          this.isadd=true;
          this.isedit=false;
        }else{
          this.title = "修改入库";
          this.isedit=true;
          this.isadd=false
          // 根据id查询客户数据
          inbillApi.getInbillById(id).then(response => {
            this.inbillForm = response.data;
          });
        }
        this.dialogFormVisible = true;
      },
      getInbillList() {
        inbillApi.getInbillList(this.searchModel).then((response) => {
          this.total = response.data.total;
          this.inbillList = response.data.rows;
          console.log('inbillList:'+JSON.stringify(response.data.rows))
          this.downloadlist= response.data.rows;
        });
      },
      getArticleAll() {
        article.getArticleAll().then((response) => {
          this.options = response.data;
        });
      },
      getConnectionAll() {
        connectionApi.getConnectionAll().then((response) => {
          this.list=response.data;
        });
      },
      getStyleList(){
        styleApi.getStyleList().then((response) => {
          this.spciOptions=response.data;
        })
      },
      getPutManList(){
        putManApi.getPutManList().then((response) => {
          this.moneymanOptions=response.data;
        })
      },
      handleDownload() {//excel导出
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['需方', '日期', '品名', '规格/米','数量','小计/米','收货人','备注','收租金','收款人']
          const filterVal = ['inbillConnection', 'inbillDate', 'inbillArtice', 'inbillSpci','inbillNum','inbillTotal','inbillReceiving','inbillCotent','inbillInrent','inbillInrentPeople']
          this.filename='入库表'
          const downLoadList = this.downloadlist
          const data = this.formatJson(filterVal, downLoadList)
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
    },
    created() {
      this.getInbillList();
    },
    mounted(){
      this.getArticleAll();
      this.getConnectionAll();
      this.getStyleList();
      this.getPutManList();
    }
  }
</script>

<style scoped>
.upload-demo{
  float: right;
  margin-top: 10px;
}
ul li{
  list-style-type:none;
  float: left;
  padding: 0px 10px 0px 10px;
}
</style>
