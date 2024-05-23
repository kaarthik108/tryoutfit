import clsx from "clsx";

const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0  justify-center flex w-full px-4 pb-4"
      )}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-2 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
          {title}
        </h3>
        <div className="rounded-lg p-3">
          ${amount} {currencyCode}
        </div>
      </div>
    </div>
  );
};

export default Label;
