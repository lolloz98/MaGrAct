import { useEffect, useState } from "react";
import { Group, Line, Text } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from './TimeContext';


export default function Function() {
    const timeC = useContext(TimeContext);
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

    useEffect(() => {
        const initFunc = () => {
            console.log("init")
            const tmp_points: number[] = []
            for (let i = bounds.x_min; i <= bounds.x_max; i += step) {
                tmp_points.push(i + offest.x);
                tmp_points.push(f(i) + offest.y);
            }
            return tmp_points;
        };

        setPoints(initFunc);
    }, []);
    

    console.log(points);
    return (<Group
                onClick={() => console.log("group with normal function clicked")}
        >
                <Line
                    onClick={() => console.log("normal function clicked")}
                    points={points}
                    stroke='blue'
                    strokeWidth={30}
                    draggable={true}
                    />
                <Text text={`${timeC}`} offsetX={-500} fontSize={15} fill={"white"}/>
            </Group>);
}