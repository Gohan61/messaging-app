import { SubmitFunctionType, formState } from "../../types/types";

export default function SubmitButton({
  submitFunction,
  body,
}: {
  submitFunction: SubmitFunctionType;
  body: formState;
}) {
  return (
    <button
      className="bg-blue-500 shadow-lg shadow-blue-500/50 text-white font-bold px-4 py-2 rounded-md"
      type="submit"
      onClick={(e) => submitFunction(e, body)}
    >
      Submit
    </button>
  );
}
