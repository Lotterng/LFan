import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BASE_URL, rank } from "../services/Bangumi/api";
import "./Rank.css";

export default function Rank() {
    const [searchParams] = useSearchParams();
    const [rankList, setRankList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 从URL参数获取type，默认为"2"（动画）
    const type = searchParams.get("type") || "2";
    const limit = "30";
    const offset = "0";

    // 根据type获取对应的类型名称
    const getTypeName = (type) => {
        const typeMap = {
            "1": "小说",
            "2": "动画", 
            "3": "音乐",
            "4": "游戏",
            "6": "三次元"
        };
        return typeMap[type] || "未知";
    };

    // 格式化日期显示
    const formatDate = (dateString) => {
        if (!dateString) return '未知';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    };

    // 获取要显示的标签
    const getDisplayTags = (item) => {
        if (item.meta_tags && item.meta_tags.length > 0) {
            return item.meta_tags;
        }
        if (item.tags && item.tags.length > 0) {
            return item.tags.slice(0, 5);
        }
        return [];
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        fetch(`${BASE_URL}${rank.replace("{type}", type).replace("{limit}", limit).replace("{offset}", offset)}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.data) {
                    setRankList(data.data);
                } else {
                    setRankList([]);
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [type]);

    if (loading) {
        return (
            <div className="rank-container">
                <div className="loading">加载中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rank-container">
                <div className="error">加载失败: {error}</div>
            </div>
        );
    }

    return (
        <div className="rank-container">
            <h1>{getTypeName(type)}排行榜</h1>
            <nav className="rank-nav">
                <span className="nav-item">排名</span>
                <span className="nav-item">封面</span>
                <span className="nav-item">信息</span>
                <span className="nav-item">评分</span>
            </nav>
            <div className="rank-list">
                {rankList.length > 0 ? (
                    <ul>
                        {rankList.map((item, index) => (
                            <li key={item.id} className="rank-item">
                                <div className="rank-number">{index + 1}</div>
                                <div className="rank-cover">
                                    <img 
                                        src={item.images?.small || item.images?.common} 
                                        alt={item.name_cn || item.name}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <div className="rank-info">
                                    <div className="rank-name">
                                        {item.name_cn || item.name}
                                    </div>
                                    {item.name_cn && item.name !== item.name_cn && (
                                        <div className="rank-name-original">{item.name}</div>
                                    )}
                                    <div className="rank-tags">
                                        {getDisplayTags(item).map((tag, tagIndex) => (
                                            <span key={tagIndex} className="rank-tag-item">
                                                {tag.name || tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="rank-date">
                                        {formatDate(item.date)}
                                    </div>
                                </div>
                                <div className="rank-score">
                                    <div className="score-main">
                                        {item.rating?.score ? item.rating.score.toFixed(1) : '暂无'}
                                    </div>
                                    {item.rating && (
                                        <div className="score-details">
                                            <div className="score-rank">排名: {item.rating.rank}</div>
                                            <div className="score-total">总评: {item.rating.total}人</div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-data">暂无数据</div>
                )}
            </div>
        </div>
    );
}