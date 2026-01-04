/**
 * 新闻数据初始化脚本
 * 使用方法:
 * 1. 在HBuilderX中打开 uniCloud 控制台
 * 2. 进入数据库管理
 * 3. 创建名为 "News" 的集合
 * 4. 导入以下JSON数据
 */

const initialNewsData = [
  {
    "title": "2025央行降准0.5个百分点，释放长期资金约1万亿元",
    "cover": "https://picsum.photos/400/200?random=1",
    "summary": "央行今日宣布降准，旨在支持实体经济发展，降低企业融资成本...",
    "author": "财经时报",
    "category": "财经",
    "publish_time": 1732617600000,
    "comments_count": 1256,
    "is_top": true,
    "createTime": 1732617600000
  },
  {
    "title": "2025亚运会中国队斩获第100枚金牌，创历史新高",
    "cover": "https://picsum.photos/400/200?random=2",
    "summary": "在刚刚结束的亚运会比赛中，中国队在跳水项目再夺一金，金牌总数突破100枚...",
    "author": "体育周报",
    "category": "体育",
    "publish_time": 1732621200000,
    "comments_count": 8950,
    "is_top": false,
    "createTime": 1732621200000
  },
  {
    "title": "人工智能大模型迎来重大突破，可自主完成复杂任务",
    "cover": "https://picsum.photos/400/200?random=3",
    "summary": "国内科技企业发布新一代AI大模型，具备自主学习和决策能力，应用场景覆盖多个领域...",
    "author": "科技前沿",
    "category": "科技",
    "publish_time": 1732531200000,
    "comments_count": 3580,
    "is_top": false,
    "createTime": 1732531200000
  },
  {
    "title": "2025全国两会重点关注民生问题，多领域政策将调整",
    "cover": "https://picsum.photos/400/200?random=4",
    "summary": "全国两会即将召开，教育、医疗、养老等民生议题成为关注焦点...",
    "author": "时政新闻",
    "category": "时政",
    "publish_time": 1729468800000,
    "comments_count": 6890,
    "is_top": true,
    "createTime": 1729468800000
  },
  {
    "title": "热门电影票房突破50亿，成年度票房冠军",
    "cover": "https://picsum.photos/400/200?random=5",
    "summary": "某国产电影上映10天票房突破50亿，刷新多项票房纪录...",
    "author": "娱乐星探",
    "category": "娱乐",
    "publish_time": 1732628320000,
    "comments_count": 9870,
    "is_top": false,
    "createTime": 1732628320000
  },
  {
    "title": "新能源汽车补贴政策调整，购车可享更多优惠",
    "cover": "https://picsum.photos/400/200?random=7",
    "summary": "最新新能源汽车补贴政策出台，续航超600km车型补贴提高...",
    "author": "汽车之家",
    "category": "财经",
    "publish_time": 1732632000000,
    "comments_count": 1200,
    "is_top": false,
    "createTime": 1732632000000
  }
];

console.log('新闻数据初始化脚本准备就绪');
console.log('请将 initialNewsData 数组导入到云数据库的 News 集合中');
