export default function Label({
  htmlForValue,
  labelText,
}: {
  htmlForValue: string;
  labelText: string;
}) {
  return (
    <label htmlFor={htmlForValue} className="font-semibold">
      {labelText}
    </label>
  );
}
