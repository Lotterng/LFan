import { BASE_URL, calendar, subjects, characters, rank, episodes } from './api.js';
import bangumiCache from './cache.js';

class BangumiApiService {
    constructor() {
        this.baseUrl = BASE_URL;
    }

    // 通用请求方法
    async request(url, cacheType, cacheParams = {}, customTTL = null) {
        try {
            // 先尝试从缓存获取
            const cachedData = bangumiCache.getCache(cacheType, cacheParams);
            if (cachedData) {
                console.log(`[缓存命中] ${cacheType}:`, cacheParams);
                return cachedData;
            }

            // 缓存未命中，发起网络请求
            console.log(`[网络请求] ${cacheType}:`, cacheParams);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 将数据存入缓存
            bangumiCache.setCache(cacheType, cacheParams, data, customTTL);
            
            return data;
        } catch (error) {
            console.error(`API请求失败 [${cacheType}]:`, error);
            throw error;
        }
    }

    // 获取每日放送信息
    async getCalendar() {
        const url = `${this.baseUrl}${calendar}`;
        return this.request(url, 'calendar', {}, 30 * 60 * 1000); // 30分钟缓存
    }

    // 获取动漫信息
    async getSubject(subjectId) {
        const url = `${this.baseUrl}${subjects.replace('{subject_id}', subjectId)}`;
        return this.request(url, 'subjects', { subject_id: subjectId });
    }

    // 获取角色信息
    async getCharacters(subjectId) {
        const url = `${this.baseUrl}${characters.replace('{subject_id}', subjectId)}`;
        return this.request(url, 'characters', { subject_id: subjectId });
    }

    // 获取排行榜
    async getRank(type = '2', limit = '30', offset = '0') {
        const url = `${this.baseUrl}${rank
            .replace('{type}', type)
            .replace('{limit}', limit)
            .replace('{offset}', offset)}`;
        return this.request(url, 'rank', { type, limit, offset }, 2 * 60 * 60 * 1000); // 2小时缓存
    }

    // 获取集数信息
    async getEpisodes(subjectId, limit = '100', offset = '0') {
        const url = `${this.baseUrl}${episodes
            .replace('{subject_id}', subjectId)
            .replace('{limit}', limit)
            .replace('{offset}', offset)}`;
        return this.request(url, 'episodes', { subject_id: subjectId, limit, offset });
    }

    // 强制刷新缓存（忽略缓存，直接请求）
    async forceRefresh(cacheType, cacheParams = {}) {
        try {
            // 删除现有缓存
            bangumiCache.removeCache(cacheType, cacheParams);
            
            // 根据类型重新请求
            switch (cacheType) {
                case 'calendar':
                    return this.getCalendar();
                case 'subjects':
                    return this.getSubject(cacheParams.subject_id);
                case 'characters':
                    return this.getCharacters(cacheParams.subject_id);
                case 'rank':
                    return this.getRank(cacheParams.type, cacheParams.limit, cacheParams.offset);
                case 'episodes':
                    return this.getEpisodes(cacheParams.subject_id, cacheParams.limit, cacheParams.offset);
                default:
                    throw new Error(`未知的缓存类型: ${cacheType}`);
            }
        } catch (error) {
            console.error('强制刷新失败:', error);
            throw error;
        }
    }

    // 获取缓存统计信息
    getCacheStats() {
        return bangumiCache.getCacheStats();
    }

    // 清理所有缓存
    clearAllCache() {
        return bangumiCache.clearAllCache();
    }

    // 清理特定类型的缓存
    clearCacheByType(type) {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(`bangumi_cache_${type}_`)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.warn('清理缓存失败:', error);
            return false;
        }
    }
}

// 创建单例实例
const bangumiApiService = new BangumiApiService();

export default bangumiApiService;
