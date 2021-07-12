import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";
import Style from "./SimilarPage.css";

const SimilarPage = (props) => {
    const [similarTrack, setSimilarTrack] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios(`https://api.spotify.com/v1/recommendations?limit=10&market=US`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + props.token,
            },
	        params: {
                // seed_tracks: props.queryResult,
                // target_danceability: props.trackInformation.danceability,
                // target_energy: props.trackInformation.energy,
                // target_key: props.trackInformation.key,
                // target_loudness: props.trackInformation.loudness,
                // target_mode: props.trackInformation.mode,
                // min_popularity: 0,
                // target_tempo: props.trackInformation.tempo,
                // target_time_signature: props.trackInformation.signature,
                // target_valence: props.trackInformation.valence,
            },
        }).then((similarReaponse) => {
            setSimilarTrack(similarReaponse.data.tracks);
        }).catch((err) => {
            console.log("err:", err);
        });
    }, [props.token]);

  // クリックされたらIDを取得し、メインコンテンツを変更
    const contentsChange = (id) => {
        history.push(`/Search?query=${id}`);
    };

    return (
        <div>
            {similarTrack.map(({ id, artists, name, preview_url, album }) => (
                id
            ))}
            {/* <div className='recommend-contents'>
                {similarTrack.map(({ id, artists, name, preview_url, album }) => (
                    console.log(id, artists, name, preview_url, album)
                    // <div
                    //     className={Style.wrapper}
                    //     key={id}
                    //     onClick={() => contentsChange(id)}
                    // >
                    //     <img src={album.images[1].url} alt="アルバム画像" />
                    //     <div className={Style.textArea}>
                    //         <div className={Style.artistsName}>{artists[0].name}</div>
                    //         <div className={Style.trackName}>{name}</div>
                    //     </div>
                    //     <ReactAudioPlayer
                    //         className={Style.audio}
                    //         src={preview_url}
                    //         controls
                    //     />
                    // </div>
                ))}
            </div> */}
        </div>
    );
};

export default SimilarPage;