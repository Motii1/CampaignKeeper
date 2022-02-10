import { Add } from '@mui/icons-material';
import { Box, Paper } from '@mui/material';
import React from 'react';
import { UploadAreaWrapper } from './components/UploadAreaWrapper';

type GraphicUploadFieldProps = {
  height?: string | number;
  width?: string | number;
  image: null | File;
  setImage: (file: File) => void;
};

export const ImageUploadField: React.FC<GraphicUploadFieldProps> = props => {
  const handleChange = (files: null | FileList) => {
    if (files) {
      // eslint-disable-next-line no-console
      console.log('File!');
      const file = files.item(0);
      if (file) props.setImage(file);
    }
  };

  if (props.image) {
    return (
      <UploadAreaWrapper handleChange={handleChange}>
        <Paper
          elevation={2}
          sx={{
            backgroundColor: 'customPalette.primary',
            height: props.height ?? '100%',
            width: props.width ?? '100%',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          <Box
            component="img"
            sx={{
              cursor: 'pointer',
              height: props.height ?? '100%',
              width: props.width ?? '100%',
              objectFit: 'cover',
              borderRadius: 2,
            }}
            alt="Image"
            src={URL.createObjectURL(props.image)}
          />
        </Paper>
      </UploadAreaWrapper>
    );
  }
  return (
    <UploadAreaWrapper handleChange={handleChange}>
      <Paper
        elevation={2}
        sx={{
          backgroundColor: 'customPalette.primary',
          height: props.height ?? '100%',
          width: props.width ?? '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: 2,
        }}
      >
        <Add fontSize="large" />
      </Paper>
    </UploadAreaWrapper>
  );
};
