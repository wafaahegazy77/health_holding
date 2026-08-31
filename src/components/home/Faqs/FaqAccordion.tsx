"use client";

import { useState } from "react";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqAccordionProps {
    items: FaqItem[];
}

const FaqAccordion = ({
    items,
}: FaqAccordionProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleItem = (index: number) => {
        setActiveIndex(
            activeIndex === index ? -1 : index
        );
    };

    return (
        <div className="faq_accordion">

            {items.map((item, index) => (
                <div
                    className={`faq_item ${
                        activeIndex === index
                            ? "active"
                            : ""
                    }`}
                    key={index}
                >

                    <button
                        type="button"
                        className="faq_question"
                        onClick={() =>
                            toggleItem(index)
                        }
                    >
                        <span>
                            {item.question}
                        </span>

                        <span className="faq_toggle">
                            <i
                                className={`fa-regular ${
                                    activeIndex === index
                                        ? "fa-minus"
                                        : "fa-plus"
                                }`}
                            ></i>
                        </span>
                    </button>


                    <div className="faq_answer">
                        <p className="fsz-14 mb-0">
                            {item.answer}
                        </p>
                    </div>

                </div>
            ))}

        </div>
    );
};

export default FaqAccordion;