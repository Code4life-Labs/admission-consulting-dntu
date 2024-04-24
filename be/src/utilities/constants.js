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
    id: '22_ngành_đào_tạo_thực_tiễn_đáp_ứng_nhu_cầu_xã_hội_tại_dntu',
    title: '22 NGÀNH ĐÀO TẠO THỰC TIỄN ĐÁP ỨNG NHU CẦU XÃ HỘI TẠI DNTU',
    url: 'https://dntu.edu.vn/tuyen-sinh/tin-tuyen-sinh/22-nganh-dao-tao-thuc-tien-dap-ung-nhu-cau-xa-hoi-tai-dntu'
  },
  {
    id: 'các_giá_trị_thương_hiệu',
    title: 'Các giá trị thương hiệu',
    url: 'https://dntu.edu.vn/cac-gia-tri-thuong-hieu'
  },
  {
    id: 'công_nghệ_kỹ_thuật_điện,_điện_tử',
    title: 'Công nghệ kỹ thuật điện, điện tử',
    url: 'https://dntu.edu.vn/dao-tao/khoa-ky-thuat/cong-nghe-ky-thuat-dien-dien-tu'
  },
  {
    id: 'công_nghệ_kỹ_thuật_hóa_học',
    title: 'Công nghệ Kỹ thuật Hóa học',
    url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe/Cong-nghe-Ky-thuat-Hoa-hoc'
  },
  {
    id: 'công_nghệ_kỹ_thuật_môi_trường',
    title: 'Công nghệ Kỹ thuật Môi trường',
    url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe/Cong-nghe-Ky-thuat-Moi-truong'
  },
  {
    id: 'công_nghệ_kỹ_thuật_xây_dựng',
    title: 'Công nghệ kỹ thuật xây dựng',
    url: 'https://dntu.edu.vn/dao-tao/khoa-ky-thuat/cong-nghe-ki-thuat-xay-dung'
  },
  {
    id: 'công_nghệ_kỹ_thuật_ô_tô',
    title: 'Công nghệ kỹ thuật ô tô',
    url: 'https://dntu.edu.vn/dao-tao/khoa-ky-thuat/cong-nghe-ky-thuat-o-to'
  },
  { id: 'công_nghệ_sinh_học', title: 'Công nghệ sinh học', url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe/cong-nghe-sinh-hoc' },
  { id: 'công_nghệ_thông_tin', title: 'Công nghệ thông tin', url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe-thong-tin/cong-nghe-thong-tin' },
  { id: 'công_nghệ_thực_phẩm', title: 'Công nghệ thực phẩm', url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe/cong-nghe-thuc-pham' },
  {
    id: 'hướng_dẫn_dành_cho_tân_sinh_viên',
    title: 'Hướng dẫn dành cho tân sinh viên',
    url: 'https://lib.dntu.edu.vn/trangtinnoiquychitiet.aspx?Id=2'
  },
  {
    id: 'hệ_thống_đăng_ký_xét_tuyển_online',
    title: 'HỆ THỐNG ĐĂNG KÝ XÉT TUYỂN ONLINE',
    url: 'https://xetonline.dntu.edu.vn/'
  },
  { id: 'khoa_công_nghệ', title: 'Khoa Công nghệ', url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe' },
  {
    id: 'khoa_công_nghệ_thông_tin',
    title: 'Khoa Công nghệ thông tin',
    url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe-thong-tin'
  },
  {
    id: 'khoa_khoa_học_sức_khỏe',
    title: 'Khoa Khoa học Sức khỏe',
    url: 'https://dntu.edu.vn/dao-tao/khoa-khoa-hoc-suc-khoe'
  },
  {
    id: 'khoa_kế_toán_-_tài_chính',
    title: 'Khoa Kế toán - Tài chính',
    url: 'https://dntu.edu.vn/dao-tao/khoa-ke-toan-tai-chinh'
  },
  { id: 'khoa_kỹ_thuật', title: 'Khoa Kỹ thuật', url: 'https://dntu.edu.vn/dao-tao/khoa-ky-thuat' },
  {
    id: 'khoa_truyền_thông_-_thiết_kế',
    title: 'Khoa Truyền thông - Thiết kế',
    url: 'https://dntu.edu.vn/dao-tao/khoa-truyen-thong-thiet-ke'
  },
  { id: 'kế_toán', title: 'Kế toán', url: 'https://dntu.edu.vn/dao-tao/khoa-ke-toan-tai-chinh' },
  { id: 'kỹ_thuật_phần_mềm', title: 'Kỹ thuật phần mềm', url: 'https://dntu.edu.vn/dao-tao/khoa-cong-nghe-thong-tin/ky-thuat-phan-mem' },
  {
    id: 'kỹ_thuật_xét_nghiệm_y_học',
    title: 'Kỹ thuật xét nghiệm y học',
    url: 'https://dntu.edu.vn/dao-tao/khoa-khoa-hoc-suc-khoe/ky-thuat-xet-nghiem-y-hoc'
  },
  { id: 'ngôn_ngữ_anh', title: 'Ngôn ngữ Anh', url: 'https://dntu.edu.vn/dao-tao/khoa-ngoai-ngu/ngon-ngu-anh' },
  { id: 'ngôn_ngữ_trung_quốc', title: 'Ngôn ngữ Trung Quốc', url: 'https://dntu.edu.vn/dao-tao/khoa-ngoai-ngu/ngon-ngu-trung-quoc' },
  { id: 'nội_quy_học_tập', title: 'Nội Quy Học Tập', url: 'https://qldt.dntu.edu.vn/Files/648/file/SO%20TAY%20K17/4_%20NOI%20QUY%20HOC%20TAP.pdf' },
  {
    id: 'quản_trị_dịch_vụ_du_lịch_và_lữ_hành',
    title: 'Quản trị dịch vụ du lịch và lữ hành',
    url: 'https://dntu.edu.vn/dao-tao/khoa-kinh-te-quan-tri/quan-tri-du-lich'
  },
  { id: 'quản_trị_kinh_doanh', title: 'Quản trị kinh doanh', url: 'https://dntu.edu.vn/dao-tao/khoa-kinh-te-quan-tri/quan-tri-kinh-doanh' },
  { id: 'thiết_kế_đồ_họa', title: 'Thiết kế đồ họa', url: 'https://dntu.edu.vn/dao-tao/khoa-truyen-thong-thiet-ke/thiet-ke-do-hoa' },
  {
    id: 'thông_báo_tuyển_sinh_đại_học_năm_2024_-_trường_đại_học_công_nghệ_đồng_nai',
    title: 'THÔNG BÁO TUYỂN SINH ĐẠI HỌC NĂM 2024 - Trường Đại học Công nghệ Đồng Nai',
    url: 'https://dntu.edu.vn/thong-tin-huong-nghiep-tuyen-sinh/thong-bao-tuyen-sinh-dai-hoc-nam-2024'
  },
  {
    id: 'thông_báo_về_việc_điều_chỉnh_thời_gian_giảng_dạy_–_học_tập_tại_trường_đại_học_công_nghệ_đồng_nai_-_tt-qlcl',
    title: 'Thông báo về việc điều chỉnh thời gian giảng dạy – học tập tại Trường Đại học Công nghệ Đồng Nai - TT-QLCL',
    url: 'https://sv.dntu.edu.vn/home/newsdetail/thong-bao-ve-viec-dieu-chinh-thoi-gian-giang-day-hoc-tap-tai-truong-dai-hoc-cong-nghe-dong-nai.htm?id=973'
  },
  {
    id: 'thông_tin_tuyển_sinh_năm_2024',
    title: 'THÔNG TIN TUYỂN SINH NĂM 2024',
    url: 'https://dntu.edu.vn/tuyen-sinh/tin-tuyen-sinh/truong-dai-hoc-cong-nghe-dong-nai-dntu-ma-truong-dcd'
  },
  {
    id: 'tài_chính_-_ngân_hàng',
    title: 'Tài chính - Ngân hàng',
    url: 'https://dntu.edu.vn/dao-tao/khoa-ke-toan-tai-chinh/tai-chinh-ngan-hang'
  },
  { id: 'tài_liệu_canvas', title: 'Tài Liệu Canvas', url: '' },
  { id: 'tại_sao_chọn_dntu', title: 'Tại sao chọn DNTU', url: 'https://dntu.edu.vn/tai-sao-chon-dntu' },
  {
    id: 'tổng_quan_trường_đại_học_công_nghệ_đồng_nai',
    title: 'TỔNG QUAN TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI',
    url: 'https://qldt.dntu.edu.vn/Files/648/file/SO%20TAY%20K17/1_GIOI%20THIEU%20VE%20TRUONG%20DH%20CN%20DONG%20NAI%201.pdf'
  },
  { id: 'điều_dưỡng', title: 'Điều dưỡng', url: 'https://dntu.edu.vn/dao-tao/khoa-khoa-hoc-suc-khoe/dieu-duong' },
  { id: 'đông_phương_học', title: 'Đông phương học', url: 'https://dntu.edu.vn/dao-tao/khoa-ngoai-ngu/dong-phuong-hoc' }
]