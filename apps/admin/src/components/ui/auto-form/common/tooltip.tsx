import type { FieldConfigItem } from "../types";

function AutoFormTooltip({
  fieldConfigItem,
}: {
  fieldConfigItem: FieldConfigItem;
}) {
  return (
    <>
      {fieldConfigItem?.description && (
        <p className="text-sm text-gray-500 dark:text-white">
          {fieldConfigItem.description}
        </p>
      )}
    </>
  );
}

export default AutoFormTooltip;
