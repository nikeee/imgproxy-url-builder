![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/BitPatty/imgproxy-url-builder/build.yml?label=Build&style=flat-square)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/BitPatty/imgproxy-url-builder?label=Coverage&style=flat-square)](https://coveralls.io/github/BitPatty/imgproxy-url-builder?branch=master)
![npm](https://img.shields.io/npm/dm/@bitpatty/imgproxy-url-builder?label=Downloads&style=flat-square)

# imgproxy-url-builder

A TypeScript helper library for building [imgproxy](https://github.com/imgproxy/imgproxy) URLs.

## Installation

```sh
npm i --save @bitpatty/imgproxy-url-builder
```

## Usage

You can simply import the param builder and chain your transformations.

For a list of available transformations visit the [API documentation page](https://zint.ch/imgproxy-url-builder/classes/ParamBuilder.html).

```typescript
import pb from '@bitpatty/imgproxy-url-builder';

// Just the transformer params
// Returns rot:90/bl:10
pb().rotate(90).blur(10).build();

// The transformer params with the target image
// Returns /-/rot:90/bl:10/czM6Ly9teWJ1Y2tldC9teWltYWdlLnBuZw
pb().rotate(90).blur(10).build({
  path: 's3://mybucket/myimage.png',
});

// You can disable path encoding by setting 'plain' to true
// Returns /-/rot:90/bl:10/plain/s3://mybucket/myimage.png
pb().rotate(90).blur(10).build({
  plain: true,
  path: 's3://mybucket/myimage.png',
});

// To sign your URL provide the key and salt
// The path is required to sign your URL!
// Returns /TXf2QXtZkU-ULvrg0pLDqJlWUb7XdHkXD0h6NFWD-mo/rot:90/bl:10/czM6Ly9teWJ1Y2tldC9teWltYWdlLnBuZw
pb()
  .rotate(90)
  .blur(10)
  .build({
    path: 's3://mybucket/myimage.png',
    signature: {
      key: 'a91bdcda48ce22cd7d8d3a0eda93',
      salt: 'a91bdcda48ce22cd7d8d3a0eda93',
      size: 32, // Optional, specify the signature size. Defaults to 32
    },
  });

// To automatically prepend the imgproxy URL
// provide it as the 'baseUrl' setting
// Returns https://my-imgproxy-instance.example.com/-/rot:90/bl:10/czM6Ly9teWJ1Y2tldC9teWltYWdlLnBuZw
pb().rotate(90).blur(10).build({
  path: 's3://mybucket/myimage.png',
  baseUrl: 'https://my-imgproxy-instance.example.com',
});

// You can clone the current configuration for templating / reuse
const template = pb().rotate(90);
const copy = template.clone();

// To remove a modifier, use the `unset` function
const t = pb().rotate(90).blur(10);
t.unset('rotate');

// ... Or you can replace the previous setting by calling the
// modifier again
const t = pb().rotate(90).blur(10); // rotate: 90, blur: 10
t.rotate(34); // rotate: 34, blur: 10
```

## Chaining Pipelines

Pipelines [can be chained](https://github.com/imgproxy/imgproxy/blob/41b9ebe9277ef3e664e0a842fbc0e912b2640969/docs/chained_pipelines.md) using the chain utility function:

```typescript
import pb, { chain } from '@bitpatty/imgproxy-url-builder';

// Returns bl:10/rot:90/-/bl:10/rot:270
chain([pb().blur(10).rotate(90), pb().blur(10).rotate(270)]);

// Returns /8q2Ey2URdWizZb8PgAUKMO6C2tD4aXOa2IbCMV9pTKA/bl:10/-/ar:true/dGVzdC5wbmc
chain({
  buildOptions: {
    path: 'test.png',
    signature: {
      key: '73757065722d7365637265742d6b6579', // super-secret-key
      salt: '73757065722d7365637265742d73616c74', // super-secret-salt
    },
  },
  builders: [pb().blur(10), pb().autoRotate()],
});
```

## License

Published under the [MIT License](https://github.com/BitPatty/imgproxy-url-builder/blob/master/LICENSE).

## Modifiers

- [adjust](#adjust-imgproxy-docs)
- [autoRotate](#autorotate-imgproxy-docs)
- [background](#background-imgproxy-docs)
- [backgroundAlpha](#backgroundalpha-imgproxy-docs)
- [blur](#blur-imgproxy-docs)
- [blurDetections](#blurdetections-imgproxy-docs)
- [brightness](#brightness-imgproxy-docs)
- [cacheBuster](#cachebuster-imgproxy-docs)
- [contrast](#contrast-imgproxy-docs)
- [crop](#crop-imgproxy-docs)
- [disableAnimation](#disableanimation-imgproxy-docs)
- [dpr](#dpr-imgproxy-docs)
- [drawDetections](#drawdetections-imgproxy-docs)
- [enforceThumbnail](#enforcethumbnail-imgproxy-docs)
- [enlarge](#enlarge-imgproxy-docs)
- [expires](#expires-imgproxy-docs)
- [extend](#extend-imgproxy-docs)
- [extendAspectRatio](#extendaspectratio-imgproxy-docs)
- [fallbackImageUrl](#fallbackimageurl-imgproxy-docs)
- [fileName](#filename-imgproxy-docs)
- [format](#format-imgproxy-docs)
- [formatQuality](#formatquality-imgproxy-docs)
- [gradient](#gradient-imgproxy-docs)
- [gravity](#gravity-imgproxy-docs)
- [jpegOptions](#jpegoptions-imgproxy-docs)
- [keepCopyright](#keepcopyright-imgproxy-docs)
- [maxBytes](#maxbytes-imgproxy-docs)
- [minHeight](#minheight-imgproxy-docs)
- [minWidth](#minwidth-imgproxy-docs)
- [pad](#pad-imgproxy-docs)
- [page](#page-imgproxy-docs)
- [pixelate](#pixelate-imgproxy-docs)
- [pngOptions](#pngoptions-imgproxy-docs)
- [preset](#preset-imgproxy-docs)
- [quality](#quality-imgproxy-docs)
- [raw](#raw-imgproxy-docs)
- [resize](#resize-imgproxy-docs)
- [resizingAlgorithm](#resizingalgorithm-imgproxy-docs)
- [returnAttachment](#returnattachment-imgproxy-docs)
- [rotate](#rotate-imgproxy-docs)
- [saturation](#saturation-imgproxy-docs)
- [sharpen](#sharpen-imgproxy-docs)
- [skipProcessing](#skipprocessing-imgproxy-docs)
- [stripColorProfile](#stripcolorprofile-imgproxy-docs)
- [stripMetadata](#stripmetadata-imgproxy-docs)
- [style](#style-imgproxy-docs)
- [trim](#trim-imgproxy-docs)
- [unsharpen](#unsharpen-imgproxy-docs)
- [videoThumbnailSecond](#videothumbnailsecond-imgproxy-docs)
- [watermark](#watermark-imgproxy-docs)
- [watermarkShadow](#watermarkshadow-imgproxy-docs)
- [watermarkSize](#watermarksize-imgproxy-docs)
- [watermarkText](#watermarktext-imgproxy-docs)
- [watermarkUrl](#watermarkurl-imgproxy-docs)
- [zoom](#zoom-imgproxy-docs)

### adjust ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#adjust-idadjust))

Defines the brightness, contrast, and saturation.

#### Example

```typescript
pb().adjust({
  brightness: 100,  // optional
  contrast: 0.8,    // optional
  saturation: 0.9   // optional
});
```

### autoRotate ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#auto-rotate))

Automatically rotates the image based on the EXIF orientation parameter.

#### Example

```typescript
pb().autoRotate();
```

### background ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#background))

Fills the image background with the specified color.

#### Example

```typescript
pb().background('ff0000');

pb().background({
  r: 255,
  g: 0,
  b: 0
});
```

### backgroundAlpha ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#background-alpha-idbackground-alpha))

Adds alpha channel to background.

#### Example

```typescript
pb().backgroundAlpha(0.4);
```

### blur ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#blur))

Applies a gaussian blur filter to the image.

#### Example

```typescript
pb().blur(10);
```

### blurDetections ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#blur-detections-idblur-detections))

Detects objects of the provided classes and blurs them.

#### Example

```typescript
pb().blurDetections({
  sigma: 10,
  classNames: ['face']
});
```

### brightness ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#brightness-idbrightness))

Adjusts the brightness of an image.

#### Example

```typescript
pb().brightness(-100);
```

### cacheBuster ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#cache-buster))

Adds a cache buster to the imgproxy params.

#### Example

```typescript
pb().cacheBuster("abcdef123");
```

### contrast ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#contrast-idcontrast))

Adjust contrast of the resulting image.

#### Example

```typescript
pb().contrast(0.3);
```

### crop ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#crop))

Crops the image.

#### Example

```typescript
pb().crop({
  width: 100,                  // optional
  height: 50,                  // optional
  gravity: {                   // optional
    type: GravityType.CENTER,  // required
    offset: {                  // optional
       x: 20,                  // required
       y: 20                   // required
    }
  }
})
```

### disableAnimation ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/cfa4b596d1f31656f9116cc16f2a4ff7d15c2837/docs/generating_the_url.md#disable-animation-iddisable-animation))

Use a single frame of animated images.

#### Example

```typescript
pb().disableAnimation();
```

### dpr ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#dpr))

Multiplies the dimensions according to the specified factor.

#### Example

```typescript
pb().dpr(18);
```

### drawDetections ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#draw-detections-iddraw-detections))

Detects objects of the provided classes and draws their bounding boxes.

#### Example

```typescript
pb().drawDetections({
  classNames: ["face"]
});
```

### enforceThumbnail ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#enforce-thumbnail))

If the source image has an embedded thumbnail, imgproxy will use the embedded thumbnail instead of the main image.

#### Example

```typescript
pb().enforceThumbnail();
```

### enlarge ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#enlarge))

Enlarges the image if it is smaller than the given size.

#### Example

```typescript
pb().enlarge();
```

### expires ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#expires))

Returns a 404 if the expiration date is reached.

#### Example

```typescript
pb().expires(new Date());

pb().expires(1661431326);
```

### extend ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#extend))

Extends the image if it is smaller than the given size.

#### Example

```typescript
pb().extend();

pb().extend({
  gravity: {
    type: GravityType.NORTH  // required
    offset: {                // optional
      x: 10;                 // required
      y: 20;                 // required
    }
  }
});
```

### extendAspectRatio ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/1a9768a2c682e88820064aa3d9a05ea234ff3cc4/docs/generating_the_url.md#extend-aspect-ratio))

Extends the image to the requested aspect ratio.

#### Example

```typescript
pb().extendAspectRatio();

pb().extendAspectRatio({
  gravity: {
    type: GravityType.NORTH  // required
    offset: {                // optional
      x: 10;                 // required
      y: 20;                 // required
    }
  }
});
```

### fallbackImageUrl ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#fallback-image-url-idfallback-image-url))

Sets a custom fallback image by specifying its URL.

#### Example

```typescript
pb().fallbackImageUrl('https://example.com');
```

### fileName ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/41b9ebe9277ef3e664e0a842fbc0e912b2640969/docs/generating_the_url.md#filename))

Sets the filename for the Content-Disposition header.

#### Example

```typescript
// Not encoded
pb().fileName('filename.png');

// Encoded
pb().fileName('ZmlsZW5hbWUucG5n', true);
```

### format ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#format))

Specifies the resulting image format.

#### Example

```typescript
pb().format('png');
```

### formatQuality ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#format-quality))

Sets the desired quality for each format.

#### Example

```typescript
pb().formatQuality({
  jpeg: 100,
  png: 50,
  // ...
});
```

### gradient ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/cfa4b596d1f31656f9116cc16f2a4ff7d15c2837/docs/generating_the_url.md#gradient-idgradient))

Places a gradient on the processed image.

#### Example

```typescript
pb().gradient({
  opacity: 1,       // required
  color: 'ababab',  // optional
  direction: 'up',  // optional
  start: 0.0,       // optional
  stop: 0.7         // optional
});
```

### gravity ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#gravity))

Sets the gravity.

#### Example

```typescript
pb().gravity({
  type: GravityType.NORTH  // required
  offset: {                // optional
    x: 10,                 // required
    y: 20                  // required
  }
});
```

### jpegOptions ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#jpeg-options-idjpeg-options))

Allows redefining JPEG saving options.

#### Example

```typescript
pb().jpegOptions({
  progressive: boolean,         // optional
  noSubsample: boolean,         // optional
  trellisQuant: boolean,        // optional
  overshootDeringing: boolean,  // optional
  optimizeScans: boolean,       // optional
  quantizationTable: 7          // optional
});
```

### keepCopyright ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#keep-copyright))

Preserve the copyright info while stripping metadata.

#### Example

```typescript
pb().keepCopyright();
```

### maxBytes ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#max-bytes))

Limits the file size to the specified number of bytes.

#### Example

```typescript
pb().maxBytes(10);
```

### minHeight ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#min-height))

Defines the minimum height of the resulting image.

#### Example

```typescript
pb().minHeight(100);
```

### minWidth ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#min-width))

Defines the minimum width of the resulting image.

#### Example

```typescript
pb().minWidth(100);
```

### pad ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#padding))

Applies the specified padding to the image.

#### Example

```typescript
pb().pad({
  top: 100,    // optional (Note: sets all other sides if not set explicitly)
  right: 100,  // optional
  bottom: 10,  // optional
  left: 10     // optional
});
```

### page ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#page-idpage))

When source image supports pagination (PDF, TIFF) or animation (GIF, WebP), this option allows specifying the page to use.

#### Example

```typescript
pb().page(10);
```

### pixelate ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#pixelate))

Apply the pixelate filter to the resulting image.

#### Example

```typescript
pb().pixelate(5);
```

### pngOptions ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#png-options-idpng-options))

Allows redefining PNG saving options.

#### Example

```typescript
pb().pngOptions({
  interlaced: true,         // optional
  quantize: false,          // optional
  quantization_colors: 10   // optional
});
```

### preset ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#preset))

Sets one or many presets to be used by the imgproxy.

#### Example

```typescript
pb().preset('mypreset');

pb().preset(['preset1', 'preset2']);
```

### quality ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#quality))

Redefines the quality of the resulting image.

#### Example

```typescript
pb().quality(80);
```

### raw ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/f95f57bb4df35c69ae2257958006ef54b1c1d8c7/docs/generating_the_url.md#raw))

Returns a raw unprocessed and unchecked source image

#### Example

```typescript
pb().raw();
```

### resize ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#resize))

Resizes the image.

#### Example

```typescript
pb().resize({
  type: ResizeType.AUTO,  // optional
  width: 100,             // optional
  height: 50              // optional
});
```

### resizingAlgorithm ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#resizing-algorithm-idresizing-algorithm))

Defines the algorithm that imgproxy will use for resizing.

#### Example

```typescript
pb().resizingAlgorithm(ResizingAlgorithm.NEAREST));
```

### returnAttachment ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#return-attachment))

Returns attachment in the Content-Disposition header.

#### Example

```typescript
pb().returnAttachment();
```

### rotate ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#rotate))

Rotates the image by the specified angle.

#### Example

```typescript
pb().rotate(90);
```

### saturation ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#saturation-idsaturation))

Adjust saturation of the resulting image.

#### Example

```typescript
pb().saturation(0.3);
```

### sharpen ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#sharpen))

Applies a sharpen filter to the image.

#### Example

```typescript
pb().sharpen(3);
```

### skipProcessing ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#skip-processing))

Skip the processing of the listed formats.

#### Example

```typescript
pb().skipProcessing(['png', 'svg']);
```

### stripColorProfile ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#strip-color-profile))

Strips the color profile from the image.

#### Example

```typescript
pb().stripColorProfile();
```

### stripMetadata ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#strip-metadata))

Strips the metadata from the image.

#### Example

```typescript
pb().stripMetadata();
```

### style ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#style-idstyle))

Prepend a `<style>` node with the provided CSS styles to the `<svg>` node of a source SVG image.

#### Example

```typescript
pb().style('fill:red;width:30px;');

pb().style({
  fill: 'red';
  width: '30px'
});
```

### trim ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#trim))

Trims the image background.

#### Example

```typescript
pb().trim({
  threshold: 10,       // required
  color: 'ffffff',     // optional
  equal: {             // optional
    horizontal: true,  // optional
    vertical: true     // optional
  }
});
```

### unsharpen ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#unsharpening-idunsharpening))

Allows redefining unsharpening options.

#### Example

```typescript
pb().unsharpen({
  mode: UnsharpeningMode.AUTO,   // optional
  weight: 11,                    // optional
  dividor: 24                    // optional
});
```

### videoThumbnailSecond ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#video-thumbnail-second-idvideo-thumbnail-second))

Redefines the second used for the thumbnail.

#### Example

```typescript
pb().videoThumbnailSecond(3);
```

### watermark ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#watermark))

Places a watermark on the processed image.

#### Example

```typescript
pb().watermark({
  opacity: 0.8,                          // required
  position: WatermarkPosition.REPLICATE  // optional
  scale: 2                               // optional
});

pb().watermark({
  opacity: 1.0,
  scale: 1,
  position: WatermarkPosition.WEST  // optional
  offset: {                         // optional
    x: 10,                          // optional
    y: 10                           // optional
  }
})
```

### watermarkShadow ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/f95f57bb4df35c69ae2257958006ef54b1c1d8c7/docs/generating_the_url.md#watermark-shadow-idwatermark-shadow))

Adds a shadow to the watermark.

#### Example

```typescript
pb().watermarkShadow(10);
```

### watermarkSize ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#watermark-size-idwatermark-size))

Defines the desired width and height of the watermark. imgproxy always uses `fit` resizing type when resizing watermarks and enlarges them when needed.

#### Example

```typescript
pb().watermarkSize({
  width: 30,  // required
  height: 30  // required
});
```

### watermarkText ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#watermark-text-idwatermark-text))

Generate an image from the provided text and use it as a watermark.

#### Example

```typescript
pb().watermarkText("my watermark");
```

### watermarkUrl ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#watermark-url-idwatermark-url))

Use the image from the specified URL as a watermark.

#### Example

```typescript
pb().watermarkUrl('https://example.com');
```

### zoom ([imgproxy docs](https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#zoom))

Multiply the image dimensions according to the specified factors.

#### Example

```typescript
pb().zoom(3);
```
