import React, { useState, useEffect, FC } from 'react';
import './Timer.less';

interface TimerProps {
    timer: number
}

const Timer: FC<TimerProps> = ({ timer }) => {
    const [seconds, setSeconds] = useState(timer);

    /**
     * setSeconds- нужен для того чтобы при редактировании если юзер поменяет timer, обновить стейт seconds
     */
    useEffect (() => {
        setSeconds(timer)
    }, [timer])

    /**
     * useEffect срабатывает только тогда когда seconds меняется и каждуюсекунду мы минусуем у стейта seconds на -1
     */
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (seconds > 0) {
            interval = setInterval(() => {
                setSeconds((seconds: number) => seconds - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [seconds]);
    
    return (
        <div className="time">
            <span className="time_inner timeOut">
                {seconds}s
            </span>
            {seconds == 0 ? <h3 className='timeOutTitle'>Время истекло!</h3> : null}
        </div>
    );
};

export default Timer;