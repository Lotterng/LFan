import bangumiApiService from "../../services/Bangumi/apiService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Subject.css";
import Character from "./Character.jsx";


export default function Subject(){
    const [subject, setSubject] = useState(null);
    const [episodesAired, setEpisodesAired] = useState(null);
    const [episodesTotal, setEpisodesTotal] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        bangumiApiService.getSubject(id)
            .then(data => setSubject(data))
            .catch(err => console.log(err));
    }, [id]);

    useEffect(() => {
        if (!id) return;
        setEpisodesAired(null);
        setEpisodesTotal(null);
        
        bangumiApiService.getEpisodes(id, '100', '0')
            .then(data => {
                const now = new Date();
                const aired = Array.isArray(data?.data)
                    ? data.data.filter(ep => {
                        if (!ep?.airdate) return false;
                        const d = new Date(ep.airdate);
                        return !isNaN(d) && d <= now;
                        }).length
                    : 0;
                const totalFromApi = Number.isFinite(data?.total) ? data.total : undefined;
                const total = totalFromApi ?? subject?.total_episodes ?? subject?.eps ?? undefined;
                setEpisodesAired(aired);
                if (total !== undefined) setEpisodesTotal(total);
            })
            .catch(err => console.log(err));
    }, [id, subject?.total_episodes, subject?.eps]);
    
    return(
        <div>
            {subject ? (
                <>
                    <h1>{subject.name}</h1>
                    <div className="subject-info">
                        <div className="subject-info-left">
                            <img src={subject.images.large} alt={subject.name} />
                            <div className="subject-info-detail">
                                <div className="detail-item">
                                    <span className="detail-label">类型：</span>
                                    <span className="detail-value">{subject.meta_tags.join('、')}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">平台：</span>
                                    <span className="detail-value">{subject.platform}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">总集数：</span>
                                    <span className="detail-value">{subject.total_episodes || subject.eps || "未知"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">放送日期：</span>
                                    <span className="detail-value">{subject.date || "未知"}</span>
                                </div>
                                {subject.infobox.map((item, index) => (
                                    <div className="detail-item" key={index}>
                                        <span className="detail-label">{item.key}：</span>
                                        <span className="detail-value">
                                            {(() => {
                                                // 处理不同类型的value
                                                if (typeof item.value === 'string') {
                                                    return item.value;
                                                } else if (typeof item.value === 'number') {
                                                    return item.value.toString();
                                                } else if (Array.isArray(item.value)) {
                                                    return item.value.map(v => v.v || v.name || v.title || v).join('、');
                                                } else if (item.value && typeof item.value === 'object') {
                                                    // 如果是对象，尝试提取v属性或其他可用属性
                                                    if (item.value.v !== undefined) {
                                                        return item.value.v;
                                                    } else if (item.value.name !== undefined) {
                                                        return item.value.name;
                                                    } else if (item.value.title !== undefined) {
                                                        return item.value.title;
                                                    } else {
                                                        return JSON.stringify(item.value);
                                                    }
                                                } else {
                                                    return item.value || '未知';
                                                }
                                            })()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="subject-info-right">
                            <div className="episodes-container">
                                <div className="episodes-title">进度</div>
                                <div className="episodes-count-row">
                                    <span className="episodes-count">{episodesAired ?? '-'}</span>
                                    <span className="episodes-sep">/</span>
                                    <span className="episodes-total">{episodesTotal ?? (subject.total_episodes || subject.eps || '-')}</span>
                                </div>
                                {(episodesTotal ?? subject.total_episodes ?? subject.eps) ? (
                                    <div className="episodes-list">
                                        {Array.from({ length: Number(episodesTotal ?? subject.total_episodes ?? subject.eps) || 0 }, (_, idx) => {
                                            const num = idx + 1;
                                            const airedNum = episodesAired ?? 0;
                                            const isAired = num <= airedNum;
                                            return (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    className={`episode-btn ${isAired ? 'aired' : 'upcoming'}`}
                                                    aria-label={`第${num}集${isAired ? '（已播出）' : '（未播出）'}`}
                                                >
                                                    {num}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                            <div className="summary-rating-row">
                                <div className="subject-info-summary">
                                    <div className="summary-title">简介</div>
                                    <div className="summary-content">{subject.summary}</div>
                                </div>
                                <div className="subject-info-rating">
                                    <div className="rating-left">
                                        <div className="rating-item">
                                            <span className="rating-label">排名：</span>
                                            <span className="rating-value">{subject.rating.rank}</span>
                                        </div>
                                        <div className="rating-item">
                                            <span className="rating-label">评分：</span>
                                            <span className="rating-value">{subject.rating.score}</span>
                                        </div>
                                        <div className="rating-item">
                                            <span className="rating-label">评分人数：</span>
                                            <span className="rating-value">{subject.rating.total}</span>
                                        </div>
                                    </div>
                                    {subject.rating.count && (
                                        <div className="rating-distribution">
                                            <div className="distribution-title">评分分布</div>
                                            <div className="distribution-chart">
                                                {Object.entries(subject.rating.count).map(([score, count]) => (
                                                    <div key={score} className="score-bar">
                                                        <div className="score-label">{score}</div>
                                                        <div className="bar-container">
                                                            <div 
                                                                className="bar-fill" 
                                                                style={{
                                                                    width: `${(count / Math.max(...Object.values(subject.rating.count))) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="score-count">{count}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Character />
                        </div>
                    </div>
                </>
            ) : (
                <div className="loading">Loading...</div>
            )}
        </div>
    );
}