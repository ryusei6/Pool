import {useState, useEffect} from 'react';
import axios from 'axios';
import TrackView from './TrackView';
import RelatedArtist from './RelatedArtist';


const ArtistView = (props) => {
    const [artistInformation, setArtistInformation] = useState([]);
    const [album, setAlbum] = useState([]);
    const [currentArtistId, setCurrentArtistId] = useState('');
    const [currentArtistName, setCurrentArtistName] = useState('');

    const getArtist = () => {
        setArtistInformation([]);
        setAlbum([]);
        axios(`https://api.spotify.com/v1/search`,{
            params: {
                q: props.searchedArtist,
                type: 'artist',
                limit: 20
            },
            method: 'GET',
            headers: {Authorization: 'Bearer ' + props.token},
        }).then((artistContentsReaponse) => {
            props.setSearchArtist('');
            setArtistInformation(artistContentsReaponse.data.artists.items);
        }).catch((err) => {
            console.log('err:', err);
            localStorage.removeItem('access_token')
            console.log('access_tokenを削除しました。');
            window.location.reload()
        });
    };

    useEffect(() => {
        if (props.searchedArtist !== '') {
            getArtist();
        }
    },　[props.searchedArtist]);

    const trackView = (id, name) => {
        setCurrentArtistName(name)
        axios(`https://api.spotify.com/v1/artists/${id}/albums`,{
            params: {
                market: 'JP',
                limit: 4*4
            },
            method: 'GET',
            headers: {Authorization: 'Bearer ' + props.token},
        }).then((tracksReaponse) => {
            setCurrentArtistId(id);
            setAlbum(tracksReaponse.data.items);
        }).catch((err) => {
            console.log('err:', err);
        });
        setArtistInformation([]);
    };

    return (
        <div>
            {artistInformation.map(({id, name}) => (
                <div key={id}>
                    <p onClick={() => trackView(id, name)}>{name}</p>
                </div>
            ))}
            
            <TrackView currentArtistName={currentArtistName} album={album} token={props.token} />
            <RelatedArtist
                currentArtistName={currentArtistName}
                setCurrentArtistName={setCurrentArtistName}
                setSearchArtist={props.setSearchArtist}
                currentArtistId={currentArtistId}
                token={props.token}
                album={album}
                trackView={trackView}
            />
        </div>
    )
};

export default ArtistView;

