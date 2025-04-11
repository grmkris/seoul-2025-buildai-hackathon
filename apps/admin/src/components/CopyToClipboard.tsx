import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const CopyToClipboard = (props: {
  textToCopy: string;
  textToShow?: string;
  className?: string;
}) => {
  const copyOrderIdToClipboard = () => {
    navigator.clipboard.writeText(props.textToCopy).then(() => {
      toast.success(
        `${props?.textToShow} ${props?.textToShow ? "c" : "C"}opied to clipboard`,
      );
    });
  };

  return (
    <Button
      onClick={copyOrderIdToClipboard}
      variant="ghost"
      className={props.className}
    >
      <Copy className="h-5 w-5 text-gray-500" />
    </Button>
  );
};
