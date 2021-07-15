import React, {useState, useEffect} from 'react';
import ReactAudioPlayer from "react-audio-player";
import TrackList from './TrackList';

import axios from 'axios';
import './TrackView.css';


const TrackView = (props) => {
    const [albumTrack, setAlbumTrack] = useState([]);
    const [albumImg, setAlbumImg] = useState('')
    const [trackName, setTrackName] = useState('')
    const [artistNames, setArtistNames] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')
    const [albumName, setAlbumName] = useState('')

    const trackChange = (artists, name, preview_url) => {
        setArtistNames(artists.map(artist => artist.name).join(', '))
        setTrackName(name)
        setPreviewUrl(preview_url)
    };

    useEffect(() => {
        setAlbumTrack([])
        setAlbumImg('')
        setArtistNames('')
        setTrackName('')
        setPreviewUrl('')
    }, [props.album])

    const albumTrackPreview = (id, name) => {
        axios(`https://api.spotify.com/v1/albums/${id}`, {
            method: 'GET',
            headers: {Authorization: 'Bearer ' + props.token}
        }).then((albumReaponse) => {
            setAlbumImg(albumReaponse.data.images[1].url);
        }).catch((err) => {
            console.log('err:', err);
        });
        axios(`https://api.spotify.com/v1/albums/${id}/tracks`, {
            params: {
                market: 'JP',
                limit: 40
            },
            method: 'GET',
            headers: {Authorization: 'Bearer ' + props.token},
        }).then((tracksReaponse) => {
            setArtistNames('')
            setTrackName('')
            setPreviewUrl('')
            setAlbumName(name)
            setAlbumTrack(tracksReaponse.data.items);
        }).catch((err) => {
            console.log('err:', err);
        });
    };

    return (
        <div className='album-wrapper'>
            {albumImg &&
                <div className='track-preview'>
                    <img src={albumImg}></img>
                    <div className='track-text-area'>
                        <div className='album-name'>
                            {albumName}
                        </div>
                        {artistNames
                            && <div className='track-name'>{trackName} / {artistNames}</div>
                        }
                        <div className='preview-url'>
                            {previewUrl ? <ReactAudioPlayer src={previewUrl} controls loop={false} /> : ''}
                        </div>
                    </div>
                </div>
            }
            {albumTrack.length
                ? <TrackList className='track-list' albumTrack={albumTrack} trackChange={trackChange}/>
                : ''
            }
            {!!props.album.length &&
                <div className='album-list'>
                        <div className='album-heading'>
                            {props.currentArtistName} のアルバム
                        </div>
                        <div className='album'>
                            {props.album.map(({images, name, id}) => (
                                <div
                                    className='album-item'
                                    onClick={() => albumTrackPreview(id, name)}
                                    key={id}
                                >
                                <img src={images[1].url} />
                                <p>{name}</p>
                                </div>
                            ))}
                        </div>
                </div>
            }
        </div>
    );
};

export default TrackView;
