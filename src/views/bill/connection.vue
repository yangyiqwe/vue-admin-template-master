<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.connectionUserName"
            placeholder="客户名"
            clearable
          ></el-input>
          <el-button
            @click="getConnectionList"
            type="primary"
            round
            icon="el-icon-search"
          >查询</el-button
          >
        </el-col>
        <el-col :span="4" align="right">
          <el-button
            @click="openEditUI(null)"
            type="primary"
            icon="el-icon-plus"
            circle
          ></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="connectionList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
             scope.$index+1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="connectionUserName" label="客户姓名">
        </el-table-column>
        <el-table-column prop="connectionPhone" label="客户手机">
        </el-table-column>
        <el-table-column prop="connectionAddress" label="客户地址">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.connectionId)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button @click="deleteConnectionById(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 50]"
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
      <el-form :model="connectionForm" ref="connectionFormRef" :rules="rules">
        <el-form-item
          label="客户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model="connectionForm.connectionUserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="connectionForm.connectionPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" :label-width="formLabelWidth">
          <el-input v-model="connectionForm.connectionAddress" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveConnection">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import connectionApi from "@/api/connectionManage";
  export default {
    data() {
      return {
        formLabelWidth: "130px",
        connectionForm: {},
        dialogFormVisible: false,
        title: "",
        total: 0,
        connectionList: [],
        searchModel: {
          pageNo: 1,
          pageSize: 10,
        },
        rules: {
          connectionUserName: [
            { required: true, message: "请输入客户名", trigger: "blur" },
            {
              min: 3,
              max: 50,
              message: "长度在 3 到 50 个字符",
              trigger: "blur",
            },
          ]
        },
        list: null
      };
    },
    methods: {
      handleSizeChange(pageSize) {
        this.searchModel.pageSize = pageSize;
        this.getConnectionList();
      },
      handleCurrentChange(pageNo) {
        this.searchModel.pageNo = pageNo;
        this.getConnectionList();
      },
      deleteConnectionById(connection){
        this.$confirm(`您确认删除客户 ${connection.connectionUserName} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          connectionApi.deleteConnectionById(connection.connectionId).then(response => {
            this.$message({
              type: 'success',
              message: response.message
            });
            this.getConnectionList();
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      saveConnection() {
        // 触发表单验证
        this.$refs.connectionFormRef.validate((valid) => {
          if (valid) {
            // 提交请求给后台
            connectionApi.saveConnection(this.connectionForm).then(response => {
              // 成功提示
              this.$message({
                message: response.message,
                type: 'success'
              });
              // 关闭对话框
              this.dialogFormVisible = false;
              // 刷新表格
              this.getConnectionList();
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });

      },
      clearForm() {
        this.connectionForm = {};
        this.$refs.connectionFormRef.clearValidate();
      },
      openEditUI(id) {
        if( id == null){
          this.title = "新增客户";
        }else{
          this.title = "修改客户";
          // 根据id查询客户数据
          connectionApi.getConnectionById(id).then(response => {
            this.connectionForm = response.data;
          });
        }
        this.dialogFormVisible = true;
      },

      getConnectionList() {
        connectionApi.getConnectionList(this.searchModel).then((response) => {
          this.total = response.data.total;
          this.connectionList = response.data.rows;
          this.list=response.data.rows;
        });
      },
    },
    created() {
      this.getConnectionList();
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
