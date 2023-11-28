// import React from 'react'

// Import from layouts
import PageLayout from "src/layouts/page_layout/PageLayout"

// Import from components
import Button from "src/components/button/Button";
import SwitchSlider from "src/components/switch_slider/SwitchSlider";
import ChatSection from "src/components/chat_section/ChatSection";
import { openMyDialog } from 'src/components/dialog/Dialog';

// Import from utils
import { OtherUtils } from 'src/utils/other';

// Import from assets
import homeJSON from 'src/assets/data/home.json';

export default function HomePage() {
  return (
    <PageLayout headerTitle={"Home"} >
      <div className="p-4">
        <div className="w-full max-w-screen-xl mx-auto">
          <SwitchSlider
            right={(_, toSlide) => <ChatSection toSlide={toSlide} />}
            left={(_, toSlide) => (
              <div>
                {/* Text */}
                <div>
                  {
                    OtherUtils.fromContentToJSXElement(homeJSON.texts)
                  }
                </div>

                {/* Button container */}
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
        </div>
      </div>
    </PageLayout>
  )
}

// For scanning
// text-xl
// text-4xl font-bold
// w-full max-w-xl pt-4 text-lg