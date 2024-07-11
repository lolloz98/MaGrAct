import { useEffect, useState } from "react";
import { Group, Line, Text } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from './TimeContext';


export default function FunctionAnimated() {
    const t = useContext(TimeContext);
    const [points, setPoints] = useState<number[]>([]);
    const offest = {
        x: 100,
        y: 200
    }
    const f = (x: number) => Math.cos(x / 100) * 100;
    const bounds = {
        x_min: -100,
        x_max: 2500,
        t_min: 0,
        t_max: 5
    }

    // here we use a constant step, but for sure it's not best solution
    // it would be better to use something tight to the first and second derivative
    const step = 0.1;  

    useEffect(() => {
        const initFunc = () => {
            console.log("init")
            const tmp_points: number[] = []
            const last = (bounds.x_max - bounds.x_min) * t / (bounds.t_max - bounds.t_min) + bounds.x_min;
            for (let i = bounds.x_min; i <= last; i += step) {
                tmp_points.push(i + offest.x);
                tmp_points.push(f(i) + offest.y);
            }
            return tmp_points;
        };

        setPoints(initFunc);
    }, [t]);
    

    console.log(points);
    return (<Group>
                <Line
                    onClick={(event) => {console.log("Animated function clicked"); 
                    }}
                    points={points}
                    stroke='green'
                    strokeWidth={5}
                    />
            </Group>);
}