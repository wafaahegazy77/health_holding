import Image from "next/image";
import Reveal from "@/components/animations/Reveal";

interface ProcessStep {
    number?: string;
    icon: string;
    title: string;
    description: string;
}

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
                        <div className="process_number">
                            {step.number || `0${index + 1}`}
                        </div>

                        <div className="process_card_content">
                            <div className="process_icon">
                                <Image
                                    src={step.icon}
                                    alt=""
                                    width={45}
                                    height={45}
                                    className="img-contain"
                                />
                            </div>

                            <h3 className="fsz-20 fw-500 mb-2">
                                {step.title}
                            </h3>

                            <p className="fsz-14 mb-0">
                                {step.description}
                            </p>
                        </div>
                    </div>
                </Reveal>
            ))}
        </div>
    );
};

export default ProcessSteps;
