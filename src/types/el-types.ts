
export type ElTagType = import("element-plus/es/utils").EpPropMergeType<
  StringConstructor,
  "success" | "warning" | "info" | "primary" | "danger",
  unknown
>

export type ElButtonType = import("element-plus/es/utils").EpPropFinalized<
  StringConstructor,
  "" | "text" | "default" | "success" | "warning" | "info" | "primary" | "danger",
  unknown,
  "",
  boolean
>

export type ElPopPlacement = import("element-plus/es/utils").EpPropMergeType<
  (new (...args: any[]) =>
    "top" | "bottom" | "left" | "right" | "auto" |
    "auto-start" | "auto-end" |
    "top-start" | "top-end" |
    "bottom-start" | "bottom-end" |
    "right-start" | "right-end" |
    "left-start" | "left-end") |
  (() => import("@popperjs/core").Placement) |
  ((new (...args: any[]) =>
    "top" | "bottom" | "left" | "right" | "auto" |
    "auto-start" | "auto-end" |
    "top-start" | "top-end" |
    "bottom-start" | "bottom-end" |
    "right-start" | "right-end" |
    "left-start" | "left-end") |
    (() => import("@popperjs/core").Placement))[],
  unknown,
  unknown
>
