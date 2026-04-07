export interface DisplayOption {
    value: string;
    name: string;
}

export const DISPLAY_LIST: Array<DisplayOption> = [
    { value: "BIG_BIG_ICON", name: "아주 큰 아이콘" },
    { value: "BIG_ICON", name: "큰 아이콘" },
    { value: "MEDIUM_ICON", name: "보통 아이콘" },
    { value: "SMALL_ICON", name: "작은 아이콘" },
    { value: "DETAIL", name: "자세히" },
];

export const DEFAULT_DISPLAY_TYPE = DISPLAY_LIST[2].value;
