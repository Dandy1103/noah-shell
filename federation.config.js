const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

const localUi = process.env.NOAH_UI_LOCAL === '1';
const shared = shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' });
const skip = [
  'rxjs/ajax',
  'rxjs/fetch',
  'rxjs/testing',
  'rxjs/webSocket',
];

if (localUi) {
  delete shared['@dandy1103/ui'];
  skip.push('@dandy1103/ui');
}

module.exports = withNativeFederation({
  shared,
  skip,
});
