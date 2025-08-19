# LFan 项目缓存系统说明

## 概述

本项目实现了基于 localStorage 的智能缓存系统，用于减少网络请求，提升用户体验，降低服务器压力。

## 缓存策略

### 推荐使用 localStorage 的原因

1. **持久性存储**：数据不会因为关闭浏览器而丢失
2. **存储容量大**：通常有5-10MB的存储空间，足够存储API返回的JSON数据
3. **简单易用**：API简单，不需要额外的配置
4. **性能好**：读取速度快，减少网络请求

### 缓存时间配置

| 数据类型 | 缓存时间 | 说明 |
|---------|---------|------|
| 动漫信息 (subjects) | 24小时 | 基本信息相对稳定，变化较少 |
| 角色信息 (characters) | 7天 | 角色信息基本不变 |
| 排行榜 (rank) | 2小时 | 排名可能变化，需要较短的缓存时间 |
| 每日放送 (calendar) | 30分钟 | 每日更新，需要较短的缓存时间 |
| 集数信息 (episodes) | 12小时 | 集数信息相对稳定 |

## 文件结构

```
src/services/Bangumi/
├── api.js              # 原始API配置
├── cache.js            # 缓存核心逻辑
├── apiService.js       # 集成缓存的API服务
└── components/
    ├── CacheManager.jsx    # 缓存管理组件
    └── CacheManager.css    # 缓存管理组件样式
```

## 使用方法

### 1. 基本API调用

```javascript
import bangumiApiService from '../services/Bangumi/apiService';

// 获取动漫信息（自动使用缓存）
const subject = await bangumiApiService.getSubject('12345');

// 获取角色信息（自动使用缓存）
const characters = await bangumiApiService.getCharacters('12345');

// 获取排行榜（自动使用缓存）
const rankList = await bangumiApiService.getRank('2', '30', '0');
```

### 2. 强制刷新缓存

```javascript
// 强制刷新特定数据（忽略缓存）
const freshData = await bangumiApiService.forceRefresh('subjects', { subject_id: '12345' });

// 强制刷新每日放送
const freshCalendar = await bangumiApiService.forceRefresh('calendar');
```

### 3. 缓存管理

```javascript
// 获取缓存统计信息
const stats = bangumiApiService.getCacheStats();
console.log(stats);
// 输出示例：
// {
//   totalKeys: 15,
//   validCount: 12,
//   expiredCount: 3,
//   totalSize: "45.67 KB"
// }

// 清理所有缓存
bangumiApiService.clearAllCache();

// 清理特定类型的缓存
bangumiApiService.clearCacheByType('subjects');
```

## 缓存管理界面

项目右下角有一个 🗄️ 按钮，点击可以打开缓存管理界面，提供以下功能：

### 缓存统计
- 总缓存数量
- 有效缓存数量
- 过期缓存数量
- 缓存总大小

### 缓存操作
- **清理特定类型缓存**：可以选择性地清理某类数据的缓存
- **强制刷新**：强制获取最新数据
- **全局操作**：清理所有缓存或刷新统计信息

## 技术特性

### 1. 智能缓存键生成
- 基于API类型和参数自动生成唯一的缓存键
- 支持复杂的参数组合

### 2. 自动过期管理
- 每个缓存项都有独立的过期时间
- 定期自动清理过期缓存（每5分钟执行一次）
- 读取时自动检查过期状态

### 3. 错误处理
- 缓存操作失败时优雅降级
- 网络请求失败时不影响缓存读取
- 详细的错误日志

### 4. 性能优化
- 缓存命中时直接返回数据，无需网络请求
- 异步操作，不阻塞UI
- 内存使用监控

## 配置选项

### 修改默认缓存时间

在 `src/services/Bangumi/cache.js` 中修改 `defaultTTL` 对象：

```javascript
this.defaultTTL = {
    subjects: 24 * 60 * 60 * 1000,      // 修改为48小时
    characters: 7 * 24 * 60 * 60 * 1000, // 修改为14天
    rank: 2 * 60 * 60 * 1000,           // 修改为1小时
    calendar: 30 * 60 * 1000,            // 修改为15分钟
    episodes: 12 * 60 * 60 * 1000        // 修改为6小时
};
```

### 自定义缓存时间

```javascript
// 为特定请求设置自定义缓存时间
const data = await bangumiApiService.request(
    url, 
    'subjects', 
    { subject_id: '12345' }, 
    2 * 60 * 60 * 1000  // 2小时
);
```

## 注意事项

### 1. 存储限制
- localStorage 通常有5-10MB的存储限制
- 大型JSON数据可能占用较多空间
- 定期清理过期缓存很重要

### 2. 数据一致性
- 缓存数据可能与服务器数据不同步
- 重要数据建议使用强制刷新
- 用户可以通过缓存管理界面手动清理

### 3. 浏览器兼容性
- localStorage 在现代浏览器中广泛支持
- 不支持 localStorage 的浏览器会自动降级为无缓存模式

## 故障排除

### 常见问题

1. **缓存不生效**
   - 检查浏览器是否支持 localStorage
   - 查看控制台是否有错误信息
   - 确认缓存键生成是否正确

2. **缓存占用空间过大**
   - 使用缓存管理界面清理过期缓存
   - 调整缓存时间配置
   - 检查是否有重复的缓存项

3. **数据过期问题**
   - 使用强制刷新获取最新数据
   - 调整相应数据类型的缓存时间
   - 手动清理特定类型的缓存

### 调试信息

在浏览器控制台中可以看到详细的缓存操作日志：

```
[缓存命中] subjects: {subject_id: "12345"}
[网络请求] characters: {subject_id: "12345"}
```

## 未来改进

1. **离线支持**：实现 Service Worker 离线缓存
2. **智能预加载**：基于用户行为预测性缓存
3. **压缩存储**：对大型JSON数据进行压缩
4. **同步机制**：多标签页间的缓存同步
5. **性能监控**：详细的缓存性能指标

## 总结

本缓存系统通过 localStorage 实现了智能的数据缓存，显著减少了网络请求，提升了用户体验。系统设计灵活，易于配置和维护，为项目的性能优化提供了强有力的支持。
