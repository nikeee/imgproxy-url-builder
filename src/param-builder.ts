import adjust from './transformers/adjust.js';
import autoRotate from './transformers/auto-rotate.js';
import background from './transformers/background.js';
import backgroundAlpha from './transformers/background-alpha.js';
import blur from './transformers/blur.js';
import blurDetections from './transformers/blur-detections.js';
import brightness from './transformers/brightness.js';
import cacheBuster from './transformers/cache-buster.js';
import contrast from './transformers/contrast.js';
import crop from './transformers/crop.js';
import disableAnimation from './transformers/disable-animation.js';
import dpr from './transformers/dpr.js';
import drawDetections from './transformers/draw-detections.js';
import enforceThumbnail from './transformers/enforce-thumbnail.js';
import enlarge from './transformers/enlarge.js';
import expires from './transformers/expires.js';
import extend from './transformers/extend.js';
import extendAspectRatio from './transformers/extend-aspect-ratio.js';
import fallbackImageUrl from './transformers/fallback-image-url.js';
import fileName from './transformers/filename.js';
import format from './transformers/format.js';
import formatQuality from './transformers/format-quality.js';
import gifOptions from './transformers/gif-options.js';
import gradient from './transformers/gradient.js';
import gravity from './transformers/gravity.js';
import jpegOptions from './transformers/jpeg-options.js';
import keepCopyright from './transformers/keep-copypright.js';
import maxBytes from './transformers/max-bytes.js';
import minHeight from './transformers/min-height.js';
import minWidth from './transformers/min-width.js';
import pad from './transformers/pad.js';
import page from './transformers/page.js';
import pixelate from './transformers/pixelate.js';
import pngOptions from './transformers/png-options.js';
import preset from './transformers/preset.js';
import quality from './transformers/quality.js';
import raw from './transformers/raw.js';
import resize from './transformers/resize.js';
import resizingAlgorithm from './transformers/resizing-algorithm.js';
import returnAttachment from './transformers/return-attachment.js';
import rotate from './transformers/rotate.js';
import saturation from './transformers/saturation.js';
import sharpen from './transformers/sharpen.js';
import skipProcessing from './transformers/skip-processing.js';
import stripColorProfile from './transformers/strip-color-profile.js';
import stripMetadata from './transformers/strip-metadata.js';
import style from './transformers/style.js';
import trim from './transformers/trim.js';
import unsharpen from './transformers/unsharpen.js';
import videoThumbnailSecond from './transformers/video-thumbnail-second.js';
import watermark from './transformers/watermark.js';
import watermarkShadow from './transformers/watermark-shadow.js';
import watermarkSize from './transformers/watermark-size.js';
import watermarkText from './transformers/watermark-text.js';
import watermarkUrl from './transformers/watermark-url.js';
import zoom from './transformers/zoom.js';

import { encodeFilePath, generateSignature } from './common.js';

/**
 * The build options
 */
export type BuildOptions = {
  /**
   * The path to the target image, e.g. `https://example.com/foo.png`
   */
  path: string;

  /**
   * The base URL of the imgproxy instance, e.g. https://my-imgproxy.test
   */
  baseUrl?: string;

  /**
   * Whether to append the path in plain.
   *
   * Defaults to false. If true, encodes the path to a  base64url
   */
  plain?: boolean;

  /**
   * The signature to apply
   */
  signature?: {
    /**
     * The hex-encoded key of the signature
     */
    key: string;

    /**
     * The hex encoded salt of the signature
     */
    salt: string;

    /**
     * The number of bytes to use for the signature before encoding to Base64
     *
     * Defaults to 32
     */
    size?: number;
  };
};

class ParamBuilder {
  /**
   * The currently applied imgproxy modifiers
   */
  public readonly modifiers: Map<keyof ParamBuilder, string>;

  public constructor(
    initialModifiers: Map<keyof ParamBuilder, string> = new Map(),
  ) {
    this.modifiers = initialModifiers;
  }

  /**
   * Creates a new param builder instance with a copy of the
   * current modifiers
   *
   * @returns A copy of this param builder
   */
  public clone(this: this): ParamBuilder {
    return new ParamBuilder(new Map(this.modifiers));
  }

  /**
   * Removes the specified modifier from the currently applied
   * modifiers
   *
   * @param modifier  The modifier
   */
  public unset(
    this: this,
    modifier: Omit<
      keyof ParamBuilder,
      'build' | 'unset' | 'clone' | 'modifiers'
    >,
  ): this {
    this.modifiers.delete(modifier as keyof ParamBuilder);
    return this;
  }

