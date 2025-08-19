// Bangumi API 缓存服务
class BangumiCache {
    constructor() {
        this.cachePrefix = 'bangumi_cache_';
        this.defaultTTL = {
            subjects: 24 * 60 * 60 * 1000,      // 动漫信息：24小时
            characters: 7 * 24 * 60 * 60 * 1000, // 角色信息：7天
            rank: 2 * 60 * 60 * 1000,           // 排行榜：2小时
            calendar: 30 * 60 * 1000,            // 每日放送：30分钟
            episodes: 12 * 60 * 60 * 1000        // 集数信息：12小时
        };
    }

    // 生成缓存键
    generateKey(type, params = {}) {
        const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${this.cachePrefix}${type}_${paramString}`;
    }

    // 设置缓存
    setCache(type, params, data, customTTL = null) {
        try {
            const key = this.generateKey(type, params);
            const ttl = customTTL || this.defaultTTL[type] || this.defaultTTL.subjects;
            const cacheData = {
                data: data,
                timestamp: Date.now(),
                ttl: ttl
            };
            localStorage.setItem(key, JSON.stringify(cacheData));
            return true;
        } catch (error) {
            console.warn('缓存设置失败:', error);
            return false;
        }
    }

    // 获取缓存
    getCache(type, params) {
        try {
            const key = this.generateKey(type, params);
            const cached = localStorage.getItem(key);
            
            if (!cached) return null;
            
            const cacheData = JSON.parse(cached);
            const now = Date.now();
            
            // 检查是否过期
            if (now - cacheData.timestamp > cacheData.ttl) {
                this.removeCache(type, params);
                return null;
            }
            
            return cacheData.data;
        } catch (error) {
            console.warn('缓存读取失败:', error);
            return null;
        }
    }

    // 删除缓存
    removeCache(type, params) {
        try {
            const key = this.generateKey(type, params);
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('缓存删除失败:', error);
            return false;
        }
    }

    // 清理过期缓存
    cleanExpiredCache() {
        try {
            const keys = Object.keys(localStorage);
            const now = Date.now();
            
            keys.forEach(key => {
                if (key.startsWith(this.cachePrefix)) {
                    try {
                        const cached = localStorage.getItem(key);
                        if (cached) {
                            const cacheData = JSON.parse(cached);
                            if (now - cacheData.timestamp > cacheData.ttl) {
                                localStorage.removeItem(key);
                            }
                        }
                    } catch (error) {
                        // 如果解析失败，删除该缓存
                        localStorage.removeItem(key);
                    }
                }
            });
        } catch (error) {
            console.warn('清理过期缓存失败:', error);
        }
    }

    // 清理所有缓存
    clearAllCache() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.cachePrefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.warn('清理所有缓存失败:', error);
            return false;
        }
    }

    // 获取缓存统计信息
    getCacheStats() {
        try {
            const keys = Object.keys(localStorage);
            const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
            const now = Date.now();
            let totalSize = 0;
            let expiredCount = 0;
            let validCount = 0;
            
            cacheKeys.forEach(key => {
                try {
                    const cached = localStorage.getItem(key);
                    if (cached) {
                        totalSize += cached.length;
                        const cacheData = JSON.parse(cached);
                        if (now - cacheData.timestamp > cacheData.ttl) {
                            expiredCount++;
                        } else {
                            validCount++;
                        }
                    }
                } catch (error) {
                    expiredCount++;
                }
            });
            
            return {
                totalKeys: cacheKeys.length,
                validCount,
                expiredCount,
                totalSize: `${(totalSize / 1024).toFixed(2)} KB`
            };
        } catch (error) {
            return null;
        }
    }
}

// 创建单例实例
const bangumiCache = new BangumiCache();

// 定期清理过期缓存（每5分钟执行一次）
setInterval(() => {
    bangumiCache.cleanExpiredCache();
}, 5 * 60 * 1000);

export default bangumiCache;
