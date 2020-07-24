<template>
  <div class="login-container">
    <!--  -->

    <div class="login-form">
      <div class="inner">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">用户登陆</h3>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >登陆</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码至少超过6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "111111"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
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

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}


.el-form-item__error{
  padding: 5px 0 0 45px !important;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 32px;
    width: calc(100% - 50px);

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 32px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #00a8ff;
    background: transparent;
    border-radius: 20px;
    color: #454545;
    margin-bottom: 30px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$primary_color: #00d5ff;

.login-container {
  min-height: 100%;
  width: 100%;
  height: 100%;
  // background-color: $bg;
  background: url("~@/assets/login_bg.png") center center no-repeat;
  background-size: 100% auto;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 32.3%;
    padding: 14%;
    left: 50%;
    top: 50%;
    transform: translate(0, -40%);
    overflow: hidden;
    .inner {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 10% 15%;
    }
    .login-btn {
      background: linear-gradient(
        90deg,
        rgba(2, 117, 255, 0.8) 0%,
        rgba(1, 199, 255, 0.8) 100%
      );
      border-radius: 18px;
      height: 36px;
      color: white;
      font-weight: bold;
      font-size: 14px;
    }
    .login-btn:hover{
      background: linear-gradient(
        90deg,
        rgba(2, 117, 255, 1) 0%,
        rgba(1, 199, 255, 1) 100%
      );
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0 5px 0 10px;
    color: white;
    vertical-align: middle;
    width: 46px;
    border-radius: 20px 0 0 20px;
    display: inline-block;
    background: linear-gradient(
      90deg,
      rgba(0, 128, 255, 0.8) 0%,
      rgba(0, 213, 255, 0.8) 100%
    );
    margin-left: -1px;
    text-align: center;
    height: 36px;
    line-height: 32px;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 24px;
      color: $primary_color;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 15px;
    top: 3px;
    font-size: 16px;
    color: white;
    cursor: pointer;
    user-select: none;
  }
}

.el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  height: 36px;
}

</style>