  /**
   * Builds the imgproxy URL
   *
   * If a path is supplied, the full URL path will be returned,
   * else only the stringified modifiers will be returned.
   *
   * If a base URL is supplied, the full imgproxy URL will be returned.
   *
   * @param options  The build options
   * @returns        The imgproxy URL
   */
  public build(options?: BuildOptions): string {
    const { baseUrl, path, plain, signature } = options ?? {};
    const mods = Array.from(this.modifiers.values());
    if (!path) return mods.join('/');

    if (path && plain) mods.push('plain', path);
    else mods.push(encodeFilePath(path));

    const res = mods.join('/');

    // If no signature is calculated add a - as placeholder
    // See https://github.com/imgproxy/imgproxy/blob/b243a08254b9ca7da2c628429cd870c111ece5c9/docs/signing_the_url.md
    const finalPath = signature
      ? `${generateSignature(
          res,
          signature.key,
          signature.salt,
          signature.size ?? 32,
        )}/${res}`
      : `-/${res}`;

    return baseUrl ? `${baseUrl}/${finalPath}` : `/${finalPath}`;
  }

  /**
   * Defines the brightness, contrast, and saturation.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#adjust-idadjust for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().adjust({
   *   brightness: 100,  // optional
   *   contrast: 0.8,    // optional
   *   saturation: 0.9   // optional
   * });
   * ```
   */
  public adjust(this: this, ...options: Parameters<typeof adjust>): this {
    this.modifiers.set('adjust', adjust(...options));
    return this;
  }

  /**
   * Automatically rotates the image based on the EXIF orientation parameter.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#auto-rotate for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().autoRotate();
   * ```
   */
  public autoRotate(this: this): this {
    this.modifiers.set('autoRotate', autoRotate());
    return this;
  }

  /**
   * Fills the image background with the specified color.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#background for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().background('ff0000');
   *
   * pb().background({
   *   r: 255,
   *   g: 0,
   *   b: 0
   * });
   * ```
   */
  public background(
    this: this,
    ...options: Parameters<typeof background>
  ): this {
    this.modifiers.set('background', background(...options));
    return this;
  }

  /**
   * Adds alpha channel to background.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#background-alpha-idbackground-alpha for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().backgroundAlpha(0.4);
   * ```
   */
  public backgroundAlpha(
    this: this,
    ...options: Parameters<typeof backgroundAlpha>
  ): this {
    this.modifiers.set('backgroundAlpha', backgroundAlpha(...options));
    return this;
  }

  /**
   * Applies a gaussian blur filter to the image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#blur for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().blur(10);
   * ```
   */
  public blur(this: this, ...options: Parameters<typeof blur>): this {
    this.modifiers.set('blur', blur(...options));
    return this;
  }

  /**
   * Detects objects of the provided classes and blurs them.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#blur-detections-idblur-detections for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().blurDetections({
   *   sigma: 10,
   *   classNames: ['face']
   * });
   * ```
   */
  public blurDetections(
    this: this,
    ...options: Parameters<typeof blurDetections>
  ): this {
    this.modifiers.set('blurDetections', blurDetections(...options));
    return this;
  }

  /**
   * Adjusts the brightness of an image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#brightness-idbrightness for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().brightness(-100);
   * ```
   */
  public brightness(
    this: this,
    ...options: Parameters<typeof brightness>
  ): this {
    this.modifiers.set('brightness', brightness(...options));
    return this;
  }

  /**
   * Adds a cache buster to the imgproxy params.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#cache-buster for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().cacheBuster("abcdef123");
   * ```
   */
  public cacheBuster(
    this: this,
    ...options: Parameters<typeof cacheBuster>
  ): this {
    this.modifiers.set('cacheBuster', cacheBuster(...options));
    return this;
  }

  /**
   * Adjust contrast of the resulting image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#contrast-idcontrast for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().contrast(0.3);
   * ```
   */
  public contrast(this: this, ...options: Parameters<typeof contrast>): this {
    this.modifiers.set('contrast', contrast(...options));
    return this;
  }

  /**
   * Crops the image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#crop for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().crop({
   *   width: 100,                  // optional
   *   height: 50,                  // optional
   *   gravity: {                   // optional
   *     type: GravityType.CENTER,  // required
   *     offset: {                  // optional
   *        x: 20,                  // required
   *        y: 20                   // required
   *     }
   *   }
   * })
   * ```
   */
  public crop(this: this, ...options: Parameters<typeof crop>): this {
    this.modifiers.set('crop', crop(...options));
    return this;
  }

