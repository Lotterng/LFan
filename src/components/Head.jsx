import './Head.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Head(){
    const navigate = useNavigate()
    const [activeDropdown, setActiveDropdown] = useState(null)
    
    // 定义tag和对应的type值
    const tagData = [
        { name: "小说", type: "1" },
        { name: "动画", type: "2" },
        { name: "音乐", type: "3" },
        { name: "游戏", type: "4" },
        { name: "三次元", type: "6" }
    ]

    const handleLogoClick = () => {
        navigate('/')
    }

    const handleTagClick = (tagName) => {
        // 如果点击的是当前激活的下拉菜单，则关闭它
        if (activeDropdown === tagName) {
            setActiveDropdown(null)
        } else {
            // 否则打开新的下拉菜单
            setActiveDropdown(tagName)
        }
    }

    const handleRankClick = (type) => {
        navigate(`/rank?type=${type}`)
        setActiveDropdown(null) // 关闭下拉菜单
    }

    const handleClickOutside = () => {
        setActiveDropdown(null)
    }

    return(
        <div className="head" onClick={handleClickOutside}>
            <div className="head-left">
                <div className="logo" onClick={handleLogoClick}>
                    <span className="logo-text">LFan</span>
                </div>
                <div className="tag">
                    <ul>
                        {tagData.map((item, index) => (
                            <li key={index} className="tag-item">
                                <span 
                                    className="tag-text"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleTagClick(item.name)
                                    }}
                                >
                                    {item.name}
                                </span>
                                {activeDropdown === item.name && (
                                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                        <div 
                                            className="dropdown-item"
                                            onClick={() => handleRankClick(item.type)}
                                        >
                                            排行榜
                                        </div>
                                        {/* 后续可以在这里添加更多菜单项 */}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="head-right">
                <div className="search">
                    <input type="text" />
                </div>
                <div className="sign">
                    <button>
                        登陆
                    </button>
                    <button>
                        注册
                    </button>
                </div>
            </div>
        </div>
    )
}