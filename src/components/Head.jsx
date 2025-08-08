import './Head.css'

export default function Head(){

    const tag = ["动画", "小说", "音乐", "游戏", "三次元"]

    return(
        <div className="head">
            <div className="head-left">
                <div className="tag">
                    <ul>
                        {tag.map((item, index) => (
                            <li key={index}>
                                {item}
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