  /**
   * Use a single frame of animated images.
   *
   * See https://github.com/imgproxy/imgproxy/blob/cfa4b596d1f31656f9116cc16f2a4ff7d15c2837/docs/generating_the_url.md#disable-animation-iddisable-animation for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().disableAnimation();
   * ```
   */
  public disableAnimation(
    this: this,
    ...options: Parameters<typeof disableAnimation>
  ): this {
    this.modifiers.set('disableAnimation', disableAnimation(...options));
    return this;
  }

  /**
   * Multiplies the dimensions according to the specified factor.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#dpr for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().dpr(18);
   * ```
   */
  public dpr(this: this, ...options: Parameters<typeof dpr>): this {
    this.modifiers.set('dpr', dpr(...options));
    return this;
  }

  /**
   * Detects objects of the provided classes and draws their
   * bounding boxes.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#draw-detections-iddraw-detections for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().drawDetections({
   *   classNames: ["face"]
   * });
   * ```
   */
  public drawDetections(
    this: this,
    ...options: Parameters<typeof drawDetections>
  ): this {
    this.modifiers.set('drawDetections', drawDetections(...options));
    return this;
  }

  /**
   * If the source image has an embedded thumbnail, imgproxy will use the
   * embedded thumbnail instead of the main image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#enforce-thumbnail for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().enforceThumbnail();
   * ```
   */
  public enforceThumbnail(this: this): this {
    this.modifiers.set('enforceThumbnail', enforceThumbnail());
    return this;
  }

  /**
   * Enlarges the image if it is smaller than the given size.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#enlarge for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().enlarge();
   * ```
   */
  public enlarge(this: this): this {
    this.modifiers.set('enlarge', enlarge());
    return this;
  }

  /**
   * Returns a 404 if the expiration date is reached.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#expires for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().expires(new Date());
   *
   * pb().expires(1661431326);
   * ```
   */
  public expires(this: this, ...options: Parameters<typeof expires>): this {
    this.modifiers.set('expires', expires(...options));
    return this;
  }

  /**
   * Extends the image if it is smaller than the given size.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#extend for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().extend();
   *
   * pb().extend({
   *   gravity: {
   *     type: GravityType.NORTH  // required
   *     offset: {                // optional
   *       x: 10;                 // required
   *       y: 20;                 // required
   *     }
   *   }
   * });
   * ```
   */
  public extend(this: this, ...options: Parameters<typeof extend>): this {
    this.modifiers.set('extend', extend(...options));
    return this;
  }

  /**
   * Extends the image to the requested aspect ratio.
   *
   * See https://github.com/imgproxy/imgproxy/blob/1a9768a2c682e88820064aa3d9a05ea234ff3cc4/docs/generating_the_url.md#extend-aspect-ratio for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().extendAspectRatio();
   *
   * pb().extendAspectRatio({
   *   gravity: {
   *     type: GravityType.NORTH  // required
   *     offset: {                // optional
   *       x: 10;                 // required
   *       y: 20;                 // required
   *     }
   *   }
   * });
   * ```
   */
  public extendAspectRatio(
    this: this,
    ...options: Parameters<typeof extendAspectRatio>
  ): this {
    this.modifiers.set('extendAspectRatio', extendAspectRatio(...options));
    return this;
  }

  /**
   * Sets a custom fallback image by specifying its URL.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#fallback-image-url-idfallback-image-url for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().fallbackImageUrl('https://example.com');
   * ```
   */
  public fallbackImageUrl(
    this: this,
    ...options: Parameters<typeof fallbackImageUrl>
  ): this {
    this.modifiers.set('fallbackImageUrl', fallbackImageUrl(...options));
    return this;
  }

  /**
   * Sets the filename for the Content-Disposition header.
   *
   * See https://github.com/imgproxy/imgproxy/blob/41b9ebe9277ef3e664e0a842fbc0e912b2640969/docs/generating_the_url.md#filename for the imgproxy documentation
   *
   * @example
   * ```typescript
   * // Not encoded
   * pb().fileName('filename.png');
   *
   * // Encoded
   * pb().fileName('ZmlsZW5hbWUucG5n', true);
   * ```
   */
  public fileName(this: this, ...options: Parameters<typeof fileName>): this {
    this.modifiers.set('fileName', fileName(...options));
    return this;
  }

