import { env } from '../config/environment'

export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  EXPIRED: 410 //GONE
}

export const WHITELIST_DOMAINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // từ FE call về BE
  'https://v3-api.fpt.ai', // từ fptai call về BE
  env.CLIENT
]

let websiteDomain = 'http://localhost:5173'
if (env.BUILD_MODE === 'production') {
  websiteDomain = 'https://dong-nai-travel-admin.vercel.app'
}

export const WEBSITE_DOMAIN = websiteDomain

export const LOGO_DNTU = 'https://res.cloudinary.com/duimhuxyz/image/upload/v1712133135/logo/Logo-DH-Cong-Nghe-Dong-Nai-DNTU_ceqecf.webp'
export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export const dataLink = [
  {
    title: '22 NGÀNH ĐÀO TẠO THỰC TIỄN ĐÁP ỨNG NHU CẦU XÃ HỘI TẠI DNTU',
    url: 'https://dntu.edu.vn/tuyen-sinh/tin-tuyen-sinh/22-nganh-dao-tao-thuc-tien-dap-ung-nhu-cau-xa-hoi-tai-dntu'
  },
  {
    title: 'Các giá trị thương hiệu',
    url: 'https://dntu.edu.vn/cac-gia-tri-thuong-hieu'
  },
  {
    title: 'Công nghệ kỹ thuật điện, điện tử',
    url: 'https://dntu.edu.vn/dao-tao/khoa-ky-thuat/cong-nghe-ky-thuat-dien-dien-tu'
  },
  {
    title: 'Công nghệ Kỹ thuật Hóa học',
    url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe/Cong-nghe-Ky-thuat-Hoa-hoc'
  }

]