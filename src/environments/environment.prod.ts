import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: '',
  wooCommApiUrl: 'https://eha.eco/wp-json/wc/v3/',
  bitrixStockUrl: 'https://erp.eha.eco'
};
