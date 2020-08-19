import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        props.shuffleCells();
        setOpen(false);
    };

    React.useEffect(() => {
        if (props.state.cleared) {
            handleClickOpen();
            props.resetClearedState();
        }
    })

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">CLEAR!</DialogTitle>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    RESTART
                </Button>
            </DialogActions>
            </Dialog>
        </div>
    );
}
