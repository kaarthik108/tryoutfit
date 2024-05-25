import clsx from "clsx";
import Image from "next/image";

export function ImageGrid({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: { title: string; amount: string; currencyCode: string };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group relative flex h-[90%] w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-900",
        {
          "border-2 border-blue-400": active,
          "border-transparent": !active,
        }
      )}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <Image
          className={clsx(
            "relative h-full w-full object-contain transition duration-500 ease-in-out group-hover:scale-105",
            {
              "opacity-80 group-hover:opacity-100": isInteractive,
            }
          )}
          {...props}
        />
      ) : null}
      {label ? (
        <div
          className={clsx(
            "absolute bottom-0 justify-center flex w-full px-4 pb-4"
          )}
        >
          <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
            <h3 className="mr-2 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">
              {label.title}
            </h3>
            <div className="rounded-lg p-3">
              ${label.amount} {label.currencyCode}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
