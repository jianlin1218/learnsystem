<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-card class="box-card">
      <div class="search-container">
        <div class="input-box">
          <el-input
            v-model="listQuery.targetName"
            placeholder="部门名称"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="fetchData"
          />
        </div>
        <div class="button-container">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="fetchData"
          >查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh">重置</el-button>
        </div>
      </div>
    </el-card>

    <div class="buttons-container">
      <el-button icon="el-icon-plus" type="text" @click="handleCreate">新增部门</el-button>&nbsp;&nbsp;
      <!-- <el-button type="text" icon="el-icon-delete" @click="handleBach('delete')">部门删除</el-button> -->
    </div>

    <el-table
      :data="tableData"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="部门名称"></el-table-column>
      <el-table-column prop="operator" label="操作员"></el-table-column>
      <el-table-column prop="operateIp" label="操作Ip"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.auditState!='unaudit'" size="mini" @click="handleShow(row)">查看详情</el-button>&nbsp;&nbsp;
          <el-popconfirm placement="top" title="确认删除该部门？" @onConfirm="handleDelete(row.id)">
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal='false' :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="部门名称" prop="deptName">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.deptName" placeholder="部门名称" />
        </el-form-item>

        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            filterable
            :disabled="dialogStatus == 'show'"
            v-model="temp.parentId"
            :options="tableData"
            :props="{ checkStrictly: true,emitPath:'false',value:'id',label:'name' }"
            clearable
          ></el-cascader>
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
  </div>
</template>

<script>
import { listDept, addDept, updateDept, deleteDept } from "@/api/user";


export default {
  name: "deptTable",

  data() {
    return {
      tableData: [],
      listLoading: true,
      listQuery: {},
      temp: {
        // 添加/编辑 弹框内容
        id: undefined,
        deptName: "",
        parentId: 0
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑部门",
        create: "新增部门",
        show: "查看部门"
      },
      rules: {
        deptName: [
          { required: true, message: "请选填写部门名称", trigger: "change" }
        ],
      },
      dialogVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      listDept(this.listQuery).then(response => {
        const { data } = response;
        const list = this.recursiveData(data);

        this.tableData = list;
      });
    },

    // 树形图转换
    recursiveData(data) {
      let list = [];
      data.forEach(item => {
        let temp = {
          id: item.id,
          name: item.node.deptName,
          ...item.node
        };
        if (item.children && item.children.length > 0) {
          temp.children = this.recursiveData(item.children);
        }
        list.push(temp);
      });
      return list;
    },

    resetTemp() {
      this.temp = {
        id: 0,
        parentId: "",
        deptName: ""
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

    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const addItem = {
            deptName: this.temp.deptName,
            id: this.temp.id,
            parentId: this.temp.parentId.join(",")
          };
          addDept(addItem).then(() => {
            this.dialogFormVisible = false;
            this.fetchData();
            this.$notify({
              title: "提示",
              message: "添加部门成功！",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleShow(row) {
      this.temp =  row; // copy obj
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
          updateDept(tempData).then(() => {
            this.dialogFormVisible = false;
            this.fetchData();
            this.$notify({
              title: "提示",
              message: "修改部门成功！",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(id) {
      deleteDept(id).then(() => {
        this.fetchData();
        this.$notify({
          title: "提示",
          message: "删除部门成功！",
          type: "success",
          duration: 2000
        });
      });
    },

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
