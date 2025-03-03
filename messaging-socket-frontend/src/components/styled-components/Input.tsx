import { inputProps } from "../../types/types";

export default function Input({ props }: { props: inputProps }) {
  return (
    <>
      <div className="relative">
        <input
          type={props.type}
          id={props.id}
          name={props.name}
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
        />
        {props.value ? (
          <p className="absolute top-0 right-0 text-gray-400 bg-white flex items-center m-[8px]">
            {props.value.length}/{props.maxLength}
          </p>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
