
const ScrollToBottomBtn = (props) => {
    return (
        <div onClick={props.onClick} className="absolute right-[44px] bottom-[150px] bg-rose-700 z-10 hover:cursor-pointer hover:bg-rose-800 rounded-full h-[40px] w-[40px] flex justify-center content-center shadow-lg">
          <span className="material-symbols-outlined text-white mt-2">keyboard_arrow_down</span>
        </div>
    );
};

export default ScrollToBottomBtn;