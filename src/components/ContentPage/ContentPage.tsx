import React from "react";

import "./_ContentPage.scss";

type ContentPageSection = {
    title: string;
    content: string;
};

type ContentPageProps = {
    title: string;
    updatedAt: string;
    sections: ContentPageSection[];
};

const ContentPage = ({
    title,
    updatedAt,
    sections,
}: ContentPageProps) => {
    return (
        <section className="content_pg section-padding">
            <div className="container">
                <div className="section-title">
                    <h1>{title}</h1>
                    <span>{updatedAt}</span>
                </div>

                <div className="content_pg_content">
                    {sections.map((section, index) => (
                        <div
                            className="content_pg_section"
                            key={index}
                        >
                            <h2>{section.title}</h2>
                            <p>{section.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContentPage;