interface SliceDateStringPropsType {
    date: number;
}

export const sliceDateString = ({ date }: SliceDateStringPropsType) =>
    `0${date}`.slice(-2);
