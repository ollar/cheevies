export default function imageResize(image) {
  const promise = new Promise((yea, nah) => {
    var img = new Image();
    var imageUrl = URL.createObjectURL(image);

    const IMG_MAX_WIDTH = 300;
    const IMG_MAX_HEIGHT = 500;

    if (image.type.indexOf('image') < 0) {
      return nah();
    }

    img.onload = function () {
      if (img.width > IMG_MAX_WIDTH || img.height > IMG_MAX_HEIGHT) {
        let image_width = 0, image_height = 0;

        var oc = document.createElement('canvas'),
            octx = oc.getContext('2d');

        if (img.width >= img.height) {
          const imgRatioW = img.width / IMG_MAX_WIDTH;
          image_width = IMG_MAX_WIDTH;
          image_height = img.height / imgRatioW;
        } else if (img.height > img.width) {
          const imgRatioH = img.height / IMG_MAX_HEIGHT;
          image_width = img.width / imgRatioH;
          image_height = IMG_MAX_HEIGHT;
        }

        oc.width = image_width;
        oc.height = image_height;

        octx.drawImage(img, 0, 0, oc.width, oc.height);

        return oc.toBlob((blob) => {
          Object.defineProperties(blob, {
            type: {
              value: image.type,
              writable: true,
            },
            name: {
              writable: true,
              value: image.name,
            },
            lastModified: {
              writable: true,
              value: image.lastModified,
            },
            lastModifiedDate: {
              writable: true,
              value: image.lastModifiedDate,
            },
          });

          return yea(blob);
        }, {
          type: image.type,
        });
      }

      return yea(image);
    }

    img.src = imageUrl;
  });

  return promise;
}
