import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import './Modal.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullScreen';
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  showCloseButton = true,
  disableBackdropClick = false,
  className = '',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const classes = [
    'modal',
    `modal--${size}`,
    isMobile && 'modal--mobile',
    className
  ].filter(Boolean).join(' ');

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disableBackdropClick) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes}
      maxWidth={false}
      fullScreen={isMobile && size === 'fullScreen'}
      PaperProps={{
        className: 'modal__paper'
      }}
      BackdropProps={{
        className: 'modal__backdrop',
        onClick: handleBackdropClick
      }}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <DialogTitle className="modal__header">
          <div className="modal__title-container">
            {title && (
              <Typography variant="h6" className="modal__title">
                {title}
              </Typography>
            )}
            {showCloseButton && (
              <IconButton
                onClick={onClose}
                className="modal__close-button"
                size="small"
              >
                <CloseIcon />
              </IconButton>
            )}
          </div>
        </DialogTitle>
      )}
      
      {/* Content */}
      <DialogContent className="modal__content">
        {children}
      </DialogContent>
      
      {/* Actions */}
      {actions && (
        <DialogActions className="modal__actions">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
