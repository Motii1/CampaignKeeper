import { Add } from '@mui/icons-material';
import { Box, Paper } from '@mui/material';
import React from 'react';
import { convertImageToBase64 } from '../../../utils/utils';
import { UploadAreaWrapper } from './components/UploadAreaWrapper';

type GraphicUploadFieldProps = {
  height?: string | number;
  width?: string | number;
  image: null | string;
  setImage: (newImage: string) => void;
};

export const ImageUploadField: React.FC<GraphicUploadFieldProps> = props => {
  const handleChange = async (files: null | FileList) => {
    if (files) {
      const file = files.item(0);
      if (file) {
        const imageBase64 = await convertImageToBase64(file);
        props.setImage(imageBase64);
      }
    }
  };

  if (props.image) {
    return (
      <UploadAreaWrapper handleChange={handleChange}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'customPalette.background',
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
            src={`data:;charset=utf-8;base64,${props.image}`}
          />
        </Paper>
      </UploadAreaWrapper>
    );
  }
  return (
    <UploadAreaWrapper handleChange={handleChange}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'customPalette.background',
          height: props.height ?? '100%',
          width: props.width ?? '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: 2,
        }}
      >
        <Add fontSize="large" sx={{ color: 'customPalette.onBackground' }} />
      </Paper>
    </UploadAreaWrapper>
  );
};
