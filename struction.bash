src/
├── assets/               # 静态资源
│   ├── fonts/            # 字体文件
│   ├── images/           # 图片资源
│   └── styles/           # 全局样式
│       ├── base.css      # 基础样式重置
│       ├── variables.css # CSS 变量/SCSS变量
│       └── themes/       # 主题样式
├── components/           # 通用组件
│   ├── ui/               # 基础UI组件 (Button, Card等)
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   └── index.js  # 统一导出
│   ├── layout/           # 布局组件
│   └── features/         # 业务功能组件
├── pages/                # 页面组件
│   ├── Home/
│   │   ├── Home.jsx
│   │   ├── Home.module.css
│   │   └── components/   # 页面专属组件
├── routes/               # 路由配置
│   └── index.jsx
├── hooks/                # 自定义Hook
├── context/              # Context API
├── utils/                # 工具函数
├── services/             # API服务层
│   ├── api.js            # Axios实例
│   └── userService.js    # API模块
├── store/                # 状态管理(Redux/Zustand)
│   ├── slices/           # Redux Toolkit切片
│   └── index.js
├── App.jsx               # 根组件
└── main.jsx              # 应用入口
public/                  # 无需构建的静态资源
  ├── favicon.ico
  └── robots.txt