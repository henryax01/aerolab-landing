export const nets = {
  ssdMobilenetv1: { loadFromUri: () => Promise.resolve() },
  faceLandmark68Net: { loadFromUri: () => Promise.resolve() },
  faceRecognitionNet: { loadFromUri: () => Promise.resolve() },
  faceExpressionNet: { loadFromUri: () => Promise.resolve() },
  ageGenderNet: { loadFromUri: () => Promise.resolve() },
};
export const SsdMobilenetv1Options = class {};
export const TinyFaceDetectorOptions = class {};
export const matchDimensions = () => {};
export const resizeResults = (r) => r;
export const draw = {
  drawDetections: () => {},
  drawFaceLandmarks: () => {},
  drawFaceExpressions: () => {},
};
export const detectSingleFace = () => ({
  withFaceLandmarks: () => ({
    withFaceDescriptor: () => Promise.resolve(null),
  }),
});
export const detectAllFaces = () => ({
  withFaceLandmarks: () => ({
    withFaceExpressions: () => ({
      withAgeAndGender: () => Promise.resolve([]),
    }),
  }),
});
