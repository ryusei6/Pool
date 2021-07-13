import {useState, useEffect} from 'react';
import axios from 'axios';
import TrackView from './TrackView';
import {BrowserRouter as Router, Route} from 'react-router-dom';


const ArtistView = (props) => {
    
    const [artistInformation, setArtistInformation] = useState([]);
    const [album, setAlbum] = useState([]);
    const getArtist = () => {
        setArtistInformation([]);
        setAlbum([]);
        axios(`https://api.spotify.com/v1/search?q=${props.artist}&type=artist&limit=20`,{
            method: 'GET',
            headers: {Authorization: 'Bearer ' + props.token},
        }).then((artistContentsReaponse) => {
            setArtistInformation(artistContentsReaponse.data.artists.items);
        }).catch((err) => {
            console.log('err:', err);
            localStorage.removeItem('access_token')
            console.log('access_tokenを削除しました。');
        });
    };

    useEffect(() => {
        console.log(props);
        if (props.artist === '') {
            console.log('no-data');
        } else {
            getArtist();
        }
    },　[props.artist]);


    const trackView = (id) => {
        axios(`https://api.spotify.com/v1/artists/${id}/albums?market=ES&limit=10`,{
            method: 'GET',
            headers: {Authorization: 'Bearer ' + props.token},
        }).then((tracksReaponse) => {
            console.log(tracksReaponse.data.items);
            setAlbum(tracksReaponse.data.items);
        }).catch((err) => {
            console.log('err:', err);
        });
        setArtistInformation([]);
    };

    return (
        <div>
            {artistInformation.map(({name, id}) => (
                <div key={id}>
                    <p onClick={() => trackView(id)}>{name}</p>
                </div>
            ))}
            <TrackView album={album} token={props.token} />
        </div>
    )
};

export default ArtistView;

