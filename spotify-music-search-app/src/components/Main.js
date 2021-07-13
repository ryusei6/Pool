import {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import ArtistView from './ArtistView';
import SimilarPage from './SimilarPage';
import './Main.css';


const Main = (props) => {
    const [artist, setState] = useState('');
    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            console.log(event.target.value);
            setState(event.target.value);
        }
    }

    const StyledTextField = withStyles({
        root: {
            background: 'white',
            borderRadius: 5,
            color: 'white',
            border: '100px',
            borderColor: 'red',
            width: 300,
            marginBottom: 50
        }
      })(TextField);
      

    return (
        <div>
            <div className='text-field'>
                <StyledTextField
                    label='Artist'
                    variant='filled'
                    onKeyPress={handleEnter} 
                    style={{
                        color: 'white'
                    }}
                />
            </div>
            <ArtistView artist={artist} token={props.token} />
            {/* <SimilarPage token={props.token} /> */}
        </div>
    )
};

export default Main;