  /**
   * Specifies the resulting image format.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#format for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().format('png');
   * ```
   */
  public format(this: this, ...options: Parameters<typeof format>): this {
    this.modifiers.set('format', format(...options));
    return this;
  }

  /**
   * Sets the desired quality for each format.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#format-quality for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().formatQuality({
   *   jpeg: 100,
   *   png: 50,
   *   // ...
   * });
   * ```
   */
  public formatQuality(
    this: this,
    ...options: Parameters<typeof formatQuality>
  ): this {
    this.modifiers.set('formatQuality', formatQuality(...options));
    return this;
  }

  /**
   * Allows redefining GIF saving options.
   *
   * @deprecated     Automatically applied since version 3.0.0
   * @example
   * ```typescript
   * pb().gifOptions({
   *   optimizeFrames: true,     // optional
   *   optimizeTransparency: 50  // optional
   * });
   * ```
   */
  public gifOptions(
    this: this,
    ...options: Parameters<typeof gifOptions>
  ): this {
    this.modifiers.set('gifOptions', gifOptions(...options));
    return this;
  }

  /**
   * Places a gradient on the processed image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/cfa4b596d1f31656f9116cc16f2a4ff7d15c2837/docs/generating_the_url.md#gradient-idgradient for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().gradient({
   *   opacity: 1,       // required
   *   color: 'ababab',  // optional
   *   direction: 'up',  // optional
   *   start: 0.0,       // optional
   *   stop: 0.7         // optional
   * });
   * ```
   */
  public gradient(this: this, ...options: Parameters<typeof gradient>): this {
    this.modifiers.set('gradient', gradient(...options));
    return this;
  }

  /**
   * Sets the gravity.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#gravity for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().gravity({
   *   type: GravityType.NORTH  // required
   *   offset: {                // optional
   *     x: 10,                 // required
   *     y: 20                  // required
   *   }
   * });
   * ```
   */
  public gravity(this: this, ...options: Parameters<typeof gravity>): this {
    this.modifiers.set('gravity', gravity(...options));
    return this;
  }

  /**
   * Allows redefining JPEG saving options.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#jpeg-options-idjpeg-options for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().jpegOptions({
   *   progressive: boolean,         // optional
   *   noSubsample: boolean,         // optional
   *   trellisQuant: boolean,        // optional
   *   overshootDeringing: boolean,  // optional
   *   optimizeScans: boolean,       // optional
   *   quantizationTable: 7          // optional
   * });
   * ```
   */
  public jpegOptions(
    this: this,
    ...options: Parameters<typeof jpegOptions>
  ): this {
    this.modifiers.set('jpegOptions', jpegOptions(...options));
    return this;
  }

  /**
   * Preserve the copyright info while stripping metadata.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#keep-copyright for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().keepCopyright();
   * ```
   */
  public keepCopyright(this: this): this {
    this.modifiers.set('keepCopyright', keepCopyright());
    return this;
  }

  /**
   * Limits the file size to the specified number of bytes.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#max-bytes for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().maxBytes(10);
   * ```
   */
  public maxBytes(this: this, ...options: Parameters<typeof maxBytes>): this {
    this.modifiers.set('maxBytes', maxBytes(...options));
    return this;
  }

  /**
   * Defines the minimum height of the resulting image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#min-height for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().minHeight(100);
   * ```
   */
  public minHeight(this: this, ...options: Parameters<typeof minHeight>): this {
    this.modifiers.set('minHeight', minHeight(...options));
    return this;
  }

  /**
   * Defines the minimum width of the resulting image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#min-width for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().minWidth(100);
   * ```
   */
  public minWidth(this: this, ...options: Parameters<typeof minWidth>): this {
    this.modifiers.set('minWidth', minWidth(...options));
    return this;
  }

  /**
   * Applies the specified padding to the image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#padding for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().pad({
   *   top: 100,    // optional (Note: sets all other sides if not set explicitly)
   *   right: 100,  // optional
   *   bottom: 10,  // optional
   *   left: 10     // optional
   * });
   * ```
   */
  public pad(this: this, ...options: Parameters<typeof pad>): this {
    this.modifiers.set('pad', pad(...options));
    return this;
  }

  /**
   * When source image supports pagination (PDF, TIFF) or animation (GIF, WebP), this option allows
   * specifying the page to use.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#page-idpage for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().page(10);
   * ```
   */
  public page(this: this, ...options: Parameters<typeof page>): this {
    this.modifiers.set('page', page(...options));
    return this;
  }

