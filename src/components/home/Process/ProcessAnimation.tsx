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

            /*
             * -------------------------------------------
             * Desktop
             * -------------------------------------------
             */

            mm.add("(min-width: 992px)", () => {
                const cardHeight = cards[0].offsetHeight;

                /*
                 * Initial state
                 *
                 * 01 -> visible
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
                         * Later cards sit above
                         * previous cards when they arrive.
                         */
                        zIndex: index + 1,

                        /*
                         * ONLY waiting cards are blurred.
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
                 * Total animation distance.
                 *
                 * Each card gets its own scroll distance,
                 * then we add a final hold.
                 */

                const buildDistance =
                    (cards.length - 1) * CARD_SCROLL;

                const stackDistance =
                    buildDistance + FINAL_HOLD;


                /*
                 * -------------------------------------------
                 * ScrollTrigger
                 * -------------------------------------------
                 *
                 * The Process must pin BELOW the fixed
                 * Navbar instead of starting at viewport top.
                 */

                const getNavbarHeight = () => {
                    const navbar =
                        document.querySelector<HTMLElement>(
                            ".homeNav"
                        );

                    return navbar?.offsetHeight || 0;
                };


                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: stack,

                        /*
                         * IMPORTANT:
                         *
                         * Instead of:
                         *
                         *     start: "top top"
                         *
                         * we dynamically account for the
                         * fixed Navbar height.
                         */

                        start: () => {
                            const navbarHeight =
                                getNavbarHeight();

                            return `top top+=${navbarHeight + 20}`;
                        },

                        end: () =>
                            `+=${stackDistance}`,

                        pin: true,
                        pinSpacing: true,

                        scrub: 1,

                        anticipatePin: 1,

                        invalidateOnRefresh: true,


                        /*
                         * -----------------------------------
                         * Active Card
                         * -----------------------------------
                         */

                        onUpdate: (self) => {
                            /*
                             * Ignore the final hold when
                             * calculating the active card.
                             */

                            const buildProgress =
                                Math.min(
                                    1,
                                    self.progress *
                                        (
                                            stackDistance /
                                            buildDistance
                                        )
                                );


                            const activeIndex =
                                Math.min(
                                    cards.length - 1,
                                    Math.floor(
                                        buildProgress *
                                            (
                                                cards.length -
                                                1
                                            )
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


                        /*
                         * When scrolling back above
                         * the Process, restore card 01.
                         */

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
                 * -------------------------------------------
                 * Build Stack
                 * -------------------------------------------
                 *
                 * Each waiting card moves into its final
                 * position with a 25px gap.
                 */

                cards.forEach((card, index) => {
                    if (index === 0) return;

                    timeline.to(card, {
                        y: index * CARD_GAP,

                        /*
                         * ONLY the card entering the stack
                         * loses its blur.
                         */

                        filter: "blur(0px)",

                        duration: 1,

                        ease: "none",
                    });
                });


                /*
                 * -------------------------------------------
                 * Final Hold
                 * -------------------------------------------
                 *
                 * After all cards reach their final positions,
                 * NOTHING moves anymore.
                 *
                 * The stack remains pinned in place until
                 * the hold distance is completed.
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
             * -------------------------------------------
             * Mobile / Tablet
             * -------------------------------------------
             */

            mm.add("(max-width: 991px)", () => {
                gsap.set(cards, {
                    clearProps:
                        "position,top,insetInlineStart,width,y,zIndex,filter",
                });


                cards.forEach((card, index) => {
                    card.classList.toggle(
                        "active",
                        index === 0
                    );
                });
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