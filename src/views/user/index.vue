<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-card class="box-card">
      <div class="search-container">
        <div class="input-box">
          <el-input
            v-model="listQuery.targetName"
            placeholder="用户名称"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </div>
        <div class="button-container">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh">重置</el-button>
        </div>
      </div>
    </el-card>

    <div class="buttons-container">
      <el-button icon="el-icon-plus" type="text" @click="handleCreate">新增用户</el-button>&nbsp;&nbsp;
      <el-button type="text" icon="el-icon-delete" @click="handleBach('delete')">批量删除</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        label="序号"
        prop="id"
        @sort-change="sortChange"
        sortable="custom"
        align="center"
        
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>-->
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" prop="id" align="center"></el-table-column>
      <el-table-column label="用户名" prop="userName" align="center"></el-table-column>
      <el-table-column label="电话" prop="phone" align="center"></el-table-column>
      <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
      <el-table-column label="部门" prop="deptId" align="center"></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope='{row}'>
          <el-switch off-value="0" on-value="1" v-model="row.status"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center"></el-table-column>
      <el-table-column label="最后更改时间" prop="updateTime" align="center"></el-table-column>
      <!-- <el-table-column label="创建时间" prop="careteTime" align="center"></el-table-column> -->

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleUpdate(row)">编辑</el-button>

          <el-button v-if="row.auditState!='unaudit'" size="mini" @click="handleShow(row)">查看详情</el-button>
          <el-popconfirm placement="top" title="确认删除该用户？" @onConfirm="handleDelete([row.id])">
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="fetchData"
    />

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="用户名称" prop="userName">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.userName" placeholder="用户名称" />
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.phone" placeholder="填写电话号码" />
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.email" placeholder="填写邮箱地址" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.deptId" placeholder="选择部门" />
        </el-form-item>

        <el-form-item label="用户描述" prop="userDes">
          <el-input
            :disabled="dialogStatus == 'show'"
            type="textarea"
            rows="3"
            v-model="temp.userDes"
            placeholder="用户描述"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          :disabled="dialogStatus == 'show'"
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span v-if="optType == 'delete'">你将批量删除以下用户：</span>
      <span v-else>你将批量提交审批：</span>
      <p v-for="(item,index) in optList" :key="index">{{index+1}}.{{item}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchAction">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, addUser, updateUser, deleteUser } from "@/api/user";
import Pagination from "@/components/Pagination";

const TEMP = {
  deptId: 0,
  email: "",
  id: 0,
  password: "111",
  phone: "",
  remark: "",
  status: 0,
  userCode: "",
  userName: "",
};

export default {
  name: "ComplexTable",
  components: { Pagination },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        isUsePage: true,
      },
      multipleSelection: [],
      temp: {
        // 添加/编辑 弹框内容
        ...TEMP,
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑用户",
        create: "新增用户",
        show: "查看用户",
      },
      rules: {
        targetType: [
          { required: true, message: "请选择用户类型", trigger: "change" },
        ],
        targetName: [
          { required: true, message: "用户名称必填", trigger: "blur" },
        ],
        targetCode: [
          { required: true, message: "用户标识必填", trigger: "blur" },
        ],
        // realTimeExponents:[{ required: true, message: '表达式必填', trigger: 'blur' }],
        targetExpression: [
          { required: true, message: "表达式必填", trigger: "blur" },
        ],
        tag_ids: [
          { required: true, message: "请选择用户标签", trigger: "change" },
        ],
      },
      dialogVisible: false,
      ids: [], // 批量操作id
      optList: [], // 批量操作名称
      optType: "", // 批量操作类型
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      listUser(this.listQuery).then((response) => {
        console.log(response);

        const { data } = response;

        this.list = data.records;
        this.total = data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },

    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    resetTemp() {
      this.temp = {
        ...TEMP,
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.id = 0;
          this.temp.userCode = "user" + Math.random().toFixed(3);
          addUser(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.fetchData();
            this.$notify({
              title: "提示",
              message: "添加用户成功！",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleShow(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "show";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp);
          updateUser(tempData).then(() => {
            this.dialogFormVisible = false;
            this.fetchData();
            this.$notify({
              title: "提示",
              message: "修改用户成功！",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(ids) {
      console.log("删除：", ids);
      deleteUser(ids).then(() => {
        this.fetchData();
        this.$notify({
          title: "提示",
          message: "删除用户成功！",
          type: "success",
          duration: 2000,
        });
      });
    },

    handleCommit(ids) {
      if (ids) {
        console.log("提交审批：", ids);
        commitExponent(ids).then(() => {
          this.fetchData();
          this.$notify({
            title: "提示",
            message: "提交审批成功！",
            type: "success",
            duration: 2000,
          });
        });
      }
    },

    handleBach(type) {
      let names = [];
      let ids = this.multipleSelection.map((item) => {
        names.push(item.targetName);
        return item.id;
      });

      if (names.length == 0) {
        this.$message.warning("请勾选需要操作的用户！");
        return;
      }
      this.optList = names;
      this.dialogVisible = true;
      this.optType = type;
      this.ids = ids;

      /* if (type=='delete') {
        this.handleDelete(ids)
      }else if( type == 'commit' ){
        this.handleCommit(ids)
      } */
    },

    // 批量操作
    batchAction() {
      this.dialogVisible = false;
      if (this.optType == "delete") {
        this.handleDelete(this.ids);
      } else if (this.optType == "commit") {
        this.handleCommit(this.ids);
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.buttons-container {
  margin: 10px 0;
}
.search-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.input-box {
  flex: 1;
}

.input-box > div {
  margin: 5px;
}

.button-container {
  justify-items: stretch;
}
</style>
