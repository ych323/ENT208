/**
 * 岗位数据填充脚本
 * 用于初始化字节跳动、腾讯、阿里巴巴的岗位数据
 * 
 * 使用方法: pnpm tsx scripts/seed-jobs.ts
 */

import { db } from '../src/storage/database';
import { jobs } from '../src/storage/database/shared/schema';

const JOBS_DATA = [
  // ==================== 字节跳动 ====================
  {
    title: '前端开发工程师 - TikTok',
    company: 'ByteDance',
    company_code: 'bytedance',
    location: '北京',
    salary_min: 30,
    salary_max: 50,
    salary_text: '30k-50k',
    category: 'frontend',
    tags: 'React,TypeScript,Vue,Node.js,前端工程化',
    description: `负责 TikTok 相关产品的Web前端开发工作。
    参与产品需求分析，制定合理的技术方案。
    持续优化产品性能，提升用户体验。
    参与前端技术体系建设，推动技术革新。`,
    requirements: `1. 本科及以上学历，计算机相关专业优先
2. 3年以上前端开发经验
3. 精通React/Vue等主流前端框架
4. 熟悉前端工程化、模块化开发
5. 具备良好的沟通能力和团队协作精神
6. 有大型Web应用开发经验优先`,
    responsibilities: `1. 负责 TikTok Web 端产品功能开发
2. 参与前端架构设计与优化
3. 制定前端开发规范和最佳实践
4. 解决技术难题，提升团队整体技术水平`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '3-5年',
    official_url: 'https://jobs.bytedance.com/',
    publish_date: new Date('2025-01-15'),
  },
  {
    title: '后端开发工程师 - 抖音',
    company: 'ByteDance',
    company_code: 'bytedance',
    location: '北京',
    salary_min: 35,
    salary_max: 55,
    salary_text: '35k-55k',
    category: 'backend',
    tags: 'Go,Python,Kubernetes,分布式系统,Microservices',
    description: `负责抖音后端核心系统的设计与开发。
    构建高并发、高可用的分布式后端服务。
    参与技术难题攻关，持续优化系统性能。`,
    requirements: `1. 本科及以上学历，计算机相关专业
2. 3年以上后端开发经验
3. 精通Go或Python语言
4. 熟悉分布式系统设计原理
5. 有大规模系统开发经验优先`,
    responsibilities: `1. 负责抖音核心后端服务开发
2. 设计并实现高并发分布式系统
3. 优化系统性能瓶颈
4. 参与技术架构评审`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '3-5年',
    official_url: 'https://jobs.bytedance.com/',
    publish_date: new Date('2025-01-10'),
  },
  {
    title: '算法工程师 - 推荐系统',
    company: 'ByteDance',
    company_code: 'bytedance',
    location: '北京',
    salary_min: 40,
    salary_max: 70,
    salary_text: '40k-70k',
    category: 'algorithm',
    tags: '机器学习,深度学习,推荐算法,NLP,TensorFlow',
    description: `负责抖音/ TikTok 推荐系统的算法研发。
    应用先进的机器学习技术提升推荐效果。
    参与算法创新，推动技术边界。`,
    requirements: `1. 硕士及以上学历，人工智能/机器学习相关专业
2. 扎实的机器学习理论基础
3. 熟悉TensorFlow/PyTorch等深度学习框架
4. 有推荐系统/NLP相关经验优先
5. 具备良好的数学功底`,
    responsibilities: `1. 推荐算法研发与优化
2. 用户行为分析与建模
3. AB测试设计与效果评估
4. 前沿算法研究与应用`,
    job_type: 'fulltime',
    education: '硕士及以上',
    experience: '2-5年',
    official_url: 'https://jobs.bytedance.com/',
    publish_date: new Date('2025-01-08'),
  },
  {
    title: '数据分析师 - 商业化',
    company: 'ByteDance',
    company_code: 'bytedance',
    location: '上海',
    salary_min: 25,
    salary_max: 40,
    salary_text: '25k-40k',
    category: 'data',
    tags: 'SQL,Python,数据分析,Tableau,AB测试',
    description: `负责抖音商业化业务数据分析。
    搭建数据指标体系，支持业务决策。
    深入分析用户行为，挖掘业务增长点。`,
    requirements: `1. 本科及以上学历，统计学/数学/计算机相关专业
2. 2年以上数据分析经验
3. 精通SQL，熟悉Python/R
4. 有商业分析或增长分析经验优先`,
    responsibilities: `1. 核心业务指标监控与分析
2. 用户行为数据分析
3. 业务策略效果评估
4. 数据产品建设`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '2-4年',
    official_url: 'https://jobs.bytedance.com/',
    publish_date: new Date('2025-01-12'),
  },
  {
    title: '产品经理 - TikTok',
    company: 'ByteDance',
    company_code: 'bytedance',
    location: '北京',
    salary_min: 30,
    salary_max: 50,
    salary_text: '30k-50k',
    category: 'product',
    tags: '产品设计,用户增长,数据分析,项目管理',
    description: `负责 TikTok 核心功能的产品设计。
    制定产品 roadmap，推动产品迭代。
    协调多方资源，确保项目落地。`,
    requirements: `1. 本科及以上学历
2. 3年以上互联网产品经验
3. 有短视频/社交产品经验优先
4. 具备良好的逻辑思维和沟通能力`,
    responsibilities: `1. TikTok 功能规划与设计
2. 需求文档编写与项目管理
3. 数据分析与效果评估
4. 跨团队协作与资源协调`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '3-5年',
    official_url: 'https://jobs.bytedance.com/',
    publish_date: new Date('2025-01-14'),
  },
  {
    title: '运营专员 - 抖音直播',
    company: 'ByteDance',
    company_code: 'bytedance',
    location: '北京',
    salary_min: 18,
    salary_max: 30,
    salary_text: '18k-30k',
    category: 'operation',
    tags: '直播运营,用户运营,活动策划,内容运营',
    description: `负责抖音直播业务运营工作。
    策划直播活动，提升用户活跃度。
    运营主播资源，优化直播生态。`,
    requirements: `1. 本科及以上学历
2. 1年以上直播/内容运营经验
3. 熟悉短视频/直播行业
4. 具备良好的策划和执行能力`,
    responsibilities: `1. 直播活动策划与执行
2. 主播运营与孵化
3. 直播数据监控与分析
4. 行业动态跟踪与竞品调研`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '1-3年',
    official_url: 'https://jobs.bytedance.com/',
    publish_date: new Date('2025-01-16'),
  },
  {
    title: '前端实习 - 飞书',
    company: 'ByteDance',
    company_code: 'bytedance',
    location: '北京',
    salary_min: 200,
    salary_max: 350,
    salary_text: '200-350/天',
    category: 'frontend',
    tags: 'React,TypeScript,前端',
    description: `负责飞书产品的前端开发工作。
    参与功能开发与bug修复。
    学习并应用新技术。`,
    requirements: `1. 计算机相关专业在读本科生/研究生
2. 熟悉HTML/CSS/JavaScript
3. 了解React或Vue框架
4. 实习时间不少于3个月`,
    responsibilities: `1. 飞书Web端功能开发
2. 参与代码评审和文档编写
3. 学习企业级前端最佳实践`,
    job_type: 'internship',
    education: '本科及以上在读',
    experience: '应届/在校',
    official_url: 'https://jobs.bytedance.com/',
    publish_date: new Date('2025-01-18'),
  },

  // ==================== 腾讯 ====================
  {
    title: '后端开发工程师 - 微信',
    company: 'Tencent',
    company_code: 'tencent',
    location: '广州',
    salary_min: 30,
    salary_max: 55,
    salary_text: '30k-55k',
    category: 'backend',
    tags: 'C++,Linux,网络编程,分布式,微信',
    description: `负责微信后端核心系统开发。
    支撑十亿级用户的即时通讯服务。
    参与高并发、低延迟系统架构设计。`,
    requirements: `1. 本科及以上学历，计算机相关专业
2. 3年以上后端开发经验
3. 精通C++/Go开发
4. 熟悉Linux网络编程
5. 有高并发系统开发经验优先`,
    responsibilities: `1. 微信消息系统开发与优化
2. 高并发后端架构设计
3. 系统性能调优
4. 技术难题攻关`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '3-5年',
    official_url: 'https://careers.tencent.com/',
    publish_date: new Date('2025-01-11'),
  },
  {
    title: '算法工程师 - 游戏AI',
    company: 'Tencent',
    company_code: 'tencent',
    location: '深圳',
    salary_min: 35,
    salary_max: 65,
    salary_text: '35k-65k',
    category: 'algorithm',
    tags: '强化学习,游戏AI,深度学习,Python,C++',
    description: `负责游戏AI算法研发。
    应用强化学习技术提升游戏体验。
    参与游戏智能化创新项目。`,
    requirements: `1. 硕士及以上学历，人工智能相关专业
2. 扎实的强化学习理论基础
3. 熟悉深度学习框架
4. 有游戏AI研发经验优先`,
    responsibilities: `1. 游戏AI算法设计与实现
2. 强化学习模型训练与优化
3. 游戏智能化方案落地
4. 前沿技术研究`,
    job_type: 'fulltime',
    education: '硕士及以上',
    experience: '2-5年',
    official_url: 'https://careers.tencent.com/',
    publish_date: new Date('2025-01-09'),
  },
  {
    title: '前端开发工程师 - QQ',
    company: 'Tencent',
    company_code: 'tencent',
    location: '深圳',
    salary_min: 28,
    salary_max: 45,
    salary_text: '28k-45k',
    category: 'frontend',
    tags: 'React,小程序,Web前端,TypeScript',
    description: `负责QQ及腾讯其他社交产品的前端开发。
    探索前端新技术，提升研发效率。
    优化前端性能，提升用户体验。`,
    requirements: `1. 本科及以上学历，计算机相关专业
2. 2年以上前端开发经验
3. 精通前端基础技术(HTML/CSS/JS)
4. 熟悉React/Vue框架
5. 有小程序开发经验优先`,
    responsibilities: `1. QQ客户端Web前端开发
2. 前端组件库建设
3. 性能优化与用户体验提升
4. 前端工程化建设`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '2-4年',
    official_url: 'https://careers.tencent.com/',
    publish_date: new Date('2025-01-13'),
  },
  {
    title: '数据产品经理 - 腾讯云',
    company: 'Tencent',
    company_code: 'tencent',
    location: '深圳',
    salary_min: 28,
    salary_max: 45,
    salary_text: '28k-45k',
    category: 'product',
    tags: '数据产品,B端产品,数据分析,腾讯云',
    description: `负责腾讯云数据产品的规划与设计。
    打造企业级数据分析和可视化产品。
    深入理解客户需求，推动产品迭代。`,
    requirements: `1. 本科及以上学历
2. 3年以上B端产品经验
3. 有数据分析/BI产品经验优先
4. 具备良好的逻辑思维和沟通能力`,
    responsibilities: `1. 数据产品规划与设计
2. 需求分析与管理
3. 产品上线与运营
4. 客户调研与反馈分析`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '3-5年',
    official_url: 'https://careers.tencent.com/',
    publish_date: new Date('2025-01-15'),
  },
  {
    title: '数据分析师 - 腾讯视频',
    company: 'Tencent',
    company_code: 'tencent',
    location: '深圳',
    salary_min: 22,
    salary_max: 38,
    salary_text: '22k-38k',
    category: 'data',
    tags: 'SQL,Python,数据分析,视频行业',
    description: `负责腾讯视频业务数据分析。
    构建业务数据指标体系。
    通过数据驱动业务增长。`,
    requirements: `1. 本科及以上学历，统计学/数学相关专业
2. 2年以上数据分析经验
3. 精通SQL，熟练使用Python
4. 有互联网视频行业经验优先`,
    responsibilities: `1. 业务数据分析与洞察
2. 数据指标体系搭建
3. 数据报表开发
4. AB测试设计与分析`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '2-4年',
    official_url: 'https://careers.tencent.com/',
    publish_date: new Date('2025-01-14'),
  },
  {
    title: '内容运营 - 腾讯新闻',
    company: 'Tencent',
    company_code: 'tencent',
    location: '北京',
    salary_min: 16,
    salary_max: 28,
    salary_text: '16k-28k',
    category: 'operation',
    tags: '内容运营,新媒体,新闻,选题策划',
    description: `负责腾讯新闻内容运营工作。
    策划优质内容专题。
    跟踪热点事件，进行内容生产。`,
    requirements: `1. 本科及以上学历，新闻传播相关专业
2. 1年以上内容运营经验
3. 对新闻热点敏感
4. 具备良好的文字功底`,
    responsibilities: `1. 内容选题策划
2. 热点事件跟踪报道
3. 内容质量把控
4. 数据分析与优化`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '1-3年',
    official_url: 'https://careers.tencent.com/',
    publish_date: new Date('2025-01-17'),
  },
  {
    title: '后端实习 - 微信支付',
    company: 'Tencent',
    company_code: 'tencent',
    location: '广州',
    salary_min: 180,
    salary_max: 300,
    salary_text: '180-300/天',
    category: 'backend',
    tags: 'Java,后端,微服务,支付',
    description: `负责微信支付后端开发工作。
    参与支付系统功能开发。
    学习金融级系统架构设计。`,
    requirements: `1. 计算机相关专业在读本科生/研究生
2. 熟悉Java/Python/C++任一语言
3. 了解数据库和计算机网络
4. 实习时间不少于3个月`,
    responsibilities: `1. 支付功能开发
2. 接口设计与实现
3. 单元测试编写
4. 技术文档撰写`,
    job_type: 'internship',
    education: '本科及以上在读',
    experience: '应届/在校',
    official_url: 'https://careers.tencent.com/',
    publish_date: new Date('2025-01-19'),
  },

  // ==================== 阿里巴巴 ====================
  {
    title: 'Java开发工程师 - 淘宝',
    company: 'Alibaba',
    company_code: 'alibaba',
    location: '杭州',
    salary_min: 32,
    salary_max: 55,
    salary_text: '32k-55k',
    category: 'backend',
    tags: 'Java,Spring Cloud,分布式,微服务,中间件',
    description: `负责淘宝电商平台后端开发。
    构建高可用、高性能的分布式系统。
    参与双十一等大促技术保障。`,
    requirements: `1. 本科及以上学历，计算机相关专业
2. 3年以上Java开发经验
3. 精通Java语言，熟悉Spring生态
4. 熟悉分布式系统设计
5. 有电商系统开发经验优先`,
    responsibilities: `1. 淘宝核心业务系统开发
2. 分布式架构设计与实现
3. 系统性能优化
4. 技术难题攻关`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '3-5年',
    official_url: 'https://careers.alibaba.com/',
    publish_date: new Date('2025-01-10'),
  },
  {
    title: '算法工程师 - 搜索推荐',
    company: 'Alibaba',
    company_code: 'alibaba',
    location: '杭州',
    salary_min: 40,
    salary_max: 75,
    salary_text: '40k-75k',
    category: 'algorithm',
    tags: '搜索算法,推荐系统,机器学习,深度学习,NLP',
    description: `负责淘宝搜索和推荐算法研发。
    提升商品搜索和个性化推荐的精准度。
    运用前沿AI技术优化用户体验。`,
    requirements: `1. 硕士及以上学历，计算机/数学/统计相关专业
2. 扎实的机器学习和深度学习基础
3. 熟悉搜索/推荐/广告算法
4. 有大规模系统经验优先
5. 精通C++/Python`,
    responsibilities: `1. 搜索排序算法优化
2. 个性化推荐模型研发
3. 用户意图理解
4. 线上效果分析与优化`,
    job_type: 'fulltime',
    education: '硕士及以上',
    experience: '2-5年',
    official_url: 'https://careers.alibaba.com/',
    publish_date: new Date('2025-01-08'),
  },
  {
    title: '前端开发工程师 - 钉钉',
    company: 'Alibaba',
    company_code: 'alibaba',
    location: '杭州',
    salary_min: 28,
    salary_max: 48,
    salary_text: '28k-48k',
    category: 'frontend',
    tags: 'React,TypeScript,跨端,WebSocket,Node.js',
    description: `负责钉钉企业协作产品的前端开发。
    构建高效的Web/跨端解决方案。
    探索前端新技术方向。`,
    requirements: `1. 本科及以上学历，计算机相关专业
2. 2年以上前端开发经验
3. 精通前端基础(HTML/CSS/JS)
4. 熟悉React/Vue生态
5. 了解跨端开发方案`,
    responsibilities: `1. 钉钉产品前端开发
2. 前端架构设计与优化
3. 组件库建设
4. 性能优化`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '2-4年',
    official_url: 'https://careers.alibaba.com/',
    publish_date: new Date('2025-01-12'),
  },
  {
    title: '数据研发工程师 - 阿里云',
    company: 'Alibaba',
    company_code: 'alibaba',
    location: '杭州',
    salary_min: 30,
    salary_max: 50,
    salary_text: '30k-50k',
    category: 'data',
    tags: '大数据,Hadoop,Spark,Flink,SQL',
    description: `负责阿里云数据平台研发。
    构建企业级大数据处理系统。
    参与数据中台架构设计与实现。`,
    requirements: `1. 本科及以上学历，计算机相关专业
2. 2年以上大数据开发经验
3. 熟悉Hadoop/Spark/Flink生态
4. 精通SQL和数据仓库设计
5. 有阿里云产品使用经验优先`,
    responsibilities: `1. 数据平台功能开发
2. 数据处理流程优化
3. 数据质量保障
4. 数据服务建设`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '2-5年',
    official_url: 'https://careers.alibaba.com/',
    publish_date: new Date('2025-01-11'),
  },
  {
    title: '产品经理 - 饿了么',
    company: 'Alibaba',
    company_code: 'alibaba',
    location: '上海',
    salary_min: 28,
    salary_max: 48,
    salary_text: '28k-48k',
    category: 'product',
    tags: '本地生活,产品设计,用户增长,数据分析',
    description: `负责饿了么核心产品设计。
    打造优质的用户外卖体验。
    推动产品创新与业务增长。`,
    requirements: `1. 本科及以上学历
2. 3年以上互联网产品经验
3. 有本地生活/O2O产品经验优先
4. 具备良好的数据分析能力
5. 有创业精神，结果导向`,
    responsibilities: `1. 饿了么产品规划与设计
2. 用户需求分析与验证
3. 产品迭代管理
4. 跨团队协作`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '3-5年',
    official_url: 'https://careers.alibaba.com/',
    publish_date: new Date('2025-01-13'),
  },
  {
    title: '用户运营 - 淘宝直播',
    company: 'Alibaba',
    company_code: 'alibaba',
    location: '杭州',
    salary_min: 18,
    salary_max: 32,
    salary_text: '18k-32k',
    category: 'operation',
    tags: '电商运营,直播运营,用户增长,活动策划',
    description: `负责淘宝直播用户运营工作。
    策划直播活动，提升用户活跃。
    分析用户行为，优化运营策略。`,
    requirements: `1. 本科及以上学历
2. 1年以上电商/直播运营经验
3. 熟悉淘宝/天猫生态
4. 具备良好的策划能力
5. 有主播运营经验优先`,
    responsibilities: `1. 直播活动策划与执行
2. 用户分层运营
3. 主播孵化与赋能
4. 数据分析与优化`,
    job_type: 'fulltime',
    education: '本科及以上',
    experience: '1-3年',
    official_url: 'https://careers.alibaba.com/',
    publish_date: new Date('2025-01-16'),
  },
  {
    title: '算法实习 - 蚂蚁金服',
    company: 'Alibaba',
    company_code: 'alibaba',
    location: '杭州',
    salary_min: 250,
    salary_max: 400,
    salary_text: '250-400/天',
    category: 'algorithm',
    tags: '机器学习,深度学习,金融科技',
    description: `负责蚂蚁金服算法研究工作。
    参与金融风控/智能客服算法研发。
    学习金融科技前沿技术。`,
    requirements: `1. 计算机/数学相关专业在读研究生
2. 扎实的机器学习基础
3. 熟悉TensorFlow/PyTorch
4. 实习时间不少于4个月`,
    responsibilities: `1. 机器学习算法研究
2. 模型训练与优化
3. 技术文档撰写
4. 论文阅读与分享`,
    job_type: 'internship',
    education: '硕士及以上在读',
    experience: '应届/在校',
    official_url: 'https://careers.alibaba.com/',
    publish_date: new Date('2025-01-20'),
  },
];

