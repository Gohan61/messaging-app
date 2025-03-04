import { textAreaProps } from "../../types/types";

export default function TextArea({ props }: { props: textAreaProps }) {
  return (
    <div className="relative">
      <textarea
        name={props.name}
        id={props.id}
        value={props.value}
        maxLength={props.maxLength}
        onChange={(e) => {
          props.stateSetter({
            ...props.form,
            [props.name]: e.target.value,
          });
          props.setValidationState({
            ...props.validationState,
            [props.name]: null,
          });
        }}
        className="pr-[60px] pt-1 pl-1 pb-1 border-2 border-solid border-blue-800 rounded-md"
        rows={12}
      ></textarea>
      {props.value ? (
        <p className="absolute top-0 right-0 text-gray-400 bg-white flex items-center m-[8px]">
          {props.value.length}/{props.maxLength}
        </p>
      ) : (
        ""
      )}
    </div>
  );
}
