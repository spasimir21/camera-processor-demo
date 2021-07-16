type VirtualBackground = {
  type: VIRTUAL_BACKGROUND_TYPE;
  data: any;
};

enum SEGMENTATION_BACKEND {
  BodyPix,
  MLKit
}

enum VIRTUAL_BACKGROUND_TYPE {
  None,
  Transparent,
  Color,
  Filter,
  Image
}

export { SEGMENTATION_BACKEND, VIRTUAL_BACKGROUND_TYPE, VirtualBackground };
