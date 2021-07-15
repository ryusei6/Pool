import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './RelatedArtist.css';
import NoImages from '../imgs/no_image.png'

const RelatedArtist = (props) => {
    const [relatedArtist, setRelatedArtist] = useState([]);
    const getRelatedArtist = () => {
        axios(`https://api.spotify.com/v1/artists/${props.currentArtistId}/related-artists`, {
            params: {
                market: 'JP'
            },
            method: 'GET',
            headers: {Authorization: 'Bearer ' + props.token}
        }).then((relatedArtistReaponse) => {
            setRelatedArtist(relatedArtistReaponse.data.artists);
        }).catch((err) => {
            console.log('err:', err);
        });
    }

    useEffect(() => {
        if (props.currentArtistId !== '') {
            getRelatedArtist()
        }
    }, [props.currentArtistId]);

    useEffect(() => {
        if (props.currentArtistId !== '') {
            setRelatedArtist([])
        }
    }, [props.album]);

    const relatedArtistPreview = (id, name) => {
        props.trackView(id, name)
    }

    return (
        <div className='related-artists-wrapper'>
            {!!relatedArtist.length &&
                <div>
                    <div className='related-artists-heading'>
                        {props.currentArtistName} に関連したアーティスト
                    </div>
                    <div className='related-artists'>
                        {relatedArtist.map(({name, images, id}) => (
                            <div
                                className='related-artist-item'
                                onClick={() => relatedArtistPreview(id, name)}
                                key={id}
                            >
                                {}
                                {images[0]
                                    ? <img src={images[0].url} />
                                    : <img src={NoImages} />
                                }
                                <p>{name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default RelatedArtist;   