async function seedJobs() {
  console.log('开始填充岗位数据...');
  
  try {
    // 清空现有岗位数据
    console.log('清空现有岗位数据...');
    await db.delete(jobs);
    
    // 批量插入新数据
    console.log(`插入 ${JOBS_DATA.length} 条岗位数据...`);
    
    for (const jobData of JOBS_DATA) {
      const { company_code, ...rest } = jobData;
      await db.insert(jobs).values({
        ...rest,
        company: company_code, // 使用 company_code 作为 company 字段值
      });
    }
    
    console.log('岗位数据填充完成!');
    
    // 验证数据
    const count = await db.select().from(jobs);
    console.log(`当前数据库共有 ${count.length} 条岗位记录`);
    
    // 统计各公司岗位数量
    const bytedance = count.filter(j => j.company === 'bytedance' || j.company === 'ByteDance').length;
    const tencent = count.filter(j => j.company === 'tencent' || j.company === 'Tencent').length;
    const alibaba = count.filter(j => j.company === 'alibaba' || j.company === 'Alibaba').length;
    
    console.log(`字节跳动: ${bytedance} 个岗位`);
    console.log(`腾讯: ${tencent} 个岗位`);
    console.log(`阿里巴巴: ${alibaba} 个岗位`);
    
  } catch (error) {
    console.error('填充数据失败:', error);
    throw error;
  }
}

seedJobs().catch(console.error);
