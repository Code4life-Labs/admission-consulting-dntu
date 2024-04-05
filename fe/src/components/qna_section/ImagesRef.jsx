import React, { useRef } from 'react'
import {
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";

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
  const [openDialogImage, setOpenDialogImage] = React.useState(false);
  const [image, setImage] = React.useState(null)
  const modalRef = useRef(null);

  const handleOpen = (url) => {
    setOpenDialogImage((cur) => !cur);
    setImage(url)
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleOpen();
    }
  };
  React.useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const N = isLoadedMore ? props.images.length : 4;
  const images = React.useMemo(() => {
    let r = [];
    for (let i = 0; i < N; i++) {
      r.push(<img className="w-[200px] h-[200px] m-3 object-cover rounded-xl" key={i} src={props.images[i].link}
        onClick={() => handleOpen(props.images[i].link)}
      />)
    }
    return r;
  }, [N]);

  return (
    <>
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
      {
        openDialogImage && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div ref={modalRef} className="flex items-center justify-center">
              <Dialog open={open} size='xl' handler={handleOpen} className='flex justify-center items-center w-full h-full'>
                <DialogHeader className='absolute top-8 right-20'>
                  <Button onClick={handleOpen} hasPadding={false} extendClassName="p-2">
                    <span className="material-symbols-outlined block">close</span>
                  </Button>
                </DialogHeader>
                <DialogBody>
                  <img
                    alt="nature"
                    className="h-[42rem] w-[42rem] rounded-m object-cover object-center"
                    src={image}
                  />
                </DialogBody>
              </Dialog>
            </div>
          </div>


        )
      }
    </>
  )
}