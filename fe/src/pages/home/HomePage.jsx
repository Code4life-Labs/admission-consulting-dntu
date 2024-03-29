// import React from 'react'

// Import from layouts
import PageLayout from "src/layouts/page_layout/PageLayout"

// Import from components
import Button from "src/components/button/Button";
// import SwitchSlider from "src/components/switch_slider/SwitchSlider";
// import ChatSection from "src/components/chat_section/ChatSection";
// import { openMyDialog } from 'src/components/dialog/Dialog';

// Import from utils
// import { OtherUtils } from 'src/utils/other';

// Import from assets
// import homeJSON from 'src/assets/data/home.json';

export default function HomePage() {
  return (
    <PageLayout headerTitle={"Home"} >
      <div>
        <div className="w-full mx-auto">
        {/*
          <SwitchSlider
            right={(_, toSlide) => <ChatSection toSlide={toSlide} />}
            left={(_, toSlide) => (
              <div>
                <div>
                  {
                    OtherUtils.fromContentToJSXElement(homeJSON.texts)
                  }
                </div>

                <div>
                  <Button extendClassName="text-white mt-3 me-3" onClick={() => toSlide("right")}>Bắt đầu ngay</Button>
                  <Button
                    onClick={() => openMyDialog()}
                    extendClassName="mt-3"
                    color="gray"
                    colorIntensity={200}
                    hoverIntensity={300}
                    activeIntensity={400}
                    focusIntensity={300}
                  >Thông tin khác</Button>
                </div>
              </div>
            )}
          />
        */}

          <div className="relative mx-auto w-fit">
            <img
              src="https://dntu.edu.vn/storage/slider/gEfqHjTk29r8OO0YldEFhFevBXvznk-metadGh1LXZpZW4tcmVzaXplLnBuZw==-.webp"
              className="w-full min-h-[600px] block object-cover"
            />
            <div className="absolute top-[40%] w-full">
              <div className="px-[9%]">
                <p
                  className="w-3/4 font-bold text-white text-4xl"
                  style={{ textShadow: "2px 2px 10px #111" }}
                >
                  DNTU SỰ KẾT HỢP HOÀN HẢO NHÀ TRƯỜNG - DOANH NGHIỆP - CÔNG NGHỆ
                </p>
                <Button extendClassName="bg-white font-bold mt-5" color="slate" colorIntensity={50}>TÌM HIỂU THÊM</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

// For scanning
// text-xl
// text-4xl font-bold
// w-full max-w-xl pt-4 text-lg