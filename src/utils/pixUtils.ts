export interface PixConfig {
  key: string;
  name: string;
  city: string;
  amount: number;
  txid?: string;
}

export const OFFICIAL_PIX_CONFIG: PixConfig = {
  key: '05d68d46-c90a-4b73-b2f3-fe86d2f34124',
  name: 'Alessandro Dos Santos Cordeiro',
  city: 'Joao Pessoa',
  amount: 39.90,
  txid: 'JAMPAVIP'
};

export const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/dRm9AU2sAbZe6Cf9H30gw00';

function crc16(str: string): string {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export function generateBacenPixPayload(config: Partial<PixConfig> = {}): {
  payload: string;
  qrCodeUrl: string;
  receiverName: string;
  key: string;
  city: string;
  amount: number;
} {
  const cfg: PixConfig = { ...OFFICIAL_PIX_CONFIG, ...config };
  const cleanKey = cfg.key.trim();
  const cleanName = cfg.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().substring(0, 25);
  const cleanCity = cfg.city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().substring(0, 15);
  const cleanTxid = (cfg.txid || 'JAMPA').substring(0, 25);
  const cleanAmount = cfg.amount.toFixed(2);

  const gui = '0014BR.GOV.BCB.PIX';
  const keyField = '01' + cleanKey.length.toString().padStart(2, '0') + cleanKey;
  const merchantAccountInfo = '26' + (gui.length + keyField.length).toString().padStart(2, '0') + gui + keyField;

  const mcc = '52040000';
  const currency = '5303986';
  const amountField = '54' + cleanAmount.length.toString().padStart(2, '0') + cleanAmount;
  const country = '5802BR';
  const nameField = '59' + cleanName.length.toString().padStart(2, '0') + cleanName;
  const cityField = '60' + cleanCity.length.toString().padStart(2, '0') + cleanCity;
  const txidField = '05' + cleanTxid.length.toString().padStart(2, '0') + cleanTxid;
  const additionalData = '62' + txidField.length.toString().padStart(2, '0') + txidField;

  const rawPayload = '000201' + merchantAccountInfo + mcc + currency + amountField + country + nameField + cityField + additionalData + '6304';
  const crc = crc16(rawPayload);
  const payload = rawPayload + crc;

  // URL do QR Code em alta definição via API universal de QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(payload)}&margin=10`;

  return {
    payload,
    qrCodeUrl,
    receiverName: cfg.name,
    key: cfg.key,
    city: cfg.city,
    amount: cfg.amount
  };
}
