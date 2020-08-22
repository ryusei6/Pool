import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

function Control(props) {
    return (
        <div className='control'>
            <div className='buttons'>
                <Button color="secondary" disableElevation onClick={()=>{props.showAns()}}>
                    Answer
                </Button>
                <Button color="primary" disableElevation onClick={()=>{props.shuffleCells()}}>
                    shuffle
                </Button>
                <PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                        <div className='button'>
                            <Button {...bindTrigger(popupState)}>
                                RULE
                            </Button>
                            <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                            <Box p={2}>
                                <Typography　variant="caption">アイコンを押すと上下左右のアイコンの色が反転します。<br/>全ての明かりを消してください。</Typography>
                            </Box>
                            </Popover>
                        </div>
                    )}
                </PopupState>
            </div>
        </div>
    );
}

export default Control;
