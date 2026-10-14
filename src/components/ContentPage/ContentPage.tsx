import React from "react";

import "./_ContentPage.scss";

type ContentPageSection = {
    title: string;
    content: string;
};

type ContentPageProps = {
    title: string;
    updatedAt?: string;
    /** HTML body from CMS (`content` field). */
    contentHtml?: string;
    /** Legacy static sections fallback. */
    sections?: ContentPageSection[];
};

function looksLikeHtml(value: string) {
    return /<\/?[a-z][\s\S]*>/i.test(value);
}

const ContentPage = ({
    title,
    updatedAt,
    contentHtml,
    sections = [],
}: ContentPageProps) => {
    const html = contentHtml?.trim() || "";

    return (
        <section className="content_pg section-padding">
            <div className="container">
                <div className="section-title">
                    <h1>{title}</h1>
                    {updatedAt ? <span>{updatedAt}</span> : null}
                </div>

                <div className="content_pg_content">
                    {html ? (
                        <div
                            className="content_pg_body"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    ) : (
                        sections.map((section, index) => (
                            <div
                                className="content_pg_section"
                                key={`${section.title}-${index}`}
                            >
                                {section.title ? <h2>{section.title}</h2> : null}
                                {looksLikeHtml(section.content) ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: section.content,
                                        }}
                                    />
                                ) : (
                                    <p>{section.content}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ContentPage;
