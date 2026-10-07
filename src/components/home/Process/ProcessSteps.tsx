import Image from "next/image";
import Reveal from "@/components/animations/Reveal";
import type { ProcessStep } from "@/lib/api/home";

interface ProcessStepsProps {
    steps: ProcessStep[];
}

const ProcessSteps = ({ steps }: ProcessStepsProps) => {
    return (
        <div className="process_stack">
            {steps.map((step, index) => (
                <Reveal
                    key={`${step.title}-${index}`}
                    animation="fade-up"
                    delay={0.25 + index * 0.1}
                >
                    <div className="process_card">
                        {step.number ? (
                            <div className="process_number">
                                {step.number}
                            </div>
                        ) : null}

                        <div className="process_card_content">
                            {step.icon ? (
                                <div className="process_icon">
                                    <Image
                                        src={step.icon}
                                        alt=""
                                        width={45}
                                        height={45}
                                        className="img-contain"
                                    />
                                </div>
                            ) : null}

                            {step.title ? (
                                <h3 className="fsz-20 fw-500 mb-2">
                                    {step.title}
                                </h3>
                            ) : null}

                            {step.description ? (
                                <p className="fsz-14 mb-0">
                                    {step.description}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </Reveal>
            ))}
        </div>
    );
};

export default ProcessSteps;
