<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-card class="box-card">
      <div class="search-container">
        <div class="input-box">
          <!-- <el-select
            v-model="listQuery.targetType"
            placeholder="角色类型"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option label="全部" value />
            <el-option
              v-for="item in exponentTypeOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select> -->

          <el-input
            v-model="listQuery.targetName"
            placeholder="角色名称"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />


          <!-- <el-select
            v-model="listQuery.tagIds"
            placeholder="角色标签"
            multiple
            filterable
            clearable
            class="filter-item"
            style="width: 200px"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name+'('+item.key+')'"
              :value="item.key"
            />
          </el-select> -->
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
      <el-button icon="el-icon-plus" type="text" @click="handleCreate">新增角色</el-button>&nbsp;&nbsp;
      <!-- <el-button type="text" icon="el-icon-delete" @click="handleBach('delete')">角色删除</el-button> -->
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
      <!-- @sort-change="sortChange" -->
      <!--  <el-table-column label="序号" prop="id" sortable="custom" align="center"  :class-name="getSortClass('id')">
      <template slot-scope="{row}">
        <span>{{ row.id }}</span>
      </template>
      </el-table-column>-->
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="序号" prop="id" align="center"></el-table-column>
      <el-table-column label="用户名" prop="roleName" align="center"></el-table-column>
      <el-table-column label="描述" prop="roleDes" align="center"></el-table-column>
      <el-table-column label="状态" prop="status" align="center"></el-table-column>
      <el-table-column label="最后更改时间" prop="updateTime" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="careteTime" align="center"></el-table-column>
     

      <el-table-column label="操作" align="center"   min-width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="handleUpdate(row)"
          >编辑</el-button>
          
          <el-button v-if="row.auditState!='unaudit'" size="mini" @click="handleShow(row)">查看详情</el-button>
          <el-popconfirm
            placement="top"
            title="确认删除该角色？"
            @onConfirm="handleDelete([row.id])"
          >
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
      >
       
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            :disabled="dialogStatus == 'show'"
            v-model="temp.roleName"
            placeholder="角色名称"
          />
        </el-form-item>
        
        <el-form-item label="角色描述" prop="roleDes">
          <el-input
            :disabled="dialogStatus == 'show'"
            type="textarea"
            rows="3"
            v-model="temp.roleDes"
            placeholder="角色描述"
          />
        </el-form-item>

        <!-- <el-form-item label="角色标签" prop="title">
          <el-select
            :disabled="dialogStatus == 'show'"
            v-model="temp.tag_ids"
            placeholder="角色标签"
            multiple
            filterable
            clearable
            class="filter-item"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name+'('+item.key+')'"
              :value="item.key"
            />
          </el-select>
        </el-form-item> -->
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
      <span v-if="optType == 'delete'">你将批量删除以下角色：</span>
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
import {
  listRoles,
  addRole,
  updateRole,
  deleteRole
} from "@/api/user"
import Pagination from "@/components/Pagination";
const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];
const statusMap = {
  unaudit: { text: "未审核", color: "gray" },
  auditing: { text: "审核中", color: "warning" },
  refuse: { text: "审核拒绝", color: "danger" },
  audited: { text: "已审核", color: "success" }
};

const exponentTypeOptions = [
  // {key:1,value:'全部'},
  { key: 0, value: "离线角色" },
  { key: 1, value: "实时角色" }
];

export default {
  name: "ComplexTable",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      return statusMap[status].color;
    },
    textFilter(status) {
      return statusMap[status].text;
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        isUsePage:true,
      },
      multipleSelection: [],
      exponentTypeOptions, // 角色类型
      calendarTypeOptions, // 角色列表
      temp: {
        // 添加/编辑 弹框内容
        id: undefined,
        roleDes:'',
        roleName:'',
        status:1,
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑角色",
        create: "新增角色",
        show: "查看角色"
      },
      rules: {
        targetType: [
          { required: true, message: "请选择角色类型", trigger: "change" }
        ],
        targetName: [
          { required: true, message: "角色名称必填", trigger: "blur" }
        ],
        targetCode: [
          { required: true, message: "角色标识必填", trigger: "blur" }
        ],
        // realTimeExponents:[{ required: true, message: '表达式必填', trigger: 'blur' }],
        targetExpression: [
          { required: true, message: "表达式必填", trigger: "blur" }
        ],
        tag_ids: [
          { required: true, message: "请选择角色标签", trigger: "change" }
        ]
      },
      dialogVisible: false,
      ids: [], // 批量操作id
      optList: [], // 批量操作名称
      optType: "" // 批量操作类型
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      listRoles(this.listQuery).then(response => {
        console.log(response);

        const {data} = response;
        
        this.list = data.records;
        this.total = data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },

    /* sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    }, */
    resetTemp() {
      this.temp = {
        id: undefined,
        roleDes:'',
        roleName:'',
        status:1,
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
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.id = this.list.length + 1;
          addRole(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.fetchData();
            this.$notify({
              title: "提示",
              message: "添加角色成功！",
              type: "success",
              duration: 2000
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
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let tempData = Object.assign({}, this.temp);
          updateRole(tempData).then(() => {
            this.dialogFormVisible = false;
            this.fetchData();
            this.$notify({
              title: "提示",
              message: "修改角色成功！",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(ids) {
      console.log("删除：", ids);
      deleteRole(ids).then(() => {
        this.fetchData();
        this.$notify({
          title: "提示",
          message: "删除角色成功！",
          type: "success",
          duration: 2000
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
            duration: 2000
          });
        });
      }
    },

    handleBach(type) {
      let names = [];
      let ids = this.multipleSelection.map(item => {
        names.push(item.targetName);
        return item.id;
      });

      if (names.length == 0) {
        this.$message.warning("请勾选需要操作的角色！");
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

    /* formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }, */

    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
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

.input-box{
  flex: 1;
}

.input-box >div{
  margin: 5px;
}

.button-container{
  justify-items: stretch;
}
</style>
