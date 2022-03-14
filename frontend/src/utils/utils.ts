import { useEffect, useState } from 'react';

type windowDimensions = {
  width: number;
  height: number;
};

export const getWindowDimensions = (): windowDimensions => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const useWindowDimensions = (): windowDimensions => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export const getCenteredPadding = (width: number = getWindowDimensions().width): number =>
  Math.max((width - 1368.1) / 2, width < 450 ? 6 : 51);

export const handleWheelEvent = (e: React.WheelEvent): void => {
  if (e.deltaY !== 0) {
    e.currentTarget.scrollTo({
      top: 0,
      left: e.currentTarget.scrollLeft + e.deltaY,
    });
  }
};

// TO-DO: find out type of this function
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

// takes file, converts it to base64 and removes first part with file type
export const convertImageToBase64 = async (file: File): Promise<string> => {
  const imageAsBase64 = (await toBase64(file)) as string;
  return imageAsBase64.split(',')[1];
};
