<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.outbillConnection"
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
          <el-select v-model="searchModel.outbillArtice" placeholder="品名">
            <el-option
              v-for="item in options"
              :key="item.articleId"
              :label="item.articleName"
              :value="item.articleName">
            </el-option>
          </el-select>
<!--          <el-input
            v-model="searchModel.outbillSpci"
            placeholder="规格/米"
            clearable
            style="margin-top: 10px"
          ></el-input>-->
          <el-select v-model="searchModel.outbillSpci" placeholder="规格/米" style="margin-top: 10px">
            <el-option
              v-for="item in spciOptions"
              :key="item.styleName"
              :label="item.styleName"
              :value="item.styleName">
            </el-option>
          </el-select>
          <ul style="padding-left: 0px">
            <li>
              <el-button
                         @click="getOutbillList"
                         type="primary"
                         round
                         icon="el-icon-search"
              >查询</el-button>
            </li>
            <li>
              <el-button  :loading="downloadLoading" type="primary" round  icon="el-icon-download" @click="handleDownload">
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
              <el-button type="primary" style="cursor:pointer" round  @click="downloadExcel">Excel导入模板</el-button>
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
      <el-table :data="outbillList" stripe :summary-method="getSummaries" show-summary style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
              scope.$index+1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="outbillConnection" label="需方"></el-table-column>
        <el-table-column prop="outbillDate" label="日期"></el-table-column>
        <el-table-column prop="outbillArtice" label="品名"></el-table-column>
        <el-table-column prop="outbillSpci" label="规格/米"></el-table-column>
        <el-table-column prop="outbillNum" label="数量"></el-table-column>
        <el-table-column prop="outbillArticleTotl" label="小计/米"></el-table-column>
        <el-table-column prop="outbillCashmoney" label="押金"></el-table-column>
        <el-table-column prop="outbillCashmoneyman" label="押金收款人"></el-table-column>
        <el-table-column prop="outbillSendgoodName" label="发货人"></el-table-column>
        <el-table-column prop="outbillContent" label="备注"></el-table-column>
        <el-table-column prop="outbillPutrest" label="收租金"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button @click="deleteOutbillById(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
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
      <el-form :model="outbillForm" ref="outbillFormRef" :label-position="labelPosition" label-width="80px" ><!-- :rules="rules" -->
        <el-form-item label="需方">
          <el-input v-show="isedit"  v-model="outbillForm.outbillConnection" autocomplete="off"></el-input>
          <el-select v-show="isadd"
            v-model="outbillForm.outbillConnection"
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
            v-model="outbillForm.outbillDate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="品名">
<!--          <el-input v-model="outbillForm.outbillArtice" autocomplete="off"></el-input>-->
          <el-select v-model="outbillForm.outbillArtice" placeholder="品名" @change="blurArtice">
            <el-option
              v-for="item in options"
              :key="item.articleId"
              :label="item.articleName"
              :value="item.articleName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格/米" v-show="isArtice">
<!--          <el-input v-model="outbillForm.outbillSpci" autocomplete="off"></el-input>-->
          <el-select v-model="outbillForm.outbillSpci" placeholder="规格/米"  v-show="isedit"><!--@change="change"-->
            <el-option
              v-for="item in spciOptions"
              :key="item.styleName"
              :label="item.styleName"
              :value="item.styleName">
            </el-option>
          </el-select>

          <el-select v-model="outbillSpcis"  multiple placeholder="规格/米"  v-show="isadd"><!--@change="change"-->
            <el-option
              v-for="item in spciOptions"
              :key="item.styleName"
              :label="item.styleName"
              :value="item.styleName">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="outbillForm.outbillNum" autocomplete="off"  v-show="isedit"></el-input><!--@change="change"-->

          <el-select
            v-model="outbillNums"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入数量" v-show="isadd">
          </el-select>
        </el-form-item>
        <el-form-item label="小计/米" v-show="isedit">
          <el-input v-model="outbillForm.outbillArticleTotl" autocomplete="off" ></el-input><!--@change="change"-->
        </el-form-item>
        <el-form-item label="押金" >
          <el-input v-model="outbillForm.outbillCashmoney" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收押金">
<!--          <el-input v-model="outbillForm.outbillCashmoneyman" autocomplete="off"></el-input>-->
          <el-select v-model="outbillForm.outbillCashmoneyman" placeholder="收押金">
            <el-option
              v-for="item in moneymanOptions"
              :key="item.putmanName"
              :label="item.putmanName"
              :value="item.putmanName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货人">
