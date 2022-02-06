import { Add } from '@mui/icons-material';
import { Box, Container, Paper } from '@mui/material';
import React from 'react';

type GraphicUploadFieldProps = {
  image: null | File;
  setImage: (file: File) => void;
};

//TO-DO: create type - horizontal for campaign creation, vertical for codex entries
//TO-DO: improve showing of uploaded graphic (should accept other formats)
//TO-DO: create wrapper on Paper with Add icon/Container with uploaded image
export const ImageUploadField: React.FC<GraphicUploadFieldProps> = props => {
  const handleChange = (files: null | FileList) => {
    if (files) {
      const file = files.item(0);
      if (file) props.setImage(file);
    }
  };

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  if (props.image) {
    const imageAsBase64 = toBase64(props.image);
    //const imageAsUrl = url(`data:image/png;${imageAsBase64}`);
    return (
      <Box sx={{ width: '100%' }}>
        <input
          accept="image/*"
          id="graphic-button-file"
          type="file"
          hidden
          onChange={e => {
            if (e) handleChange(e.target.files);
          }}
        />
        <label htmlFor="graphic-button-file">
          <Container
            sx={{
              width: '100%',
              minHeight: '20vh',
              backgroundImage: `url(data:image/png;${imageAsBase64})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </label>
      </Box>
    );
  }
  return (
    <Box sx={{ width: '100%' }}>
      <input
        accept="image/*"
        id="avatar-button-file"
        type="file"
        hidden
        onChange={e => {
          if (e) handleChange(e.target.files);
        }}
      />
      <label htmlFor="avatar-button-file">
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
      </label>
    </Box>
  );
};
