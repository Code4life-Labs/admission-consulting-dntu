import React from 'react'

// Import from components
import Button from '../button/Button';

// Import local components
import QnAMessage from "./QnAMessage"

/**
 * @typedef ImagesRefPropsType
 * @property {Array<{link: string}>} images
 */

/**
 * Use this function to render related images of answer.
 * @param {ImagesRefPropsType} props
 * @returns 
 */
export default function ImagesRef(props) {
  const [isLoadedMore, setIsLoadedMore] = React.useState(false);

  const N = isLoadedMore ? props.images.length : 4;
  const images = React.useMemo(() => {
    let r = [];
    for(let i = 0; i < N; i++) {
      r.push(<img className="w-[200px] h-[200px] m-3 object-cover rounded-xl" key={i} src={props.images[i].link} />)
    }
    return r;
  }, [N]);

  return (
    <QnAMessage avatar="/Logo_DNTU.png">
      <div className="w-full rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
        <p className="mb-4 font-bold">Những hình ảnh liên quan:</p>
        <div className="flex flex-wrap justify-center">
          {
            images
          }
        </div>
        {
          !isLoadedMore && (
            <div className="w-full">
              <Button
                onClick={() => setIsLoadedMore(true)}
                extendClassName="block font-bold text-white mx-auto"
                color="rose-800" hoverColor="rose-700" activeColor="rose-950"
              >
                Xem thêm
              </Button>
            </div>
          )
        }
      </div>
    </QnAMessage>
  )
}