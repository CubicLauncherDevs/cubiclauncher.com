import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findThemeByCatalogId,
  getThemeInheritance,
} from '../src/lib/utils/theme-inheritance.ts';

const baseTheme = {
  id: 'cubiclauncher-signature-dark',
  slug: 'cubiclauncher-signature-dark',
  name: 'Signature Dark',
  author: 'CubicLauncher',
  tags: [],
  dirPath: 'src/CubicLauncher/Signature_Dark',
  versions: [],
  latestVersion: 'V1',
  previewUrl: null,
};

test('resuelve el tema base por id o slug del catálogo', () => {
  assert.equal(findThemeByCatalogId([baseTheme], 'cubiclauncher-signature-dark'), baseTheme);
  assert.equal(findThemeByCatalogId([baseTheme], 'CUBICLAUNCHER-SIGNATURE-DARK'), baseTheme);
  assert.equal(findThemeByCatalogId([baseTheme], 'no-existe'), null);
  assert.equal(findThemeByCatalogId([baseTheme], '   '), null);
});

test('extrae el identificador y enlaza el tema base', () => {
  const inheritance = getThemeInheritance(
    {
      extends: ' signature_dark_cubiclauncher ',
      extendsTheme: 'cubiclauncher-signature-dark',
    },
    [baseTheme]
  );

  assert.deepEqual(inheritance, {
    extendsId: 'signature_dark_cubiclauncher',
    baseTheme,
  });
});

test('mantiene el identificador cuando la base no está en el catálogo', () => {
  const inheritance = getThemeInheritance(
    {
      extends: 'petal_base_notstaff',
      extendsTheme: 'notstaff-petal-base',
    },
    [baseTheme]
  );

  assert.deepEqual(inheritance, {
    extendsId: 'petal_base_notstaff',
    baseTheme: null,
  });
});

test('devuelve null cuando la versión no hereda', () => {
  assert.equal(getThemeInheritance({}, [baseTheme]), null);
  assert.equal(getThemeInheritance({ extends: '  ' }, [baseTheme]), null);
  assert.equal(getThemeInheritance(null, [baseTheme]), null);
});
