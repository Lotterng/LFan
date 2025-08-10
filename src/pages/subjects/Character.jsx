import { BASE_URL, characters } from "../../services/Bangumi/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Character.css";

export default function Character(){
    const [characterList, setCharacterList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        fetch(`${BASE_URL}${characters.replace('{subject_id}', id)}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setCharacterList(data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="character-loading">加载角色信息中...</div>;
    }

    if (!characterList || characterList.length === 0) {
        return <div className="no-characters">暂无角色信息</div>;
    }

    return(
        <div className="character-section">
            <h2 className="character-title">角色列表</h2>
            <div className="character-grid">
                {characterList
                    .filter(character => character.images && character.images.medium)
                    .map((character) => (
                    <div key={character.id} className="character-card">
                        {/* 顶部大块：角色头像 */}
                        <div className="character-avatar">
                            <img 
                                src={character.images.medium} 
                                alt={character.name}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="character-avatar-placeholder" style={{ display: 'none' }}>
                                {character.name.charAt(0)}
                            </div>
                        </div>
                        
                        {/* 中间块：relation: name */}
                        <div className="character-relation-block">
                            <span className="relation-label">{character.relation || "角色"}</span>
                            <span className="relation-separator">: </span>
                            <span className="relation-name">{character.name}</span>
                        </div>
                        
                        {/* 底部两个小块：img 和 name */}
                        <div className="character-bottom-row">
                            <div className="character-img-block">
                                {character.actors && character.actors.length > 0 && character.actors[0].images ? (
                                    <img 
                                        src={character.actors[0].images.small} 
                                        alt={character.actors[0].name}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <span>无</span>
                                )}
                            </div>
                            <div className="character-name-block">
                                <span>{character.actors && character.actors.length > 0 ? character.actors[0].name : '无'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}