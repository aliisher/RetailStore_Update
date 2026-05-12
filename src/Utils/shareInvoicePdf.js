import { Platform } from 'react-native';
import Share from 'react-native-share';

/** Single `file://` prefix; works with paths from react-native-html-to-pdf on both OSes. */
export function buildPdfFileUrl(filePath) {
  if (filePath == null || filePath === '') {
    return null;
  }
  const withoutScheme = String(filePath).replace(/^file:\/\//, '');
  return `file://${withoutScheme}`;
}

export function getPdfFilename(filePath) {
  if (filePath == null || filePath === '') {
    return 'invoice.pdf';
  }
  const name = String(filePath).replace(/^file:\/\//, '').split('/').pop();
  return name && name.length > 0 ? name : 'invoice.pdf';
}

/**
 * Share a PDF from local disk.
 * - Android: requires FileProvider in AndroidManifest (`*.rnshare.fileprovider`) + `res/xml/file_paths.xml`.
 * - iOS: uses `urls` (single entry) for reliable UIActivityViewController attachment behaviour.
 */
export async function shareInvoicePdf(filePath, { title = 'Share PDF' } = {}) {
  const fileUrl = buildPdfFileUrl(filePath);
  if (!fileUrl) {
    throw new Error('Missing PDF path');
  }
  const filename = getPdfFilename(filePath);

  const common = {
    title,
    type: 'application/pdf',
    filename,
    failOnCancel: false,
  };

  if (Platform.OS === 'ios') {
    await Share.open({
      ...common,
      urls: [fileUrl],
    });
  } else {
    await Share.open({
      ...common,
      url: fileUrl,
    });
  }
}
