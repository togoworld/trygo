<template>
  <el-dialog :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
    <div slot="title" class="el-dialog__header">用户注册</div>

    <!-- form表单 -->
    <el-form :model="registerForm" label-width="80px" :rules="rules" ref="registerFormRef">
      <el-form-item porp='avatar' label='头像'>
        <!-- 用户头像上传 -->
        <el-upload
          class="avatar-uploader"
          :action="uploadImgUrl"
          name='image'
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="registerForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="图形码" prop="code">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input v-model="registerForm.code"></el-input>
          </el-col>
          <el-col :span="7">
            <img :src="imgSrc" alt @click="clickSrc" style="width:100%" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码" prop="rcode">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input v-model="registerForm.rcode"></el-input>
          </el-col>
          <el-col :span="5">
            <el-button @click="getCode">获取用户验证码</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="registerUp">注册</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      //控制子组件显示隐藏
      dialogVisible: false,
      //头像请求地址,请求方式为form表单action
      uploadImgUrl: process.env.VUE_APP_BASEURL +'/uploads',
      registerForm: {
        username: "",
        phone: "",
        email: "",
        avatar: "",
        password: "",
        code: "",
        rcode: ""
      },
      //验证码地址
        imgSrc: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms",
        //头像
        imageUrl:'',
        //

      //验证规则
      rules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("请填写电话号"));
              }
              //电话正则
              const reg = /^[1][3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号不合法"));
              }
            },
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("邮箱不能为空"));
                return;
              }
              // 邮箱的正则
              const reg = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
              if (!reg.test(value)) {
                return callback(new Error("邮箱不合法!"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }],
        code: [
          { required: true, message: "请输入图形码", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "提醒您，图形码规定为4位",
            trigger: "blur"
          }
        ],
        rcode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "提醒您，验证码规定为4位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  //.................................
  methods: {
    clickSrc() {
      this.imgSrc =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms&r=" +
        Math.random() * 10;
    },
    async getCode() {
      const res = await this.$axios({
        method: "post",
        url: "/sendsms",
        data: {
          code: this.registerForm.code,
          phone: this.registerForm.phone
        }
      });
      if (res.data.code === 200) {
        this.registerForm.rcode = res.data.data.captcha;
      } else {
        this.$message.error(res.data.message);
        this.clickSrc();
      }
    },
    //关闭时清空组件
    dialogClose() {
      this.$refs.registerFormRef.resetFields();
      this.dialogVisible = false;
    },
    //注册
     registerUp() {
        //进行全局校验
        this.refs.registerFormRef.validate( async (valid)=>{
            if(!valid) return
            const res= await this.$axios.post('/register',this.registerForm)
        if(res.data.code===200){
            this.$message({
                type:'success',
                message:'注册成功'
            })
        //关闭清空之前 发送注册请求。。。。
         this.$refs.registerFormRef.resetFields();
        this.dialogVisible = false;
        }else{
            this.$message.error('res.message')
        }
        })
    },
    //关闭对话框
    handleClose(){
         this.$refs.registerFormRef.resetFields();
      this.dialogVisible = false;
    },
    //头像上传之前
     beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' ||file.type === 'image/jpg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //上传成功后
      handleAvatarSuccess(res) {
        //console.log(res);
       this.imageUrl=process.env.VUE_APP_BASEURL + '/' +res.data.file_path;
       this.registerForm.avatar=res.data.file_path
      },

  }
};
</script>

<style>
div.el-dialog__header {
  padding: 10px 10px 10px;
  background: linear-gradient(270deg, #01c6fa, #1493fa);
  text-align: center;
}

/* 头像style */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-left: 150px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.avatar-uploader-icon.el-icon-plus {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
     text-align: center;
     
    }
</style>