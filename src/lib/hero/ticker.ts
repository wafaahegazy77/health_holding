type Subscriber = {
    tick: (now: number) => void;
    minGap: () => number;
    last: number;
};

const subscribers = new Set<Subscriber>();
let rafId = 0;

function loop(now: number) {
    for (const sub of subscribers) {
        const gap = sub.minGap();
        if (now - sub.last >= gap) {
            sub.last = now;
            sub.tick(now);
        }
    }

    if (subscribers.size > 0) {
        rafId = requestAnimationFrame(loop);
    }
}

export function subscribeTicker(
    tick: (now: number) => void,
    minGap: () => number = () => 0
) {
    const sub: Subscriber = { tick, minGap, last: 0 };
    subscribers.add(sub);

    if (subscribers.size === 1) {
        rafId = requestAnimationFrame(loop);
    }

    return () => {
        subscribers.delete(sub);
        if (subscribers.size === 0) {
            cancelAnimationFrame(rafId);
            rafId = 0;
        }
    };
}
