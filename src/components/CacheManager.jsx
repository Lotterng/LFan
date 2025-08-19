import { useState, useEffect } from 'react';
import bangumiApiService from '../services/Bangumi/apiService';
import './CacheManager.css';

export default function CacheManager() {
    const [cacheStats, setCacheStats] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        updateCacheStats();
    }, []);

    const updateCacheStats = () => {
        const stats = bangumiApiService.getCacheStats();
        setCacheStats(stats);
    };

    const handleClearAllCache = () => {
        if (confirm('确定要清理所有缓存吗？这将清除所有已缓存的数据。')) {
            bangumiApiService.clearAllCache();
            updateCacheStats();
        }
    };

    const handleClearCacheByType = (type) => {
        const typeNames = {
            'subjects': '动漫信息',
            'characters': '角色信息',
            'rank': '排行榜',
            'calendar': '每日放送',
            'episodes': '集数信息'
        };
        
        if (confirm(`确定要清理${typeNames[type]}的缓存吗？`)) {
            bangumiApiService.clearCacheByType(type);
            updateCacheStats();
        }
    };

    const handleForceRefresh = async (type, params = {}) => {
        try {
            await bangumiApiService.forceRefresh(type, params);
            alert('强制刷新成功！');
            updateCacheStats();
        } catch (error) {
            alert('强制刷新失败：' + error.message);
        }
    };

    if (!isVisible) {
        return (
            <button 
                className="cache-manager-toggle"
                onClick={() => setIsVisible(true)}
                title="缓存管理"
            >
                🗄️
            </button>
        );
    }

    return (
        <div className="cache-manager-overlay">
            <div className="cache-manager-modal">
                <div className="cache-manager-header">
                    <h3>缓存管理</h3>
                    <button 
                        className="cache-manager-close"
                        onClick={() => setIsVisible(false)}
                    >
                        ×
                    </button>
                </div>
                
                <div className="cache-manager-content">
                    {cacheStats ? (
                        <div className="cache-stats">
                            <h4>缓存统计</h4>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">总缓存数：</span>
                                    <span className="stat-value">{cacheStats.totalKeys}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">有效缓存：</span>
                                    <span className="stat-value">{cacheStats.validCount}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">过期缓存：</span>
                                    <span className="stat-value">{cacheStats.expiredCount}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">总大小：</span>
                                    <span className="stat-value">{cacheStats.totalSize}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="cache-stats">
                            <p>无法获取缓存统计信息</p>
                        </div>
                    )}

                    <div className="cache-actions">
                        <h4>缓存操作</h4>
                        
                        <div className="action-section">
                            <h5>清理特定类型缓存</h5>
                            <div className="action-buttons">
                                <button 
                                    onClick={() => handleClearCacheByType('subjects')}
                                    className="action-btn clear-btn"
                                >
                                    清理动漫信息缓存
                                </button>
                                <button 
                                    onClick={() => handleClearCacheByType('characters')}
                                    className="action-btn clear-btn"
                                >
                                    清理角色信息缓存
                                </button>
                                <button 
                                    onClick={() => handleClearCacheByType('rank')}
                                    className="action-btn clear-btn"
                                >
                                    清理排行榜缓存
                                </button>
                                <button 
                                    onClick={() => handleClearCacheByType('calendar')}
                                    className="action-btn clear-btn"
                                >
                                    清理每日放送缓存
                                </button>
                                <button 
                                    onClick={() => handleClearCacheByType('episodes')}
                                    className="action-btn clear-btn"
                                >
                                    清理集数信息缓存
                                </button>
                            </div>
                        </div>

                        <div className="action-section">
                            <h5>强制刷新</h5>
                            <div className="action-buttons">
                                <button 
                                    onClick={() => handleForceRefresh('calendar')}
                                    className="action-btn refresh-btn"
                                >
                                    刷新每日放送
                                </button>
                                <button 
                                    onClick={() => handleForceRefresh('rank', { type: '2' })}
                                    className="action-btn refresh-btn"
                                >
                                    刷新动画排行榜
                                </button>
                            </div>
                        </div>

                        <div className="action-section">
                            <h5>全局操作</h5>
                            <div className="action-buttons">
                                <button 
                                    onClick={handleClearAllCache}
                                    className="action-btn danger-btn"
                                >
                                    清理所有缓存
                                </button>
                                <button 
                                    onClick={updateCacheStats}
                                    className="action-btn"
                                >
                                    刷新统计信息
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
