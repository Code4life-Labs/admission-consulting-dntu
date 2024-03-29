// import React from 'react'

/**
 * Use this function component to render navbar (Used in PageLayout).
 * @returns 
 */
export default function Navbar() {
  return (
    <div className="bg-rose-800">
      <div className="max-w-[1300px] mx-auto">
        <nav className="">
          <ul className="flex justify-around align-center text-white font-bold">
            <li className="p-4">Về DNTU</li>
            <li className="p-4">Đào tạo</li>
            <li className="p-4">Tuyển sinh</li>
            <li className="p-4">Tin tức</li>
            <li className="p-4">Thông báo</li>
            <li className="p-4">Tạp chí</li>
            <li className="p-4">CSET 2024</li>
          </ul>
        </nav>
      </div>
    </div>
  )
}