import React from "react";

interface DocCardProps {
    title: string;
    children: React.ReactNode;
}

const DocCard = ({ title, children }: DocCardProps) => (
    <div className="doc_card">
        <div className="cardTitle">{title}</div>
        <div className="cardContent">{children}</div>
    </div>
);

export default DocCard;
