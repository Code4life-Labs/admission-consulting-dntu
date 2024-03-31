import React from 'react'

// Import from components
import Button from '../button/Button';

// Import local components
import QnAMessage from "./QnAMessage"

/**
 * @typedef VideosRefPropsType
 * @property {Array<{link: string, imageUrl: string}>} videos
 */

/**
 * Use this function to render related images of answer.
 * @param {VideosRefPropsType} props
 * @returns 
 */
export default function VideosRef(props) {
  const [isLoadedMore, setIsLoadedMore] = React.useState(false);

  const N = isLoadedMore ? props.videos.length : 4;
  const images = React.useMemo(() => {
    let r = [];
    for(let i = 0; i < N; i++) {
      r.push(
        <a
          key={i}
          className="flex  relative w-[200px] m-3 aspect-video"
          href={props.videos[i].link} target="_blank" rel="noreferrer"
        >
          <span
            className="material-symbols-outlined relative w-full h-full z-10 flex justify-center items-center text-4xl text-white bg-zinc-400/50"
          >play_circle</span>
          <img className="w-full absolute object-cover rounded-xl text-white" src={props.videos[i].imageUrl} />
        </a>
      )
    }
    return r;
  }, [N]);

  return (
    <QnAMessage avatar="/Logo_DNTU.png">
      <div className="w-full rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
        <p className="mb-4 font-bold">Những video liên quan:</p>
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