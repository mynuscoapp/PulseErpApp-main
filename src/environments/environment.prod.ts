import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'https://mynusco.bitrix24.in/rest/1/qyc6505mbvbp8emb/',
  wooCommApiUrl: 'https://eha.eco/wp-json/wc/v3/',
  bitrixStockUrl: 'https://erp.eha.eco/bitrixstock'
};
