import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Config } from '../Api_Services/Config';

/** Relative API paths → full URL; leaves absolute URLs unchanged. */
export function resolveImageUrl(path) {
  if (!path) {
    return '';
  }
  const trimmed = String(path).trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const domain = (Config?.domain || '').replace(/\/$/, '');
  const segment = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${domain}${segment}`;
}

/**
 * Download remote image and return a data URI for HTML/PDF embeds.
 * react-native-html-to-pdf cannot reliably load http(s) img src URLs.
 */
export async function imageUrlToDataUri(imageUrl) {
  const url = resolveImageUrl(imageUrl);
  if (!url) {
    return null;
  }

  try {
    const extMatch = url.match(/\.(jpe?g|png|gif|webp)(\?|$)/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
    const mime =
      ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : ext === 'gif'
          ? 'image/gif'
          : ext === 'webp'
            ? 'image/webp'
            : 'image/png';
    const localPath = `${RNFS.CachesDirectoryPath}/invoice_logo_${Date.now()}.${ext}`;
    const { statusCode } = await RNFS.downloadFile({
      fromUrl: url,
      toFile: localPath,
    }).promise;

    if (statusCode !== 200) {
      return null;
    }

    const base64 = await RNFS.readFile(localPath, 'base64');
    await RNFS.unlink(localPath).catch(() => {});
    return `data:${mime};base64,${base64}`;
  } catch (err) {
    console.warn('imageUrlToDataUri:', err);
    return null;
  }
}

/** Bundled require() image → data URI for invoice PDFs. */
export async function bundleAssetToDataUri(asset, mimeType = 'image/png') {
  const source = Image.resolveAssetSource(asset);
  if (!source?.uri) {
    return null;
  }

  const { uri } = source;
  const toDataUri = base64 => `data:${mimeType};base64,${base64}`;

  if (uri.startsWith('data:')) {
    return uri;
  }

  try {
    if (uri.startsWith('http')) {
      const res = await ReactNativeBlobUtil.config({ fileCache: true }).fetch(
        'GET',
        uri,
      );
      return toDataUri(await res.readFile('base64'));
    }

    try {
      return toDataUri(await ReactNativeBlobUtil.fs.readFile(uri, 'base64'));
    } catch {
      const path = uri.replace(/^file:\/\//, '');
      return toDataUri(await ReactNativeBlobUtil.fs.readFile(path, 'base64'));
    }
  } catch (blobErr) {
    try {
      const path = uri.replace(/^file:\/\//, '');
      return toDataUri(await RNFS.readFile(path, 'base64'));
    } catch (rnfsErr) {
      try {
        const res = await ReactNativeBlobUtil.config({ fileCache: true }).fetch(
          'GET',
          uri,
        );
        return toDataUri(await res.readFile('base64'));
      } catch (fetchErr) {
        console.warn('bundleAssetToDataUri:', blobErr, rnfsErr, fetchErr);
        return null;
      }
    }
  }
}
