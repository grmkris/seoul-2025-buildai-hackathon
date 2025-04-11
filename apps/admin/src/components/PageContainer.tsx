import type { ReactNode } from "react";

export const PageContainer = (props: {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode[];
  children: ReactNode;
}) => {
  return (
    <>
      <div className="flex justify-between mb-3">
        <div className="">
          <h1 className="text-3xl font-bold tracking-tight">{props.title}</h1>
          <p className="text-gray-500 text-sm">{props?.description}</p>
        </div>
        {props.actions && <div className="flex gap-2">{props.actions}</div>}
      </div>
      {props.children}
    </>
  );
};
