"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ProcessStep {
    number?: string;
    icon: string;
    title: string;
    description: string;
}

interface ProcessAnimationProps {
    steps: ProcessStep[];
}

const CARD_GAP = 25;
const CARD_BLUR = 2;
const CARD_SCROLL = 650;
const FINAL_HOLD = 450;

const ProcessAnimation = ({
    steps,
}: ProcessAnimationProps) => {
    const stackRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const stack = stackRef.current;

        if (!stack || steps.length <= 1) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(
                ".process_card"
            );

            if (!cards.length) return;

            const mm = gsap.matchMedia();

            mm.add("(min-width: 992px)", () => {
                const cardHeight = cards[0].offsetHeight;

                /*
                 * Initial state
                 *
                 * 01 -> visible at the top
                 * 02 -> below 01
                 * 03 -> below 02
                 * 04 -> below 03
                 */
                cards.forEach((card, index) => {
                    gsap.set(card, {
                        position: "absolute",
                        top: 0,
                        insetInlineStart: 0,
                        width: "100%",

                        y: index * cardHeight,

                        /*
                         * Later cards must be above
                         * previous cards when they arrive.
                         */
                        zIndex: index + 1,

                        /*
                         * Only waiting cards are blurred.
                         */
                        filter:
                            index === 0
                                ? "blur(0px)"
                                : `blur(${CARD_BLUR}px)`,
                    });
                });

                /*
                 * First card is active initially.
                 */
                cards.forEach((card, index) => {
                    card.classList.toggle(
                        "active",
                        index === 0
                    );
                });


                /*
                 * Scroll distance:
                 *
                 * Each card gets its own scroll section.
                 * Then we add a final hold after all cards
                 * have reached their final positions.
                 */
                const stackDistance =
                    (cards.length - 1) * CARD_SCROLL +
                    FINAL_HOLD;


                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: stack,

                        start: "top top",

                        end: `+=${stackDistance}`,

                        pin: true,
                        pinSpacing: true,

                        scrub: 1,

                        anticipatePin: 1,

                        invalidateOnRefresh: true,

                        onUpdate: (self) => {
                            /*
                             * Ignore the final hold when
                             * determining the active card.
                             */
                            const buildProgress = Math.min(
                                1,
                                self.progress *
                                    (
                                        stackDistance /
                                        (
                                            (cards.length - 1) *
                                                CARD_SCROLL
                                        )
                                    )
                            );

                            const activeIndex = Math.min(
                                cards.length - 1,
                                Math.floor(
                                    buildProgress *
                                        (cards.length - 1)
                                )
                            );

                            cards.forEach(
                                (card, index) => {
                                    card.classList.toggle(
                                        "active",
                                        index ===
                                            activeIndex
                                    );
                                }
                            );
                        },

                        onLeaveBack: () => {
                            cards.forEach(
                                (card, index) => {
                                    card.classList.toggle(
                                        "active",
                                        index === 0
                                    );
                                }
                            );
                        },
                    },
                });


                /*
                 * Build the stack.
                 *
                 * Every card moves from its original
                 * position to its final 25px position.
                 */
                cards.forEach((card, index) => {
                    if (index === 0) return;

                    timeline.to(
                        card,
                        {
                            y: index * CARD_GAP,

                            /*
                             * Only THIS card loses its blur
                             * while entering the stack.
                             */
                            filter: "blur(0px)",

                            duration: 1,

                            ease: "none",
                        }
                    );
                });


                /*
                 * Final hold.
                 *
                 * No card has any animation here.
                 *
                 * The entire stack stays exactly where
                 * it finished until the pin ends.
                 */
                timeline.to(
                    {},
                    {
                        duration:
                            FINAL_HOLD /
                            CARD_SCROLL,
                    }
                );


                return () => {
                    timeline.scrollTrigger?.kill();
                    timeline.kill();
                };
            });


            /*
             * Mobile
             */
            mm.add("(max-width: 991px)", () => {
                gsap.set(cards, {
                    clearProps:
                        "position,top,insetInlineStart,width,y,zIndex,filter",
                });

                cards.forEach(
                    (card, index) => {
                        card.classList.toggle(
                            "active",
                            index === 0
                        );
                    }
                );
            });


            return () => mm.revert();
        }, stackRef);

        return () => {
            ctx.revert();
        };
    }, [steps]);


    return (
        <div
            ref={stackRef}
            className="process_stack"
        >
            {steps.map((step, index) => (
                <div
                    className={`process_card ${
                        index === 0 ? "active" : ""
                    }`}
                    key={`${step.title}-${index}`}
                >

                    {/* Step Number */}
                    <div className="process_number">
                        {step.number ||
                            `0${index + 1}`}
                    </div>


                    {/* Card Content */}
                    <div className="process_card_content">

                        {/* Icon - API */}
                        <div className="process_icon">
                            <Image
                                src={step.icon}
                                alt=""
                                width={45}
                                height={45}
                                className="img-contain"
                            />
                        </div>


                        {/* Title - API */}
                        <h3 className="fsz-20 fw-500 mb-2">
                            {step.title}
                        </h3>


                        {/* Description - API */}
                        <p className="fsz-14 mb-0">
                            {step.description}
                        </p>

                    </div>

                </div>
            ))}
        </div>
    );
};

export default ProcessAnimation;