import { BASE_URL, calendar } from "../services/Bangumi/api"; 
import { useState, useEffect} from 'react'
import './Home.css'

export default function Home(){
    //每日放送信息
    const [calendarData, setCalendarData] = useState([]);
    //展示的具体星期
    const [weekAct, setWeekAct] = useState(() => new Date().getDay());
    //星期列表
    const week = [
        "日","一","二","三","四","五","六",
    ];
    
    useEffect(() => {
        // 使用fetch进行GET请求
        fetch(`${BASE_URL}${calendar}`)
            .then(res => res.json()) // 解析JSON响应
            .then(data => {
                console.log(data);
                setCalendarData(data);
            })
            .catch(err => console.error(err));
    }, []);

    // 切换星期
    const handleWeekChange = (index) => {
        setWeekAct(index);
    };

    return(
        <div>
            <h1>Home</h1>
            <h2>Calendar</h2>
            <div className="calendar-container">
                <div className="weekday-nav">
                    <ul>
                        {week.map((item, index) => (
                            <li 
                                key={index} 
                                className={index === weekAct ? 'active' : ''}
                                onClick={() => handleWeekChange(index)}
                            >
                                星期{item}
                            </li>
                        ))}
                    </ul>
                </div>
                <ul>
                    {calendarData?.[weekAct]?.items?.map((item, index) => (
                        <li key={index}>
                            <div className="image-container">
                                <img src={item?.images?.common} alt={item?.name_cn || item?.name}/>
                            </div>
                            <div className="anime-info">
                                <div className="anime-name">
                                    {item?.name_cn !== "" ? item?.name_cn : item?.name}
                                </div>
                                {item?.rating?.score && (
                                    <div className="anime-score">
                                        ⭐ {item?.rating?.score}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}