<!--          <el-input v-model="outbillForm.outbillSendgoodName" autocomplete="off"></el-input>-->
          <el-select v-model="outbillForm.outbillSendgoodName" placeholder="发货人">
            <el-option
              v-for="item in moneymanOptions"
              :key="item.putmanName"
              :label="item.putmanName"
              :value="item.putmanName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="outbillForm.outbillContent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收租金">
          <el-input v-model="outbillForm.outbillPutrest" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOutbill">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import outbillApi from '@/api/outbillManage'
  import article from '@/api/articleManage'
  import connectionApi from "@/api/connectionManage";
  import styleApi from  "@/api/styleManage"
  import putManApi from "@/api/putManManage"
  export default {
    data() {
      return {
        importUrl: 'http://localhost:8888/outbill/import',
        filename:'',
        downloadLoading: false,
        outbillNums:[],
        outbillSpcis:[],
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
        outbillForm:{},
        dialogFormVisible: false,
        total: 0,
        outbillList:[],
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
      downloadExcel () {
        // templatefile.xlsx存储在public文件夹下
        let a = document.createElement('a')
        // a.href
        // 点击前往其他站点
        // 指向本站点的某个文件，比如图片
        a.href = './出库表.xlsx'
        // download 属性 H5的新增属性.指定且只能指定，下载后的默认文件名字和文件后缀。
        a.download = '出库表.xlsx'
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
      /* change:function () {//自动相乘--规格*数量
        let that=this;
        if(that.outbillForm.outbillSpci!=''&that.outbillForm.outbillNum!=''){
          that.outbillForm.outbillArticleTotl=that.outbillForm.outbillSpci*that.outbillForm.outbillNum;
          if(isNaN(that.outbillForm.outbillArticleTotl)){
            that.outbillForm.outbillArticleTotl="";
          }
        }
      }, */
      blurArtice:function(){
        if(this.outbillForm.outbillArtice!="钢管"){
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
          if(index === 4 || index === 7 || index === 10 || index === 8 || index === 9 || index === 11 || index === 3){
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
        this.getOutbillList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getOutbillList();
      },
      deleteOutbillById(outbill){
        this.$confirm(`您确认删除这条出库单 ${outbill.outbillConnection} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          outbillApi.deleteOutbillById(outbill.id).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getOutbillList();
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      saveOutbill() {
        // 触发表单验证
        this.$refs.outbillFormRef.validate((valid) => {
          if (valid) {
            debugger
            this.outbillForm.outbillConnection=this.outbillForm.outbillConnection.toString();
            console.log("this.outbillSpcis"+this.outbillSpcis)
            this.$set(this.outbillForm, "outbillSpcis", this.outbillSpcis);//添加outbillSpcis数组
            this.$set(this.outbillForm, "outbillNums", this.outbillNums);//添加outbillNums数组
            console.log("this.outbillForm"+JSON.stringify(this.outbillForm))
            // 提交请求给后台
            outbillApi.saveOutbill(this.outbillForm).then(response => {
              // 成功提示
              this.$message({
                message: response.message,
                type: 'success'
              });
              // 关闭对话框
              this.dialogFormVisible = false;
              // 刷新表格
              this.getOutbillList();
            });
          } else {
            console.log("提交错误!!");
            return false;
          }
        })
      },
      clearForm() {
        this.outbillForm = {};
        this.$refs.outbillFormRef.clearValidate();
      },
      openEditUI(id) {
        if( id == null){
          this.title = "新增出库";
          this.isadd=true;
          this.isedit=false;
        }else{
          this.title = "修改出库";
          this.isedit=true;
          this.isadd=false
          // 根据id查询客户数据
          outbillApi.getOutbillById(id).then(response => {
            this.outbillForm = response.data;
          });
        }
        this.dialogFormVisible = true;
      },
      getOutbillList() {
        outbillApi.getOutbillList(this.searchModel).then((response) => {
          this.total = response.data.total;
          this.outbillList = response.data.rows;
          this.downloadlist= response.data.rows;
        });
      },
      getArticleAll() {
        article.getArticleAll().then((response) => {
          this.options = response.data;
          console.log(this.options)
        });
      },
      getConnectionAll() {
        connectionApi.getConnectionAll().then((response) => {
          this.list=response.data;
          //this.list=this.list.toArray();
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
          const tHeader = ['需方', '日期', '品名', '规格/米','数量','小计/米','押金','押金收款人','发货人','备注','收租金']
          const filterVal = ['outbillConnection', 'outbillDate', 'outbillArtice', 'outbillSpci','outbillNum','outbillArticleTotl','outbillCashmoney','outbillCashmoneyman','outbillSendgoodName','outbillContent','outbillPutrest']
          this.filename='出库表'
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
      this.getOutbillList();
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
  }
  ul li{
    list-style-type:none;
    float: left;
    padding: 0px 10px 0px 10px;
  }
</style>
