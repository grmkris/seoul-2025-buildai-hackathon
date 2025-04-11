import { LoaderCircle } from "lucide-react";

export const Loader = (props: { className?: string }) => {
  return (
    <div className={`${props.className} text-teal-500`}>
      <LoaderCircle string={20} className="animate-spin" />
    </div>
  );
};
