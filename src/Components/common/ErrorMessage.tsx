import React from 'react';
import { Alert, AlertTitle, IconButton, Slide } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ErrorMessageProps {
    message: string;
    onClose?: () => void;
    title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose, title = "Error" }) => {
    return (
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, '& .MuiAlert-message': { width: '100%'} }}
            action={
                onClose && (
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={onClose}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                )
              }
            >
              <AlertTitle>{title}</AlertTitle>
              {message}
            </Alert>
        </Slide>
    );
};

export default ErrorMessage;