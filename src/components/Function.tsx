import { useEffect, useMemo, useState } from "react";
import { Line } from "react-konva";

export default function Function() {
    const [points, setPoints] = useState<number[]>([]);
    const offest = {
        x: 100,
        y: 200
    }
    const f = (x: number) => Math.cos(x / 100) * 100;
    const bounds = {
        x_min: -100,
        x_max: 2500
    }

    // here we use a constant step, but for sure it's not best solution
    // it would be better to use something tight to the first and second derivative
    const step = 0.1;  
    const initFunc = () => {
        console.log("init")
        const tmp_points: number[] = []
        for (let i = bounds.x_min; i <= bounds.x_max; i += step) {
            tmp_points.push(i + offest.x);
            tmp_points.push(f(i) + offest.y);
        }
        return tmp_points;
    };

    useEffect(() => {
        setPoints(initFunc);
    }, []);
    

    console.log(points);
    return <Line
                points={points}
                stroke='blue'
                strokeWidth={1}
                />
}