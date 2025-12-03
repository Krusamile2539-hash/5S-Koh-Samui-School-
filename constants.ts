
import type { Teacher } from './types';

export const APP_VERSION = '1.2.23';

// Fix: Add TEACHER_CODES export to be used for authentication.
export const TEACHER_CODES: Teacher[] = [
    { code: 'KS01', name: 'เจ้าหน้าที่ 5ส' },
    { code: 'KS02', name: 'เจ้าหน้าที่ 5ส' },
    { code: 'KS03', name: 'ภคพร' },
    { code: 'KS04', name: 'ภัทรกร' },
    { code: 'KS05', name: 'เจ้าหน้าที่ 5ส' },
    { code: 'KS06', name: 'วรัญญู' },
    { code: 'KS07', name: 'มนรดา' },
    { code: 'KS08', name: 'อภิญญา' },
    { code: 'KS09', name: 'ณิชกมล' },
    { code: 'KS10', name: 'กัลย์กมล' },
    { code: 'KS11', name: 'สุพัดตรา' },
    { code: 'KS12', name: 'อรรจน์ชนก' },
    { code: 'KS13', name: 'ปฐมพร' },
    { code: 'KS14', name: 'ฐิติมา' },
    { code: 'KS15', name: 'ขวัญหทัย' },
    { code: 'KS16', name: 'ปริยาภัทร' },
    { code: 'KS17', name: 'ไอแซค' },
    { code: 'KS18', name: 'เคธี่' },
    { code: 'KS19', name: 'พรทิวา' },
    { code: 'KS20', name: 'รามิล' },
    { code: 'KS21', name: 'วรัทยา' },
    { code: 'KS22', name: 'ชลกร' },
    { code: 'KS23', name: 'นัณทวรรณ' },
    { code: 'KS24', name: 'ณัฏฐากร' },
    { code: 'KS25', name: 'ชุติมา' },
    { code: 'KS26', name: 'ศรัณยา' },
    { code: 'KS27', name: 'ฐิติวรดา' },
    { code: 'KS28', name: 'สุพิชา' },
    { code: 'KS29', name: 'เขมิกา' },
    { code: 'KS30', name: 'อารดี' },
    { code: 'KS31', name: 'โกสินทร์' },
    { code: 'KS32', name: 'ณัฐพร' },
    { code: 'KS33', name: 'ปาริชาติ' },
    { code: 'KS34', name: 'เมธิรา ณรงค์ฤทธิ์' },
    { code: 'KS35', name: 'ฟานไลร์ อัญชลี อุมันดับ' },
    // Project Leads / Admins who may also need to log in
    { code: 'ADM01', name: 'รองฯ ปฏิพัทธ์ ใจดี' },
    { code: 'ADM02', name: 'คุณครูภานุวัฒน์ ทองจันทร์' },
    { code: 'ADM03', name: 'มัลลิกา ไชยวิก' },
];


export const CLASSROOMS = [
  ...Array.from({ length: 10 }, (_, i) => `ม.1/${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `ม.2/${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `ม.3/${i + 1}`),
  ...Array.from({ length: 6 }, (_, i) => `ม.4/${i + 1}`),
  ...Array.from({ length: 6 }, (_, i) => `ม.5/${i + 1}`),
  ...Array.from({ length: 6 }, (_, i) => `ม.6/${i + 1}`),
];

// Mapping of Buildings to Classrooms based on the School Map
export const BUILDING_ROOM_MAPPING = [
  {
    name: 'อาคาร 4',
    rooms: ['ม.1/9', 'ม.1/10', 'ม.2/3', 'ม.2/4', 'ม.2/5', 'ม.2/6', 'ม.2/7', 'ม.2/8', 'ม.2/9', 'ม.2/10']
  },
  {
    name: 'อาคาร 9',
    rooms: ['ม.1/2', 'ม.2/2', 'ม.3/2']
  },
  {
    name: 'อาคาร 10',
    rooms: ['ม.3/3', 'ม.3/4', 'ม.3/5', 'ม.4/6', 'ม.5/6', 'ม.6/6']
  },
  {
    name: 'อาคาร 11',
    rooms: ['ม.1/3', 'ม.1/4', 'ม.1/5', 'ม.1/6', 'ม.1/7', 'ม.1/8']
  },
  {
    name: 'อาคาร 12',
    rooms: [
      'ม.1/1', 'ม.2/1', 'ม.3/1', 
      'ม.4/1', 'ม.4/2', 'ม.4/3', 'ม.4/4', 'ม.4/5',
      'ม.5/1', 'ม.5/2', 'ม.5/3', 'ม.5/4', 'ม.5/5',
      'ม.6/1', 'ม.6/2', 'ม.6/3', 'ม.6/4', 'ม.6/5'
    ]
  },
  {
    name: 'อาคารนักกีฬา',
    rooms: ['ม.3/6', 'ม.3/7', 'ม.3/8', 'ม.3/9']
  }
];

export const FIVE_S_CRITERIA = [
  { id: 'seiri', name: 'สะสาง (Seiri)', description: 'การแยกของที่จำเป็นออกจากของที่ไม่จำเป็น' },
  { id: 'seiton', name: 'สะดวก (Seiton)', description: 'การจัดวางของที่จำเป็นให้เป็นระเบียบและง่ายต่อการใช้งาน' },
  { id: 'seiso', name: 'สะอาด (Seiso)', description: 'การทำความสะอาดสถานที่ อุปกรณ์ และสิ่งของต่างๆ' },
  { id: 'seiketsu', name: 'สุขลักษณะ (Seiketsu)', description: 'การรักษาสภาพแวดล้อมให้ถูกสุขลักษณะและปลอดภัย' },
  { id: 'shitsuke', name: 'สร้างนิสัย (Shitsuke)', description: 'การปฏิบัติตามหลัก 4ส แรกอย่างสม่ำเสมอจนเป็นนิสัย' },
];

export const JUNIOR_HIGH_PREFIXES = ['ม.1', 'ม.2', 'ม.3'];
export const SENIOR_HIGH_PREFIXES = ['ม.4', 'ม.5', 'ม.6'];