  /**
   * Apply the pixelate filter to the resulting image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#pixelate for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().pixelate(5);
   * ```
   */
  public pixelate(this: this, ...options: Parameters<typeof pixelate>): this {
    this.modifiers.set('pixelate', pixelate(...options));
    return this;
  }

  /**
   * Allows redefining PNG saving options.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#png-options-idpng-options for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().pngOptions({
   *   interlaced: true,         // optional
   *   quantize: false,          // optional
   *   quantization_colors: 10   // optional
   * });
   * ```
   */
  public pngOptions(
    this: this,
    ...options: Parameters<typeof pngOptions>
  ): this {
    this.modifiers.set('pngOptions', pngOptions(...options));
    return this;
  }

  /**
   * Sets one or many presets to be used by the imgproxy.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#preset for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().preset('mypreset');
   *
   * pb().preset(['preset1', 'preset2']);
   * ```
   */
  public preset(this: this, ...options: Parameters<typeof preset>): this {
    this.modifiers.set('preset', preset(...options));
    return this;
  }

  /**
   * Returns a raw unprocessed and unchecked source image
   *
   * See https://github.com/imgproxy/imgproxy/blob/f95f57bb4df35c69ae2257958006ef54b1c1d8c7/docs/generating_the_url.md#raw for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().raw();
   * ```
   */
  public raw(this: this, ...options: Parameters<typeof raw>): this {
    this.modifiers.set('raw', raw(...options));
    return this;
  }

  /**
   * Defines the algorithm that imgproxy will use for resizing.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#resizing-algorithm-idresizing-algorithm for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().resizingAlgorithm(ResizingAlgorithm.NEAREST));
   * ```
   */
  public resizingAlgorithm(
    this: this,
    ...options: Parameters<typeof resizingAlgorithm>
  ): this {
    this.modifiers.set('resizingAlgorithm', resizingAlgorithm(...options));
    return this;
  }

  /**
   * Returns attachment in the Content-Disposition header.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#return-attachment for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().returnAttachment();
   * ```
   */
  public returnAttachment(this: this): this {
    this.modifiers.set('returnAttachment', returnAttachment());
    return this;
  }

  /**
   * Redefines the quality of the resulting image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#quality for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().quality(80);
   * ```
   */
  public quality(this: this, ...options: Parameters<typeof quality>): this {
    this.modifiers.set('quality', quality(...options));
    return this;
  }

  /**
   * Resizes the image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#resize for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().resize({
   *   type: ResizeType.AUTO,  // optional
   *   width: 100,             // optional
   *   height: 50              // optional
   * });
   * ```
   */
  public resize(this: this, ...options: Parameters<typeof resize>): this {
    this.modifiers.set('resize', resize(...options));
    return this;
  }

  /**
   * Rotates the image by the specified angle.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#rotate for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().rotate(90);
   * ```
   */
  public rotate(this: this, ...options: Parameters<typeof rotate>): this {
    this.modifiers.set('rotate', rotate(...options));
    return this;
  }

  /**
   * Adjust saturation of the resulting image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#saturation-idsaturation for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().saturation(0.3);
   * ```
   */
  public saturation(
    this: this,
    ...options: Parameters<typeof saturation>
  ): this {
    this.modifiers.set('saturation', saturation(...options));
    return this;
  }

  /**
   * Applies a sharpen filter to the image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#sharpen for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().sharpen(3);
   * ```
   */
  public sharpen(this: this, ...options: Parameters<typeof sharpen>): this {
    this.modifiers.set('sharpen', sharpen(...options));
    return this;
  }

  /**
   * Skip the processing of the listed formats.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#skip-processing for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().skipProcessing(['png', 'svg']);
   * ```
   */
  public skipProcessing(
    this: this,
    ...options: Parameters<typeof skipProcessing>
  ): this {
    this.modifiers.set('skipProcessing', skipProcessing(...options));
    return this;
  }

  /**
   * Strips the color profile from the image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#strip-color-profile for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().stripColorProfile();
   * ```
   */
  public stripColorProfile(this: this): this {
    this.modifiers.set('stripColorProfile', stripColorProfile());
    return this;
  }

  /**
   * Strips the metadata from the image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#strip-metadata for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().stripMetadata();
   * ```
   */
  public stripMetadata(this: this): this {
    this.modifiers.set('stripMetadata', stripMetadata());
    return this;
  }

