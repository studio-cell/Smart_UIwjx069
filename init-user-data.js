/**
 * 用户数据初始化脚本
 * 使用方法:
 * 1. 在HBuilderX中打开 uniCloud 控制台
 * 2. 进入数据库管理
 * 3. 创建名为 "Accounts" 的集合
 * 4. 导入以下JSON数据
 */

const initialUserData = [
  {
    "username": "admin",
    "password": "123456",
    "nickname": "管理员",
    "avatar": "https://picsum.photos/100/100?random=admin"
  },
  {
    "username": "testuser",
    "password": "123456",
    "nickname": "测试用户",
    "avatar": "https://picsum.photos/100/100?random=test"
  }
];

console.log('用户数据初始化脚本准备就绪');
console.log('请将 initialUserData 数组导入到云数据库的 Accounts 集合中');
console.log('默认账号: admin / 123456');
