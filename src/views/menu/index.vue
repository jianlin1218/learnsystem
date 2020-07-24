<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-card class="box-card">
      <div class="search-container">
        <div class="input-box">
          <el-input
            v-model="listQuery.menuName"
            placeholder="菜单名称"
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
      <el-button icon="el-icon-plus" type="text" @click="handleCreate">新增菜单</el-button>&nbsp;&nbsp;
      <el-button type="text" icon="el-icon-delete" @click="handleBach('delete')">菜单删除</el-button>
    </div>

    <el-table
      :data="tableData"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜单名称"></el-table-column>
      <el-table-column prop="menuType" label="菜单类型"></el-table-column>
      <el-table-column prop="parentId" label="父级菜单"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="router" label="地址"></el-table-column>
      <el-table-column prop="seq" label="排序"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column label="操作" align="center"  min-width="180px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.auditState!='unaudit'" size="mini" @click="handleShow(row)">查看详情</el-button>&nbsp;&nbsp;
          <el-popconfirm placement="top" title="确认删除该菜单？" @onConfirm="handleDelete(row.id)">
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.menuName" placeholder="菜单名称" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="temp.menuType">
            <el-option label='菜单' value='menu'></el-option>
            <el-option label='目录' value='leaf'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上级菜单" prop="parentId">
          <el-cascader
            filterable
            :disabled="dialogStatus == 'show'"
            v-model="temp.parentId"
            :options="tableData"
            :props="{ checkStrictly: true,emitPath:'false',value:'id',label:'menuName' }"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="访问地址" prop="router">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.router" placeholder="访问地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.remark" placeholder="备注" />
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input :disabled="dialogStatus == 'show'" v-model="temp.seq" placeholder="备注" />
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
// import { menuTree,addMenu,delMenu,updateMenu } from "@/api/menu";
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
        update: "编辑菜单",
        create: "新增菜单",
        show: "查看菜单"
      },
      rules: {
        deptName: [
          { required: true, message: "请选填写菜单名称", trigger: "change" }
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
          "access": 0,
          "menuName": item.node.deptName,
          "menuType": 0,
          "parentId": 0,
          "remark": "测试",
          "router": "/menu",
          "seq": 1,
          "status": 0
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
              message: "添加菜单成功！",
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
              message: "修改菜单成功！",
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
          message: "删除菜单成功！",
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