  /**
   * Prepend a `<style>` node with the provided CSS styles to the
   * `<svg>` node of a source SVG image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#style-idstyle for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().style('fill:red;width:30px;');
   *
   * pb().style({
   *   fill: 'red';
   *   width: '30px'
   * });
   * ```
   */
  public style(this: this, ...options: Parameters<typeof style>): this {
    this.modifiers.set('style', style(...options));
    return this;
  }

  /**
   * Trims the image background.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#trim for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().trim({
   *   threshold: 10,       // required
   *   color: 'ffffff',     // optional
   *   equal: {             // optional
   *     horizontal: true,  // optional
   *     vertical: true     // optional
   *   }
   * });
   * ```
   */
  public trim(this: this, ...options: Parameters<typeof trim>): this {
    this.modifiers.set('trim', trim(...options));
    return this;
  }

  /**
   * Allows redefining unsharpening options.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#unsharpening-idunsharpening for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().unsharpen({
   *   mode: UnsharpeningMode.AUTO,   // optional
   *   weight: 11,                    // optional
   *   dividor: 24                    // optional
   * });
   * ```
   */
  public unsharpen(this: this, ...options: Parameters<typeof unsharpen>): this {
    this.modifiers.set('unsharpen', unsharpen(...options));
    return this;
  }

  /**
   * Redefines the second used for the thumbnail.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#video-thumbnail-second-idvideo-thumbnail-second for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().videoThumbnailSecond(3);
   * ```
   */
  public videoThumbnailSecond(
    this: this,
    ...options: Parameters<typeof videoThumbnailSecond>
  ): this {
    this.modifiers.set(
      'videoThumbnailSecond',
      videoThumbnailSecond(...options),
    );
    return this;
  }

  /**
   * Places a watermark on the processed image.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#watermark for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().watermark({
   *   opacity: 0.8,                          // required
   *   position: WatermarkPosition.REPLICATE  // optional
   *   scale: 2                               // optional
   * });
   *
   * pb().watermark({
   *   opacity: 1.0,
   *   scale: 1,
   *   position: WatermarkPosition.WEST  // optional
   *   offset: {                         // optional
   *     x: 10,                          // optional
   *     y: 10                           // optional
   *   }
   * })
   * ```
   */
  public watermark(this: this, ...options: Parameters<typeof watermark>): this {
    this.modifiers.set('watermark', watermark(...options));
    return this;
  }

  /**
   * Adds a shadow to the watermark.
   *
   * See https://github.com/imgproxy/imgproxy/blob/f95f57bb4df35c69ae2257958006ef54b1c1d8c7/docs/generating_the_url.md#watermark-shadow-idwatermark-shadow for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().watermarkShadow(10);
   * ```
   */
  public watermarkShadow(
    this: this,
    ...options: Parameters<typeof watermarkShadow>
  ): this {
    this.modifiers.set('watermarkShadow', watermarkShadow(...options));
    return this;
  }

  /**
   * Defines the desired width and height of the watermark. imgproxy always
   * uses `fit` resizing type when resizing watermarks and enlarges them
   * when needed.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#watermark-size-idwatermark-size for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().watermarkSize({
   *   width: 30,  // required
   *   height: 30  // required
   * });
   * ```
   */
  public watermarkSize(
    this: this,
    ...options: Parameters<typeof watermarkSize>
  ): this {
    this.modifiers.set('watermarkSize', watermarkSize(...options));
    return this;
  }

  /**
   * Generate an image from the provided text and use it as a watermark.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#watermark-text-idwatermark-text for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().watermarkText("my watermark");
   * ```
   */
  public watermarkText(
    this: this,
    ...options: Parameters<typeof watermarkText>
  ): this {
    this.modifiers.set('watermarkText', watermarkText(...options));
    return this;
  }

  /**
   * Use the image from the specified URL as a watermark.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#watermark-url-idwatermark-url for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().watermarkUrl('https://example.com');
   * ```
   */
  public watermarkUrl(
    this: this,
    ...options: Parameters<typeof watermarkUrl>
  ): this {
    this.modifiers.set('watermarkUrl', watermarkUrl(...options));
    return this;
  }

  /**
   * Multiply the image dimensions according to the specified factors.
   *
   * See https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#zoom for the imgproxy documentation
   *
   * @example
   * ```typescript
   * pb().zoom(3);
   * ```
   */
  public zoom(this: this, ...options: Parameters<typeof zoom>): this {
    this.modifiers.set('zoom', zoom(...options));
    return this;
  }
}

/**
 * Creates a new param builder instance
 *
 * @returns  The param builder instance
 */
const pb = (): ParamBuilder => new ParamBuilder();

export default pb;
export { ParamBuilder };
