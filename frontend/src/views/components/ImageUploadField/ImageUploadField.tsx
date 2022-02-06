import { Add } from '@mui/icons-material';
import { Paper } from '@mui/material';
import React from 'react';
import { UploadAreaWrapper } from './components/UploadAreaWrapper';

type GraphicUploadFieldProps = {
  image: null | File;
  setImage: (file: File) => void;
};

//TO-DO: create type - horizontal for campaign creation, vertical for codex entries
//TO-DO: image size in <img /> tag should fitted to dialog dimensions (and it isn't)
export const ImageUploadField: React.FC<GraphicUploadFieldProps> = props => {
  const handleChange = (files: null | FileList) => {
    if (files) {
      const file = files.item(0);
      if (file) props.setImage(file);
    }
  };

  if (props.image) {
    return (
      <UploadAreaWrapper handleChange={handleChange}>
        <img src={URL.createObjectURL(props.image)} />
      </UploadAreaWrapper>
    );
  }
  return (
    <UploadAreaWrapper handleChange={handleChange}>
      <Paper
        elevation={2}
        sx={{
          backgroundColor: 'customPalette.primary',
          width: '100%',
          minHeight: '20vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <Add fontSize="large" />
      </Paper>
    </UploadAreaWrapper>
  );
};
