<template>
  <div>
    <div class="block">
        <el-form :label-position="labelPosition" label-width="80px" :model="menuForm" ref="menuFormRef">

          <el-form-item label="菜单类型">
            <el-select ref="optionref" v-model="menuForm.parentId" placeholder="请选择" @change="onseinput">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一级菜单" v-show="isshow">
            <el-select v-model="menuForm.parent" placeholder="请选择">
              <el-option
                v-for="item in menuByHosts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件" >
            <el-input v-model="menuForm.component" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="地址" >
            <el-input v-model="menuForm.path" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="跳转" v-show="isredirect">
            <el-input v-model="menuForm.redirect" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="menuForm.name" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="中文名字">
            <el-input v-model="menuForm.title" style="width: 400px;"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="menuForm.icon" style="width: 400px;"></el-input>
          </el-form-item>
        </el-form>

      <div slot="footer" class="dialog-footer" style="margin-top: 10px;text-align: center;">
        <el-button type="primary" @click="saveMenu">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import menuApi from "@/api/menuManage";
  let id = 1000;

  export default {
    data() {
      return {
        isshow:false,
        isredirect:true,
        menuByHosts:[],
        menuForm: {
          parent:''
        },
        labelPosition: 'right',
        options: [
          {
            value: '0',
            label: '一级菜单',
            disabled: true
          },
          {
            value: '1',
            label: '二级菜单'
          }
        ],
        rules: {
          parent:[
            { required: true, message: '请选择一级菜单', trigger: 'blur' }
          ]
        },
        value: ''
      }
    },
    created() {
      //this.getAllMenu();
      this.menuByHost();
    },

    methods: {
      menuByHost(){
        menuApi.menuByHost().then((response) => {
          const result =response.data;
          result.forEach(element =>{
            this.menuByHosts.push({label:element.title,value:element.menuId})
          })
        }).catch(error =>{
          console.log(error)
        })
      },
      onseinput(e){
        console.log(e)
        if(e == 1){//二级菜单
          this.menuForm.redirect='';
          this.isshow=true
          this.isredirect=false
        }else if(e == 0){//一级菜单
          this.menuForm.component='Layout'

        }
      },
      // getAllMenu(){
      //   menuApi.getAllMenu().then((response) => {
      //     const res = response.data;
      //   })
      // },
      saveMenu() {
        // 触发表单验证
        this.$refs.menuFormRef.validate((valid) => {
          if (valid) {
            // 提交请求给后台
            menuApi.saveMenu(this.menuForm).then(response => {
              // 成功提示
              this.$message({
                message: response.message,
                type: 'success'
              });
              // 关闭对话框
              this.dialogFormVisible = false;
              // 刷新表格

            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });

      }
    }
  };
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .block{
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
