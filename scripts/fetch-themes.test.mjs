import assert from 'node:assert/strict';
import test from 'node:test';
import { patchThemeUrls } from './fetch-themes.mjs';

test('preserva la herencia al normalizar URLs de tema y versiones', () => {
  const theme = {
    id: 'notstaff-petal',
    slug: 'notstaff-petal',
    extends: 'signature_dark_cubiclauncher',
    extendsTheme: 'cubiclauncher-signature-dark',
    latestVersion: 'V2',
    previewUrl: null,
    versions: [
      {
        version: 'V1',
        previewUrl: null,
        showcaseUrl: null,
        extends: 'signature_dark_cubiclauncher',
        extendsTheme: 'cubiclauncher-signature-dark',
        files: [
          {
            name: 'preview.png',
            url: 'https://themes.cubiclauncher.org/src/Notstaff/Petal/V1/preview.png',
          },
        ],
      },
    ],
  };

  const patched = patchThemeUrls(theme);

  assert.equal(patched.extends, 'signature_dark_cubiclauncher');
  assert.equal(patched.extendsTheme, 'cubiclauncher-signature-dark');
  assert.equal(patched.versions[0].extends, 'signature_dark_cubiclauncher');
  assert.equal(patched.versions[0].extendsTheme, 'cubiclauncher-signature-dark');
  assert.equal(
    patched.versions[0].previewUrl,
    'https://themes.cubiclauncher.org/src/Notstaff/Petal/V1/preview.png'
  );
  assert.equal(patched.previewUrl, patched.versions[0].previewUrl);
});

test('no agrega campos de herencia cuando el tema no hereda', () => {
  const patched = patchThemeUrls({
    id: 'standalone',
    slug: 'standalone',
    latestVersion: 'V1',
    versions: [{ version: 'V1', files: [] }],
  });

  assert.equal('extends' in patched, false);
  assert.equal('extendsTheme' in patched, false);
  assert.equal('extends' in patched.versions[0], false);
});
