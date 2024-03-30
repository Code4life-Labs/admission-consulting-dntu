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
            <li className="hover:bg-rose-700"><a href="/" className="block p-4">Về DNTU</a></li>
            <li className="hover:bg-rose-700"><a href="/" className="block p-4">Đào tạo</a></li>
            <li className="hover:bg-rose-700"><a href="/" className="block p-4">Tuyển sinh</a></li>
            <li className="hover:bg-rose-700"><a href="/" className="block p-4">Tin tức</a></li>
            <li className="hover:bg-rose-700"><a href="/" className="block p-4">Thông báo</a></li>
            <li className="hover:bg-rose-700"><a href="/" className="block p-4">Tạp chí</a></li>
            <li className="hover:bg-rose-700"><a href="/" className="block p-4">CSET 2024</a></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}