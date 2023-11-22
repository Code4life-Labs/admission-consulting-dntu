// import React from 'react'

// Import from layouts
import PageLayout from "src/layouts/page_layout/PageLayout"

// Import from components
import Button from "src/components/button/Button";
import SwitchSlider from "src/components/switch_slider/SwitchSlider";
import ChatSection from "src/components/chat_section/ChatSection";

// Import from assets
import homeJSON from 'src/assets/data/home.json';

export default function HomePage() {
  return (
    <PageLayout headerTitle={"Home"} >
      <div className="p-4">
        <div className="w-full max-w-screen-xl mx-auto">
          <SwitchSlider
            right={() => <ChatSection />}
            left={(toggleSlide) => (
              <div>
                {/* Text */}
                <div>
                  <p className="text-xl text-base">{homeJSON.texts.greeting}</p>
                  <h1 className="text-4xl font-bold">{homeJSON.texts.title}</h1>
                  <h1 className="text-5xl font-bold">DNTU</h1>
                  <p className="text-xl w-full max-w-xl pt-4 text-base">{homeJSON.texts.introduction}</p>
                </div>

                {/* Button container */}
                <div>
                  <Button extendClassName="text-white mt-3 me-3" onClick={() => toggleSlide()}>Bắt đầu ngay</Button>
                  <Button
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