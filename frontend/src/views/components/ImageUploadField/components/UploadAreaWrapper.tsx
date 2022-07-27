import { Box } from '@mui/material';

type UploadAreaWrapperProps = {
  handleChange: (e: null | FileList) => void;
};

/**
 * Wrapper for HTML input tag used to upload images
 * @param props
 * @returns
 */
export const UploadAreaWrapper: React.FC<UploadAreaWrapperProps> = props => (
  <Box sx={{ width: '100%' }}>
    <input
      accept="image/*"
      id="image-button-file"
      type="file"
      hidden
      onChange={e => {
        if (e) props.handleChange(e.target.files);
      }}
    />
    <label htmlFor="image-button-file">{props.children}</label>
  </Box>
);
