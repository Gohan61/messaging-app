import { ReactNode } from "react";

export default function FormComponent({ children }: { children: ReactNode }) {
  return (
    <form action="" className="border border-blue-900 rounded-md p-4 w-fit ">
      {children}
    </form>
  );
}
