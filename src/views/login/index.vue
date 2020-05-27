<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="subtitle">用户登录</span>
      </div>

      <!-- form表单 -->
      <!-- 
            1.搭建登录UI
            2.绑定form表单数据model
            3.双向绑定input框,add icon
            4.校验规则绑定和书写
      -->
      <el-form :model="loginForm" class="login-form" :rules="rules" ref="loginFormRef">
        <!-- 手机号 -->
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input prefix-icon="el-icon-key" placeholder="请输入验证码" v-model="loginForm.code"></el-input>
            </el-col>
            <el-col :span="8">
              <img :src="imgSrc" @click="getcaptcha" class="captcha" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 用户协议 -->
        <el-form-item prop="isCheck">
          <el-checkbox v-model="loginForm.isCheck"></el-checkbox>我已阅读并同意
          <el-link type="primary" href="http://baidu.com">用户协议</el-link>和
          <el-link type="primary" href="http://baidu.com">隐私条款</el-link>
        </el-form-item>
        <!-- 登录 -->
        <el-form-item>
          <el-button type="primary" style="width:100%;text-algin:center" @click="submit()">登录</el-button>
        </el-form-item>
        <!-- 注册 -->
        <el-form-item>
          <el-button type="primary" style="width:100%;text-algin:center"  @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt />
    </div>
    <register ref="registerRef"></register>
  </div>
</template>

<script>
//使用子组件   导入  注册   使用
import register from "./register";
import { setToken } from "@/utils/token.js";
export default {
  name: "Login",
  components: {
    register
  },
  data() {
    return {
      //form表单模型值
      loginForm: {
        phone: "18511111111",
        password: "12345678",
        code: "",
        isCheck: false
      },
      //图形码src
      imgSrc: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      //校验规则+porp属性设置为需要校验的字段名
      rules: {
        // 规则对象>字段名个数（数组）>规则对象>
        //字段名要与表单模型值一样！！！！！！！！！！！！！！！！！！！！！！！！！！！！！不一样会出错（elementUI设计的把）
        phone: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("手机不能为空"));
              }
              const reg = /^[1][3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        //密码校验规则、验证码校验规则
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在  到 16 个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "提醒您，验证码规定为4位",
            trigger: "blur"
          }
        ],
        isCheck: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请勾选用户协议"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  //--------------------------
  methods: {
    //请求验证码
    getcaptcha() {
      this.imgSrc =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=login&r=" +
        Math.random() * 100;
    },
    //登录
    submit() {
      //1.表单校验
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        //校验成功后发送登录请求
        const res = await this.$axios.post("/login", this.loginForm);
        //登录成功后保存token
        if (res.data.code === 200) {
          //提示信息
          this.$message({
            type: "success",
            message: "登录成功"
          });
          //按需导入setToken ,保存token
          setToken(res.data.data.token);
          //编程式导航
          this.$router.push("/layout");
        } else {
          //登录失败
          this.$message.error(res.data.message);
          //刷新验证码
          this.getcaptcha();
        }
      });
    },
    //注册
    register(){
        this.$refs.registerRef.dialogVisible=true;
    }
  }
};
</script>

<style lang='less'>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);

  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    margin: 110px;
    margin: 73px;

    .title-box {
      display: flex;
      align-items: center;

      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .subtitle {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 29px;
      .captcha {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>