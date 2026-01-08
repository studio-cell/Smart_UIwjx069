# 默认头像说明

请在 `static` 目录下添加一个默认头像图片，命名为 `avatar.png`

你可以使用以下方式获取默认头像：

## 方式1：使用在线占位图
修改代码中的默认头像路径为：
```
'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
```

## 方式2：下载默认头像
访问以下网址下载默认头像：
```
https://api.dicebear.com/7.x/avataaars/svg?seed=default
```
然后保存为 `static/avatar.png`

## 方式3：使用纯色头像
在代码中修改为纯色背景：
```vue
<view class="avatar" v-if="!userInfo.avatar">
  <text class="avatar-initial">{{ userInfo.username.charAt(0).toUpperCase() }}</text>
</view>
<image v-else class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
```

当前使用的默认头像路径：`/static/avatar.png`
