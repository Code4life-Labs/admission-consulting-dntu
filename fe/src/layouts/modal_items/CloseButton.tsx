// Import from components
import Button from "src/components/button/Button";

export interface CloseButtonPropsType {
  isAgree: boolean;
  icon: string;
  close: (data: any) => any
}

/**
 * Use to render close button for modal item.
 * @param props 
 * @returns 
 */
export default function CloseButton(props: CloseButtonPropsType) {
  return (
    <Button
      isTransparent
      extendClassName="p-1 rounded-4"
      onClick={() => props.close({ isAgree: props.isAgree ? true : false })}
    >
      <span className="material-symbols-outlined">
        {props.icon}
      </span>
    </Button>
  );
}